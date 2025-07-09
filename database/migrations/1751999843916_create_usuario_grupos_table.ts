import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuario_grupo'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.timestamp('data_cadastro')
      table.timestamp('data_atualizacao')

      table
        .integer('grupo_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('grupo')
        .onDelete('CASCADE')
      table
        .integer('usuario_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('usuario')
        .onDelete('CASCADE')
      table.boolean('admin').notNullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
