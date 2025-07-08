import Usuario from '#models/usuario'
import { criarUsuarioValidator, loginUsuarioValidator } from '#validators/usuario'

import type { HttpContext } from '@adonisjs/core/http'

export default class UsuariosController {
  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(criarUsuarioValidator)

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

      const usuario = await Usuario.verifyCredentials(payload['email'], payload['senha'])
      if (!usuario)
        return response.badRequest({
          message: 'Usuário não encontrado. Verifique os dados informados.',
        })

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
