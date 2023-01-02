import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'intermediate_checks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('id_defect', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('defects')
      table
        .integer('id_user', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('users')
      table
        .integer('id_inspector', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('staff')
      table.string('check_date', 15).notNullable()
      table.text('description_results').notNullable()
      table.text('transferred')

      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
