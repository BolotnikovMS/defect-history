import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  computed,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Role from 'App/Models/Role'
import Department from 'App/Models/Department'
import DistributionGroup from 'App/Models/DistributionGroup'
import Defect from 'App/Models/Defect'
import Permission from 'App/Models/Permission'

class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user_created: number | null

  @column({
    consume: (value: string): boolean => Boolean(value),
  })
  public blocked: boolean

  @column()
  public username: string

  @column()
  public surname: string

  @column()
  public name: string

  @column()
  public patronymic: string

  @column()
  public position: string

  @column()
  public id_department: number

  @column()
  public id_role: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @computed()
  public get fullName() {
    return `${this.surname} ${this.name} ${this.patronymic}`
  }

  @computed()
  public get shortUserName() {
    return `${this.surname} ${this.name.at(0)}.${this.patronymic.at(0)}.`
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasOne(() => Role, {
    foreignKey: 'id',
    localKey: 'id_role',
  })
  public role: HasOne<typeof Role>

  @hasOne(() => Department, {
    foreignKey: 'id',
    localKey: 'id_department',
  })
  public department: HasOne<typeof Department>

  @manyToMany(() => DistributionGroup)
  public distribution_groups: ManyToMany<typeof DistributionGroup>

  @hasMany(() => Defect, {
    localKey: 'id',
    foreignKey: 'id_user_created',
  })
  public defects: HasMany<typeof Defect>

  @manyToMany(() => Permission, {
    localKey: 'id',
    pivotForeignKey: 'id_user',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'id_permission',
    pivotTable: 'users_permissions',
    pivotColumns: ['id', 'id_user'],
  })
  public permissions: ManyToMany<typeof Permission>
}

User['findForAuth'] = function (uids: string[], uidValue: string) {
  const query = this.query()

  // Для sqlite 'LIKE'
  uids.map((uid) => query.orWhere(uid, 'LIKE', uidValue))

  return query.first()
}

export default User
