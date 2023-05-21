import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Substation from 'App/Models/Substation'

export default class AccessionSubstation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_substation: number

  @column()
  public name: string

  @column({
    consume: (value: string): boolean => Boolean(value),
  })
  public importance: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Substation, {
    foreignKey: 'id_substation',
    localKey: 'id',
  })
  public accession_substations: BelongsTo<typeof Substation>
}
