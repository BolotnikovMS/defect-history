import { addDays, randomStr } from 'App/Utils/utils'

import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { IDefectParams } from 'App/Interfaces/DefectParams'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import Defect from 'App/Models/Defect'
import DefectImg from 'App/Models/DefectImg'
import DefectType from 'App/Models/DefectType'
import DefectValidator from 'App/Validators/DefectValidator'

export default class DefectTMService {
  public static async getDefects(req: RequestContract, limit: number = 15) {
    const page = req.input('page', 1)
    const limitData = limit
    const { status, typeDefect, sort = 'default' } = req.qs() as IQueryParams
    const defects = await Defect.query()
      .if(status === 'open', (query) => query.whereNull('result'))
      .if(status === 'close', (query) => query.whereNotNull('result'))
      .if(typeDefect !== undefined && typeDefect !== 'all', (query) =>
        query.where('id_type_defect', '=', typeDefect!)
      )
      .if(sort === 'elimination_date_desc', (query) => query.orderBy('elimination_date', 'desc'))
      .if(sort === 'elimination_date_asc', (query) => query.orderBy('elimination_date', 'asc'))
      .if(sort === 'term_elimination_desc', (query) => query.orderBy('term_elimination', 'desc'))
      .if(sort === 'term_elimination_asc', (query) => query.orderBy('term_elimination', 'asc'))
      .if(sort === 'default', (query) =>
        query.orderBy([
          {
            column: 'elimination_date',
            order: 'asc',
          },
          {
            column: 'created_at',
            order: 'desc',
          },
        ])
      )
      .preload('defect_type')
      .preload('substation')
      .preload('accession')
      .preload('work_planning')
      .preload('intermediate_checks')
      .preload('user')
      .paginate(page, limitData)

    defects.baseUrl('/defects')
    defects.queryString({ status, typeDefect, sort })

    return { defects, filters: { status, typeDefect, sort } }
  }
  public static async store(
    req: RequestContract,
    auth: AuthContract,
    { ...data }: DefectValidator['schema']['props']
  ): Promise<Defect> {
    const newDefect = {
      id_substation: data.substation,
      id_type_defect: data.defect_type,
      id_user_created: auth.user!.id,
      id_accession: data.accession,
      description_defect: data.description_defect,
      term_elimination: addDays(20),
      importance: data.importance,
    }

    const defect = await Defect.create(newDefect)

    data?.defect_img?.forEach(async (img) => {
      const imgName = `${new Date().getTime()}${randomStr()}.${img.extname}`

      await DefectImg.create({
        id_defect: defect.id,
        path_img: `/uploads/images/defects/${imgName}`,
      })
      await img.moveToDisk('images/defects/', { name: imgName })
    })

    return defect
  }
  public static async getDefect(params: Record<string, any>): Promise<Defect> {
    const defect = await Defect.findOrFail(params.id)

    await defect.load('substation')
    await defect.load('accession')
    await defect.load('defect_type')
    await defect.load('user')
    await defect.load('intermediate_checks', (query) => {
      query.preload('name_inspector')
      query.preload('responsible_department')
    })
    await defect.load('name_eliminated')
    await defect.load('defect_imgs')
    await defect.load('work_planning', (query) => {
      query.preload('user_created')
    })

    return defect
  }
  public static async getNumberDefects(params?: IDefectParams): Promise<number> {
    const numberDefects = (
      await Defect.query()
        .if(params?.closedDefects, (query) => query.whereNotNull('result'))
        .if(params?.openedDefects, (query) => query.whereNull('result'))
        .count('* as total')
    )[0].$extras.total

    return numberDefects
  }
  public static async getDefectsByType(params?: IDefectParams) {
    const typesDefects = await DefectType.query().preload('defects', (query) => {
      query
        .if(params?.closedDefects, (query) => query.whereNotNull('result'))
        .if(params?.openedDefects, (query) => query.whereNull('result'))
    })

    return typesDefects
  }
}
