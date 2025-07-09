import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'grupo'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('data_cadastro')
      table.timestamp('data_atualizacao')

      table.string('nome').notNullable()
      table.string('imagem').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
