import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'
import Despesa from './despesa.js'

export default class UsuarioDespesa extends BaseModel {
  static table = 'usuario_despesa'

  public static primaryKey = 'usuario_id'

  @column.dateTime({ autoCreate: true })
  declare data_cadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare data_atualizacao: DateTime

  @column()
  declare usuario_id: number

  @column()
  declare despesa_id: number

  @column()
  declare valor: number

  @belongsTo(() => Usuario, {
    foreignKey: 'usuario_id',
  })
  declare usuario: BelongsTo<typeof Usuario>

  @belongsTo(() => Despesa, {
    foreignKey: 'despesa_id',
  })
  declare despesa: BelongsTo<typeof Despesa>
}
