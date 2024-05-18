import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'defect_groups'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('importance').defaultTo(false)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('importance')
    })
  }
}
