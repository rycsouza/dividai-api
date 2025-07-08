import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuario'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('data_cadastro')
      table.timestamp('data_atualizacao')

      table.string('nome').notNullable()
      table.string('email').notNullable().unique()
      table.string('telefone').unique()
      table.string('username').unique()
      table.string('senha').notNullable()
      table.string('avatar')
      table.string('ativo2FA')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
