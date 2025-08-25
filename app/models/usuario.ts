import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Despesa from './despesa.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'telefone', 'username'],
  passwordColumnName: 'senha',
})

export default class Usuario extends compose(BaseModel, AuthFinder) {
  static table = 'usuario'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare email: string

  @column()
  declare telefone: string

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare senha: string

  @column()
  declare avatar: string

  @column()
  declare ativo2FA: boolean

  @column.dateTime({ autoCreate: true })
  declare dataCadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare dataAtualizacao: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(Usuario, {
    expiresIn: '365 days',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  @manyToMany(() => Despesa, {
    pivotTable: 'usuario_despesa',
    localKey: 'id',
    pivotForeignKey: 'usuario_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'despesa_id',
    pivotColumns: ['valor', 'pagador', 'data_cadastro', 'data_atualizacao'],
  })
  declare despesas: ManyToMany<typeof Despesa>
}
