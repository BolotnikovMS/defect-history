import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import IntermediateCheck from 'App/Models/IntermediateCheck'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run () {
    await IntermediateCheck.createMany([
      {
        id_defect: 2,
        id_inspector: 1,
        check_date: '5.11.2022',
        test_result: 'Выполнена проверка датчика. Датчик снят на проверку.'
      },
      {
        id_defect: 2,
        id_inspector: 1,
        check_date: '7.11.2022',
        test_result: 'Выполнена дополнительная проверка.'
      }
    ])
  }
}
