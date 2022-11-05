import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Staff from 'App/Models/Staff'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run () {
    await Staff.createMany([
      {
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        position: 'Инженер'
      },
      {
        name: 'Василий',
        surname: 'Кузьмин',
        patronymic: 'Иванович',
        position: 'Инженер'
      }
    ])
  }
}
