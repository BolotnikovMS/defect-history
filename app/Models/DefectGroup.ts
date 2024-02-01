import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import DefectClassifier from './DefectClassifier'

export default class DefectGroup extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => DefectClassifier, {
    foreignKey: 'id_group_defect',
    localKey: 'id',
  })
  public classifiers: HasMany<typeof DefectClassifier>
}
