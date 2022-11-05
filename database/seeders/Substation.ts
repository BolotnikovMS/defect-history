import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Substation from 'App/Models/Substation'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run () {
    await Substation.createMany([
      {
        name: 'Тест 1',
        voltage_class: '10/35'
      },
      {
        name: 'Тест 2',
        voltage_class: '10/35'
      }
    ])
  }
}
