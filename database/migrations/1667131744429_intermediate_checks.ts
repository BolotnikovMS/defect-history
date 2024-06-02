import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'intermediate_checks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('id_defect', 10).notNullable().unsigned().index()
      table
        .integer('id_user_created', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('users')
      table.integer('id_inspector', 10).notNullable().unsigned().index()
      table.string('type_defect', 15).notNullable().defaultTo('tm')
      table.dateTime('check_date').notNullable()
      table.text('description_results').notNullable()
      table.integer('transferred', 10).nullable().unsigned().index()

      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
