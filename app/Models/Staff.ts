import { DateTime } from 'luxon'
import {BaseModel, column, computed} from '@ioc:Adonis/Lucid/Orm'

export default class Staff extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public surname: string

  @column()
  public patronymic: string

  @column()
  public position: string

  @computed()
  public get fullName() {
    return `${this.surname} ${this.name} ${this.patronymic}`
  }

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
}
