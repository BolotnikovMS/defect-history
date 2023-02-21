import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'distribution_groups_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('id_user', 10).unsigned().index().references('id').inTable('users')
      table
        .integer('id_distribution_group', 10)
        .unsigned()
        .index()
        .references('id')
        .inTable('distribution_groups')
      table.unique(['id_user', 'id_distribution_group'])

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
