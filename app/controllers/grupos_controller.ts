import Grupo from '#models/grupo'
import Usuario from '#models/usuario'
import UsuarioGrupo from '#models/usuario_grupo'
import env from '#start/env'
import {
  addMembro,
  atualizarGrupo,
  convidarMembro,
  criarGrupo,
  deletarGrupo,
  listarMembros,
  removerMembro,
} from '#validators/grupo'

import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'

export default class GruposController {
  async store({ request, response, auth }: HttpContext) {
    try {
      const { nome, imagem, participantes } = await request.validateUsing(criarGrupo)

      const grupo = await Grupo.create({
        nome,
        imagem,
      })

      await UsuarioGrupo.create({
        usuarioId: auth.user!.id,
        grupoId: grupo.id,
        admin: true,
      })

      if (participantes?.length)
        await UsuarioGrupo.createMany(
          participantes.map((participante) => {
            return {
              usuarioId: participante,
              grupoId: grupo.id,
            }
          })
        )

      return response.created({
        mensagem: `Grupo ${grupo.nome} criado com sucesso!`,
        grupoId: grupo.id,
      })
    } catch (error) {
      throw error
    }
  }

  async index({ response, auth }: HttpContext) {
    try {
      const grupos = (
        await db.rawQuery(
          `
        SELECT g.id, g.nome, g.imagem
        FROM grupo g
          INNER JOIN usuario_grupo ug ON ug.grupo_id = g.id
        WHERE ug.usuario_id = ?;
      `,
          [auth.user!.id]
        )
      )[0]

      if (!grupos?.length)
        return response.notFound({
          mensagem: `Grupos não encontrados!`,
        })

      return response.ok({
        mensagem: `Grupos encontrados!`,
        grupos,
      })
    } catch (error) {
      throw error
    }
  }

  async update({ request, response }: HttpContext) {
    try {
      const { nome, imagem, grupo } = await request.validateUsing(atualizarGrupo)

      await db
        .from('grupo')
        .update({
          nome,
          imagem,
        })
        .where({
          id: grupo.id,
        })

      return response.ok({
        mensagem: `Grupo ${grupo.nome} atualizado com sucesso!`,
      })
    } catch (error) {
      throw error
    }
  }

  async delete({ request, response }: HttpContext) {
    try {
      const { grupo } = await request.validateUsing(deletarGrupo)

      await db.from('grupo').delete().where({
        id: grupo.id,
      })

      return response.ok({
        mensagem: `Grupo ${grupo.nome} excluído!`,
      })
    } catch (error) {
      throw error
    }
  }

  async addMembro({ request, response }: HttpContext) {
    try {
      const { usuarioId, grupo } = await request.validateUsing(addMembro)

      const usuarioExiste = await Usuario.find(usuarioId)
      if (!usuarioExiste)
        return response.notFound({
          mensagem: `Usuário ${usuarioId} não encontrado!`,
        })

      const usuarioJaEstaNoGrupo = await UsuarioGrupo.findBy({
        usuarioId,
      })
      if (usuarioJaEstaNoGrupo)
        return response.badRequest({
          mensagem: `O usuário já está no grupo ${grupo.nome}!`,
        })

      await UsuarioGrupo.create({
        grupoId: grupo.id,
        usuarioId,
      })

      return response.created({
        mensagem: `Usuário adicionado ao grupo ${grupo.nome}`,
      })
    } catch (error) {
      throw error
    }
  }

  async convidarMembro({ request, response, auth }: HttpContext) {
    try {
      const { email, grupo } = await request.validateUsing(convidarMembro)

      const usuario = auth.user!

      await mail.sendLater((message) => {
        message
          .to(email)
          .from(usuario.email, usuario.nome)
          .subject('[DividAI] Convite de Grupo')
          .text(
            `${usuario.nome} convidou você para o grupo ${grupo.nome}, clique no link para entrar no grupo: http://${env.get('HOST')}:${env.get('PORT')}`
          )
      })

      return response.ok({
        mensagem: `Convite enviado para ${email} para o grupo ${grupo.nome}.`,
      })
    } catch (error) {
      throw error
    }
  }

  async indexMembros({ request, response }: HttpContext) {
    try {
      const { grupo } = await request.validateUsing(listarMembros)

      const membros = (
        await db.rawQuery(
          `
          SELECT u.id, u.nome
          FROM usuario u
          INNER JOIN usuario_grupo ug ON ug.usuario_id = u.id
          INNER JOIN grupo g ON g.id = ug.grupo_id
          WHERE g.id = ?;
        `,
          [grupo.id]
        )
      )[0]

      if (!membros?.length)
        return response.notFound({
          mensagem: `O grupo não possui membros.`,
        })

      return response.ok({
        mensagem: `Membros do grupo ${grupo.nome} encontrados!`,
        membros,
      })
    } catch (error) {
      throw error
    }
  }

  async deleteMembro({ request, response, auth }: HttpContext) {
    try {
      const { usuarioId, grupo } = await request.validateUsing(removerMembro)

      const usuarioTentandoSeRemover = usuarioId == auth.user!.id
      if (usuarioTentandoSeRemover)
        return response.badRequest({
          mensagem: `Para remover você mesmo, exclua o grupo!`,
        })

      await db.from('usuario_grupo').delete().where({
        usuario_id: usuarioId,
        grupo_id: grupo.id,
      })

      return response.ok({
        mensagem: `Usuário ${usuarioId} removido do grupo ${grupo.nome}.`,
      })
    } catch (error) {
      throw error
    }
  }
}
