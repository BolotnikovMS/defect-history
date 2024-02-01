import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import GroupDefect from 'App/Models/GroupDefect'
import { DateTime } from 'luxon'

export default class DefectClassifier extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_group_defect: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => GroupDefect, {
    foreignKey: 'id_group_defect',
    localKey: 'id',
  })
  public defect_classifiers: BelongsTo<typeof GroupDefect>
}
