import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Department extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user_create: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => User, {
    localKey: 'id',
    foreignKey: 'id_department',
  })
  public department_users: HasMany<typeof User>
}
