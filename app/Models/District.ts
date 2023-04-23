import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, computed, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Substation from './Substation'

export default class District extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user_created: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get substationsCount() {
    return this.substations?.length
  }

  @hasMany(() => Substation, {
    localKey: 'id',
    foreignKey: 'id_district',
  })
  public substations: HasMany<typeof Substation>
}
