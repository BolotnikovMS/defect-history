import { DateTime } from 'luxon'
import { BaseModel, column, computed, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Defect from './Defect'
import { replacementEscapeSymbols } from 'App/Utils/utils'

export default class Substation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user: number

  @column()
  public id_district: number

  @column({
    consume: (value: string) => replacementEscapeSymbols(value),
  })
  public name: string

  @column()
  public importance: string

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
}
