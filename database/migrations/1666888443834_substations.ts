import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'substations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('id_user', 10).notNullable()
      table.string('name', 255).notNullable()
      table.string('importance').checkIn(['true', 'false']).defaultTo('false')
      table.string('voltage_class', 50)

      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
