import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Substation from 'App/Models/Substation'
import DefectType from 'App/Models/DefectType'
import IntermediateCheck from 'App/Models/IntermediateCheck'
import Staff from 'App/Models/Staff'
import User from 'App/Models/User'
import { computed } from '@ioc:Adonis/Lucid/Orm'
import { replacementEscapeSymbols } from 'App/Utils/utils'

export default class Defect extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_substation: number

  @column()
  public id_type_defect: number

  @column()
  public id_user: number

  @column()
  public accession: string

  @column({
    consume: (value: string) => replacementEscapeSymbols(value),
  })
  public description_defect: string

  @column({
    consume: (value: string) => value && value.split(','),
  })
  public defect_img: string[] | null

  @column.dateTime({
    serialize: (value) => value.toFormat('dd.MM.yyyy HH:mm'),
  })
  public term_elimination: DateTime

  @column()
  public importance: string

  @column.dateTime({
    serialize: (value) => value?.toFormat('dd.MM.yyyy HH:mm'),
  })
  public elimination_date: DateTime | null

  @column()
  public result: string | null

  @column({ serializeAs: null })
  public id_name_eliminated: number

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
    return string.truncate(this.description_defect, 50)
  }

  @computed()
  public get countIntermediateChecks() {
    return this.intermediate_checks?.length
  }

  @hasOne(() => Substation, {
    foreignKey: 'id',
    localKey: 'id_substation',
  })
  public substation: HasOne<typeof Substation>

  @hasOne(() => DefectType, {
    foreignKey: 'id',
    localKey: 'id_type_defect',
  })
  public defect_type: HasOne<typeof DefectType>

  @hasMany(() => IntermediateCheck, {
    foreignKey: 'id_defect',
    localKey: 'id',
  })
  public intermediate_checks: HasMany<typeof IntermediateCheck>

  @belongsTo(() => Staff, {
    foreignKey: 'id_name_eliminated',
    localKey: 'id',
  })
  public name_eliminated: BelongsTo<typeof Staff>

  @belongsTo(() => User, {
    foreignKey: 'id_user',
    localKey: 'id',
  })
  public user: BelongsTo<typeof User>
}
