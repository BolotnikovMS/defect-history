import {
  BaseModel,
  BelongsTo,
  HasMany,
  belongsTo,
  column,
  computed,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'

import Defect from 'App/Models/Defect'
import DistributionGroup from 'App/Models/DistributionGroup'
import { DateTime } from 'luxon'

export default class DefectType extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user_created: number

  @column({
    prepare: (value: number) => (value === 0 ? null : value),
  })
  public id_distribution_group: number | null

  @column()
  public type_defect: string

  @column({
    prepare: (value: string) => (value ? value : 'Описание дефекта не добавлено...'),
  })
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

  @computed()
  public get numberDefects() {
    return this.defects?.length
  }

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
