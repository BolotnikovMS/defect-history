import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'substations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('id_user_created', 10).notNullable()
      table
        .integer('id_district', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('districts')
      table.text('name').notNullable()
      table.boolean('importance').defaultTo(false)

      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
