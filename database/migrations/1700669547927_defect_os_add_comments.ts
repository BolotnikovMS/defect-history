import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'defect_os'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('comment').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('comment')
    })
  }
}
