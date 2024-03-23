import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import DefectGroup from 'App/Models/DefectGroup'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class DefectClassifier extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user_created: number

  @column()
  public id_group_defect: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'id_user_created',
    localKey: 'id',
  })
  public user_created: BelongsTo<typeof User>

  @belongsTo(() => DefectGroup, {
    foreignKey: 'id_group_defect',
    localKey: 'id',
  })
  public defect_classifiers: BelongsTo<typeof DefectGroup>
}
