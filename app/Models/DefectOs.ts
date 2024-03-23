import {
  BaseModel,
  BelongsTo,
  HasOne,
  ManyToMany,
  belongsTo,
  column,
  computed,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import { string } from '@ioc:Adonis/Core/Helpers'
import DefectClassifier from 'App/Models/DefectClassifier'
import DefectGroup from 'App/Models/DefectGroup'
import Department from 'App/Models/Department'
import Substation from 'App/Models/Substation'
import User from 'App/Models/User'
import { replacementEscapeSymbols } from 'App/Utils/utils'
import { DateTime } from 'luxon'

export default class DefectOs extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user_created: number

  @column()
  public id_user_updater: number | null

  @column()
  public id_defect_group: number

  @column()
  public id_defect_classifier: number

  @column()
  public id_substation: number

  @column()
  public id_name_eliminated: number | null

  @column()
  public accession_substations: string

  @column({
    consume: (value: string) => replacementEscapeSymbols(value),
  })
  public description_defect: string

  @column({
    consume: (value: string) => replacementEscapeSymbols(value),
  })
  public comment: string | null

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

  @manyToMany(() => Department, {
    localKey: 'id',
    pivotForeignKey: 'id_defect',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'id_department',
    pivotTable: 'defect_os_departments',
  })
  public departments: ManyToMany<typeof Department>

  @belongsTo(() => DefectGroup, {
    foreignKey: 'id_defect_group',
    localKey: 'id',
  })
  public defect_group: BelongsTo<typeof DefectGroup>

  @belongsTo(() => DefectClassifier, {
    foreignKey: 'id_defect_classifier',
    localKey: 'id',
  })
  public defect_classifier: BelongsTo<typeof DefectClassifier>
}
