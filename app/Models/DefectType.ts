import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Defect from 'App/Models/Defect'

export default class DefectType extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user: number

  @column()
  public type_defect: string

  @column()
  public defect_description: string

  @column.dateTime({
    autoCreate: true,
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
  })
  public updatedAt: DateTime

  // Relations
  @hasMany(() => Defect, {
    foreignKey: 'id_type_defect',
    localKey: 'id',
  })
  public defects: HasMany<typeof Defect>
}
