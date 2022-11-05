import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import DefectType from 'App/Models/DefectType'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run () {
    await DefectType.createMany([
      {
        type_defect: 'ТС',
        defect_description: 'Дефект ТС'
      },
      {
        type_defect: 'ТИТ',
        defect_description: 'Дефект ТИТ'
      },
      {
        type_defect: 'ТМ',
        defect_description: 'Дефект ТМ'
      }
    ])
  }
}
