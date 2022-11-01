import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import Substation from 'App/Models/Substation'
import DefectType from 'App/Models/DefectType'

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
  public id_intermediate_check: number

  @column()
  public accession: string

  @column()
  public description_defect: string

  @column()
  public term_elimination: string

  @column()
  public elimination_date: string

  @column()
  public id_name_eliminated: number

  @column.dateTime({
    autoCreate: true,
    serialize: (value?: DateTime) => {
      return value ? value.toFormat('HH:mm dd.MM.yyyy') : value
    }
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value?: DateTime) => {
      return value ? value.toFormat('HH:mm dd.MM.yyyy') : value
    }
  })
  public updatedAt: DateTime

  @hasOne(() => Substation, {
    foreignKey: 'id',
    localKey: 'id_substation'
  })
  public substation: HasOne<typeof Substation>

  @hasOne(() => DefectType, {
    foreignKey: 'id',
    localKey: 'id_type_defect'
  })
  public defect_type: HasOne<typeof DefectType>

  // @hasMany(() => IntermediateCheck, {
  //   foreignKey: 'id',
  //   localKey: 'id_intermediate_check'
  // })
  // public intermediate_checks: HasMany<typeof IntermediateCheck>
}
