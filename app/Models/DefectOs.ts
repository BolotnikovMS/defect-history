import {
  BaseModel,
  BelongsTo,
  HasOne,
  belongsTo,
  column,
  computed,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import Substation from 'App/Models/Substation'
import User from 'App/Models/User'
import { replacementEscapeSymbols } from 'App/Utils/utils'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class DefectOs extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_type_defect: number

  @column()
  public id_user_created: number

  @column()
  public id_department: number

  @column()
  public id_substation: number

  @column()
  public accession_substations: string

  @column({
    consume: (value: string) => replacementEscapeSymbols(value),
  })
  public description_defect: string

  @column.dateTime({
    serialize: (value) => value.toFormat('dd.MM.yyyy HH:mm'),
  })
  public term_elimination: DateTime

  @column({
    consume: (value: string): boolean => Boolean(value),
  })
  public importance: boolean

  @column.dateTime({
    serialize: (value) => value?.toFormat('dd.MM.yyyy HH:mm'),
  })
  public elimination_date: DateTime | null

  @column({
    consume: (value: string) => replacementEscapeSymbols(value),
  })
  public result: string | null

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value.toFormat('dd.MM.yyyy HH:mm'),
  })
  public created_at: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
  })
  public updatedAt: DateTime

  @computed()
  public get excerptText() {
    return string.truncate(this.description_defect, 90)
  }

  @hasOne(() => Substation, {
    foreignKey: 'id',
    localKey: 'id_substation',
  })
  public substation: HasOne<typeof Substation>

  @belongsTo(() => User, {
    foreignKey: 'id_name_eliminated',
    localKey: 'id',
  })
  public name_eliminated: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'id_user_created',
    localKey: 'id',
  })
  public user: BelongsTo<typeof User>
}
