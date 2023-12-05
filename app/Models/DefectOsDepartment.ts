import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'

export default class DefectOsDepartment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_defect: number

  @column()
  public id_department: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
