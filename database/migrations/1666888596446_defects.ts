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
        .references('substations.id')
      table
        .integer('id_type_defect', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('defect_types.id')
      table.integer('id_user', 10).notNullable().unsigned().index()
      table.string('accession', 255).notNullable()
      table.text('description_defect').notNullable()
      table.text('defect_img').nullable()
      table.dateTime('term_elimination').nullable().defaultTo(null)
      table.string('importance').checkIn(['true', 'false']).defaultTo('false')
      table.string('elimination_date', 15)
      table.text('result').nullable().defaultTo(null)
      table.integer('id_name_eliminated', 10).unsigned().index().references('staff.id')

      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
