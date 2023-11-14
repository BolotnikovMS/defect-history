import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'defect_os'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('id_user_created', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('users')
      table.integer('id_user_updater', 10).nullable()
      table
        .integer('id_department', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('departments')
      table
        .integer('id_substation', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('substations')
      table.string('accession_substations', 250).notNullable()
      table.text('description_defect').notNullable()
      // Срок устранения
      table.dateTime('term_elimination').notNullable()
      table.boolean('importance').defaultTo(false)
      // Дата устранения
      table.dateTime('elimination_date').nullable().defaultTo(null)
      table.text('result').nullable().defaultTo(null)
      table.integer('id_name_eliminated', 10).unsigned().index()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
