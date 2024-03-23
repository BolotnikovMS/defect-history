import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'defect_os'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('id_defect_group', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('defect_groups')
      table
        .integer('id_defect_classifier', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('defect_classifiers')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {})
  }
}
