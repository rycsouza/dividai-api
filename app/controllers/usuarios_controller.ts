import Usuario from '#models/usuario'
import { criarUsuarioValidator, loginUsuarioValidator } from '#validators/usuario'

import type { HttpContext } from '@adonisjs/core/http'

export default class UsuariosController {
  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(criarUsuarioValidator)

      payload['username'] =
        payload['username']?.toLowerCase() ??
        payload['nome']?.toLowerCase()?.replace(/\s/g, '').slice(0, 20)

      //pegar o max id do username, regex de numero e usar o +1 para criar o novo
      const usernameExists = await Usuario.query().where({ username: payload['username'] })

      if (usernameExists?.length)
        payload['username'] = `${payload['username']}${usernameExists?.length + 1}`

      const usuario = await Usuario.create(payload)
      const token = await Usuario.accessTokens.create(usuario)

      return response.status(201).send({
        message: 'Usuário criado com sucesso.',
        token: token.value!.release(),
      })
    } catch (error) {
      throw error
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const payload = (await request.validateUsing(loginUsuarioValidator)) as Record<string, any>

      if (!payload?.['email'] && !payload?.['telefone'] && !payload?.['username'])
        return response.badRequest({
          message: 'Pelo menos um dos campos (email, telefone ou username) deve ser informado.',
        })

      const whereObj: { [key: string]: any } = {}
      Object.keys(payload).forEach((key) => {
        if (!payload?.[key] || key == 'senha') return

        whereObj[key] = payload[key]
      })

      const usuario = await Usuario.findBy(whereObj)
      if (!usuario)
        return response.badRequest({
          message: 'Usuário não encontrado. Verifique os dados informados.',
        })

      //validar senhas antes
      const token = await Usuario.accessTokens.create(usuario)

      return response.status(200).send({
        message: 'Login realizado com sucesso.',
        token: token.value!.release(),
      })
    } catch (error) {
      throw error
    }
  }
}
