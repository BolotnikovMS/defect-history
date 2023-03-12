import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, HasMany, hasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Defect from 'App/Models/Defect'
import DistributionGroup from 'App/Models/DistributionGroup'

export default class DefectType extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user: number

  @column()
  public id_distribution_group: number | null

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

  @belongsTo(() => DistributionGroup, {
    foreignKey: 'id_distribution_group',
    localKey: 'id',
  })
  public group: BelongsTo<typeof DistributionGroup>
}
