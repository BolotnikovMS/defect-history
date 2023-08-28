import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import User from 'App/Models/User'
import { replacementEscapeSymbols } from 'App/Utils/utils'

export default class WorkPlanning extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_defect: number

  @column()
  public id_user_created: number

  @column({
    consume: (value: string) => replacementEscapeSymbols(value),
  })
  public comment: string

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value.toFormat('dd.MM.yyyy HH:mm'),
  })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'id_user_created',
    localKey: 'id',
  })
  public user_created: BelongsTo<typeof User>
}
