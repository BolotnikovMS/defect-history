import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'intermediate_checks'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('type_defect', 15).notNullable().defaultTo('tm')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('type_defect')
    })
  }
}
