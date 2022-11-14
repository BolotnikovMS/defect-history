import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Defect from 'App/Models/Defect'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    await Defect.createMany([
      {
        id_substation: 1,
        id_type_defect: 1,
        id_user: 1,
        accession: 'ф.1',
        description_defect: 'Не корректно отображается информация',
        term_elimination: '10.11.2022',
      },
      {
        id_substation: 1,
        id_type_defect: 2,
        id_user: 1,
        accession: 'ф.20',
        description_defect: 'Дефект датчика температуры окр. среды',
        term_elimination: '11.11.2022',
      },
      {
        id_substation: 2,
        id_type_defect: 2,
        id_user: 1,
        accession: 'ф.1111',
        description_defect: 'Дефект датчика I',
        term_elimination: '11.11.2022',
      },
    ])
  }
}
