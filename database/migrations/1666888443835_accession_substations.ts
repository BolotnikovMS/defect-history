import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'accession_substations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('id_substation', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('substations')
      table.string('name', 255).notNullable()
      table.boolean('importance').defaultTo(false)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
