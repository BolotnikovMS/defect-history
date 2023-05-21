import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'defects'

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
      table
        .integer('id_type_defect', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('defect_types')
      table
        .integer('id_user_created', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('users')
      table
        .integer('id_accession', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('accession_substations')
      table.text('description_defect').notNullable()
      table.text('defect_img').nullable()
      table.dateTime('term_elimination').notNullable()
      table.boolean('importance').defaultTo(false)
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
