import {
  BaseModel,
  HasMany,
  HasManyThrough,
  column,
  computed,
  hasMany,
  hasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import Defect from 'App/Models/Defect'
import DefectOs from 'App/Models/DefectOs'
import Substation from 'App/Models/Substation'

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

  @computed()
  public get numberOpenDefectsDistrict() {
    const numberDistrictDefectTm = this.district_defects?.filter(
      (defectTm) => defectTm.elimination_date === null
    ).length
    const numberDistrictDefectOs = this.district_defects_os?.filter(
      (defectOs) => defectOs.elimination_date === null
    ).length

    return numberDistrictDefectTm + numberDistrictDefectOs
  }

  @computed()
  public get numberDefects() {
    return this.substations
      .map((substation) => substation.numberOpenDefects)
      .reduce((sum, nextValue) => sum + nextValue)
  }

  @hasMany(() => Substation, {
    localKey: 'id',
    foreignKey: 'id_district',
  })
  public substations: HasMany<typeof Substation>

  @hasManyThrough([() => Defect, () => Substation], {
    localKey: 'id',
    foreignKey: 'id_district',
    throughLocalKey: 'id',
    throughForeignKey: 'id_substation',
  })
  public district_defects: HasManyThrough<typeof Defect>

  @hasManyThrough([() => DefectOs, () => Substation], {
    localKey: 'id',
    foreignKey: 'id_district',
    throughLocalKey: 'id',
    throughForeignKey: 'id_substation',
  })
  public district_defects_os: HasManyThrough<typeof DefectOs>
}
