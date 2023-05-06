import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users_permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('id_user').notNullable().unsigned().index().references('id').inTable('users')
      table
        .integer('id_permission')
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('permissions')
      table.unique(['id_user', 'id_permission'])

      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
