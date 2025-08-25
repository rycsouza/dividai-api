import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Grupo from './grupo.js'
import Usuario from './usuario.js'

export default class Despesa extends BaseModel {
  static table = 'despesa'

  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare data_cadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare data_atualizacao: DateTime

  @column()
  declare grupo_id: number

  @column()
  declare valor_total: number

  @column.date()
  declare ref_data: DateTime

  @column()
  declare descricao: string

  @column()
  declare tipo_divisao: string

  @column()
  declare categoria: string

  @column()
  declare pagador_id: number

  @belongsTo(() => Grupo, {
    foreignKey: 'grupo_id',
  })
  declare grupo: BelongsTo<typeof Grupo>

  @belongsTo(() => Usuario, {
    foreignKey: 'pagador_id',
  })
  declare pagador: BelongsTo<typeof Usuario>

  @manyToMany(() => Usuario, {
    pivotTable: 'usuario_despesa',
    localKey: 'id',
    pivotForeignKey: 'despesa_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'usuario_id',
    pivotColumns: ['valor', 'pagador', 'data_cadastro', 'data_atualizacao'],
  })
  declare usuarios: ManyToMany<typeof Usuario>
}
