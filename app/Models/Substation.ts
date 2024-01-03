import { BaseModel, HasMany, column, computed, hasMany } from '@ioc:Adonis/Lucid/Orm'

import AccessionSubstation from 'App/Models/AccessionSubstation'
import Defect from 'App/Models/Defect'
import DefectOs from 'App/Models/DefectOs'
import { replacementEscapeSymbols } from 'App/Utils/utils'
import { DateTime } from 'luxon'

export default class Substation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user_created: number

  @column()
  public id_district: number

  @column({
    consume: (value: string) => replacementEscapeSymbols(value),
  })
  public name: string

  @column({
    consume: (value: string): boolean => Boolean(value),
  })
  public importance: boolean

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
  public get numberOpenDefects() {
    const numberOpenDefectsTm = this.defects?.filter(
      (item) => item.elimination_date === null
    ).length
    const numberOpenDefectsOs = this.defectsOs?.filter(
      (item) => item.elimination_date === null
    ).length

    return numberOpenDefectsTm + numberOpenDefectsOs
  }

  @computed()
  public get numberOfConnections() {
    return this.accession?.length
  }

  @hasMany(() => Defect, {
    localKey: 'id',
    foreignKey: 'id_substation',
  })
  public defects: HasMany<typeof Defect>

  @hasMany(() => DefectOs, {
    localKey: 'id',
    foreignKey: 'id_substation',
  })
  public defectsOs: HasMany<typeof DefectOs>

  @hasMany(() => AccessionSubstation, {
    localKey: 'id',
    foreignKey: 'id_substation',
  })
  public accession: HasMany<typeof AccessionSubstation>
}
