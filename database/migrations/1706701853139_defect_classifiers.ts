import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'defect_classifiers'

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
      table
        .integer('id_group_defect', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('defect_groups')
      table.text('name').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
