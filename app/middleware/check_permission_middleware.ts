import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import db from '@adonisjs/lucid/services/db'

export default class CheckPermissionMiddleware {
  async handle({ request, response, auth }: HttpContext, next: NextFn) {
    const { id } = request.params()
    let { grupoId } = request.all()

    grupoId = grupoId ?? id

    if (!grupoId)
      return response.badRequest({
        mensagem: `O identificador do grupo é obrigatório.`,
      })

    if (!auth.user?.id)
      return response.unauthorized({
        mensagem: `Usuário não autenticado.`,
      })

    const grupo = (
      await db.rawQuery(
        `
              SELECT g.id, g.nome, g.imagem
              FROM grupo g
                INNER JOIN usuario_grupo ug ON ug.grupo_id = g.id
              WHERE ug.admin = true
                AND ug.usuario_id = ?
                AND ug.grupo_id = ?
              LIMIT 1;
            `,
        [auth.user!.id, grupoId]
      )
    )[0]?.[0]

    if (!grupo)
      return response.unauthorized({
        mensagem: `Você não tem autorização para administrar o grupo ${grupoId}.`,
      })

    request.updateBody({
      ...request.all(),
      grupo,
      id,
    })

    return await next()
  }
}
