import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from '../../app/Enums/Roles'
import * as argon2 from 'phc-argon2'
import { Departments } from 'App/Enums/Departments'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('id_user_created').nullable()
      table.boolean('blocked').defaultTo(false)
      table.string('username', 50).notNullable().unique()
      table.string('surname', 30).notNullable()
      table.string('name', 30).notNullable()
      table.string('patronymic', 30).notNullable()
      table.string('position', 50).notNullable()
      table
        .integer('id_department', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('departments')
      table
        .integer('id_role', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('roles')
        .defaultTo(Roles.USER)
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.timestamps()
    })

    this.defer(async (db) => {
      await db.table(this.tableName).insert({
        username: 'Admin',
        surname: 'Admin',
        name: 'Admin',
        patronymic: 'Admin',
        position: 'Admin',
        id_department: Departments.admins,
        id_role: Roles.ADMIN,
        email: 'admin@defect.ru',
        password: await argon2.hash('12345678'),
      })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
