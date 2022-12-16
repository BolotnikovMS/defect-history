import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Staff from 'App/Models/Staff'
export default class IntermediateCheck extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public id_defect: number

  @column({ serializeAs: null })
  public id_inspector: number

  @column()
  public check_date: string

  @column()
  public description_results: string

  @column()
  public transferred: string

  @column.dateTime({
    autoCreate: true,
    serialize: (value?: DateTime) => {
      return value ? value.toFormat('HH:mm dd.MM.yyyy') : value
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value?: DateTime) => {
      return value ? value.toFormat('HH:mm dd.MM.yyyy') : value
    },
  })
  public updatedAt: DateTime

  @belongsTo(() => Staff, {
    foreignKey: 'id_inspector',
    localKey: 'id',
  })
  public name_inspector: BelongsTo<typeof Staff>
}
