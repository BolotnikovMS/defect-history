import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'
import { DateTime } from 'luxon'
import DefectClassifier from './DefectClassifier'

export default class DefectGroup extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user_created: number

  @column()
  public name: string

  @column()
  public type: string

  @column({
    consume: (value: string): boolean => Boolean(value),
  })
  public importance: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'id_user_created',
    localKey: 'id',
  })
  public user_created: BelongsTo<typeof User>

  @hasMany(() => DefectClassifier, {
    foreignKey: 'id_group_defect',
    localKey: 'id',
  })
  public classifiers: HasMany<typeof DefectClassifier>
}
