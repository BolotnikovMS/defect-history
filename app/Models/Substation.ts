import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Defect from './Defect'

export default class Substation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user: number

  @column({
    consume: (data) => data.replace(new RegExp('&#x2F;', 'g'), '/'),
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

  @hasMany(() => Defect, {
    localKey: 'id',
    foreignKey: 'id_substation',
  })
  public defects: HasMany<typeof Defect>
}
