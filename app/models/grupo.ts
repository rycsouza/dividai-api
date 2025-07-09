import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Grupo extends BaseModel {
  static table = 'grupo'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare imagem: string

  @column.dateTime({ autoCreate: true })
  declare dataCadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare dataAtualizacao: DateTime
}
