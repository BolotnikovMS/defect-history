import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Substation from './Substation'

export default class District extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Substation, {
    localKey: 'id',
    foreignKey: 'id_district',
  })
  public substations: HasMany<typeof Substation>
}
