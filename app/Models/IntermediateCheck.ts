import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { replacementEscapeSymbols } from 'App/Utils/utils'
import Department from 'App/Models/Department'
import User from 'App/Models/User'

export default class IntermediateCheck extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_defect: number

  @column()
  public id_user_created: number

  @column({ serializeAs: null })
  public id_inspector: number

  @column.dateTime({
    serialize: (value) => value.toFormat('dd.MM.yyyy HH:mm'),
  })
  public check_date: DateTime

  @column({
    consume: (value: string) => replacementEscapeSymbols(value),
  })
  public description_results: string

  @column()
  public transferred: number | null

  @column.dateTime({
    autoCreate: true,
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
  })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'id_inspector',
    localKey: 'id',
  })
  public name_inspector: BelongsTo<typeof User>

  @belongsTo(() => Department, {
    foreignKey: 'transferred',
    localKey: 'id',
  })
  public responsible_department: BelongsTo<typeof Department>
}
