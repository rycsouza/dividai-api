import Usuario from '#models/usuario'
import { criarUsuarioValidator } from '#validators/usuario'
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
      const payload = await request.validateUsing(loginUsuarioValidator)

      const whereObj: { [key: string]: any } = {}
      Object.keys(payload).forEach((key) => {
        if (key != 'senha') whereObj[key] = payload[key]
      })

      const usuario = await Usuario.query().where(whereObj).first()
      if (!usuario) return response.badRequest('Usuário não encontrado.')

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
