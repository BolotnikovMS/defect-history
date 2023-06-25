import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Departments } from 'App/Enums/Departments'

export default class extends BaseSchema {
  protected tableName = 'departments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('id_user_created', 10).nullable()
      table.text('name').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([
        {
          id: Departments.admins,
          name: 'Admins',
        },
        {
          id: Departments.withoutDepartment,
          name: 'Без отдела',
        },
      ])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
