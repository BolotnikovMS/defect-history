import { DateTime } from 'luxon'
import { BaseModel, column, computed, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Defect from 'App/Models/Defect'
import { replacementEscapeSymbols } from 'App/Utils/utils'
import AccessionSubstation from 'App/Models/AccessionSubstation'

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
    return this.defects?.filter((item) => item.elimination_date === null).length
  }

  @hasMany(() => Defect, {
    localKey: 'id',
    foreignKey: 'id_substation',
  })
  public defects: HasMany<typeof Defect>

  @hasMany(() => AccessionSubstation, {
    localKey: 'id',
    foreignKey: 'id_substation',
  })
  public accession: HasMany<typeof AccessionSubstation>
}
