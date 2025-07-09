import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UsuarioGrupo extends BaseModel {
  static table = 'usuario_grupo'

  @column()
  declare grupoId: number

  @column()
  declare usuarioId: number

  @column()
  declare admin: boolean

  @column.dateTime({ autoCreate: true })
  declare dataCadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare dataAtualizacao: DateTime
}
