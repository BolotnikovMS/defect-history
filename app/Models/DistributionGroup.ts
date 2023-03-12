import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, computed, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class DistributionGroup extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get usersCount() {
    return this.group_users?.length
  }

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'id_distribution_group',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'id_user',
    pivotTable: 'distribution_groups_users',
  })
  public group_users: ManyToMany<typeof User>
}
