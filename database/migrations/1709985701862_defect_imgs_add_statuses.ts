import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'defect_imgs'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('status', 15).notNullable().defaultTo('open')
      table.string('extname')
      table.integer('size')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status'), table.dropColumn('extname'), table.dropColumn('size')
    })
  }
}
