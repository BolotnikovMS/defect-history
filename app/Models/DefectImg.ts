import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import Defect from 'App/Models/Defect'
import { DateTime } from 'luxon'

export default class DefectImg extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_defect: number

  @column()
  public path_img: string

  @column()
  public status: string

  @column()
  public extname: string

  @column()
  public size: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Defect, {
    foreignKey: 'id',
    localKey: 'id',
  })
  public defect_img: BelongsTo<typeof Defect>
}
