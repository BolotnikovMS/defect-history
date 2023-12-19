import Defect from 'App/Models/Defect'
import DefectOs from 'App/Models/DefectOs'
import DefectType from 'App/Models/DefectType'
import District from 'App/Models/District'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DashboardController {
  public async index({ response, request, view }: HttpContextContract) {
    // Defects TM
    const numberDefectsTm = (await Defect.query().count('* as total'))[0].$extras.total
    const numberClosedDefectsTm = (
      await Defect.query().whereNotNull('result').count('* as total')
    )[0].$extras.total
    const numberOpenedDefectsTm = numberDefectsTm - numberClosedDefectsTm
    // const typesDefectsTm = await DefectType.query().withCount('defects', (query) =>
    //   query.as('totalDefects')
    // )
    const typesDefectsTm = await DefectType.query().preload('defects')
    const typesClosedDefectsTm = await DefectType.query().preload('defects', (query) => {
      query.whereNotNull('result')
    })
    const typesOpenedDefectsOs = await DefectType.query().preload('defects', (query) => {
      query.whereNull('result')
    })

    // Defects OS
    const numberDefectsOs = (await DefectOs.query().count('* as total'))[0].$extras.total
    const numberClosedDefectsOs = (
      await DefectOs.query().whereNotNull('result').count('* as total')
    )[0].$extras.total
    const numberOpenedDefectsOs = numberDefectsOs - numberClosedDefectsOs

    // Districts Defects
    const numberDistrictsDefects = await District.query()
      .orderBy('created_at', 'asc')
      .preload('district_defects')
      .preload('district_defects_os')
    const numberDistrictsOpenedDefects = await District.query()
      .orderBy('created_at', 'asc')
      .preload('district_defects', (query) => query.whereNull('result'))
      .preload('district_defects_os', (query) => query.whereNull('result'))
    const numberDistrictsClosedDefects = await District.query()
      .orderBy('created_at', 'asc')
      .preload('district_defects', (query) => query.whereNotNull('result'))
      .preload('district_defects_os', (query) => query.whereNotNull('result'))

    // const test = numberDistrictsDefects.map((type) => type.serialize())
    // console.log('test: ', numberDistrictsDefects)

    return view.render('pages/dashboard/index', {
      title: 'Статистика по дефектам',
      activeMenuLink: 'dashboard.index',
      dataAllDefects: {
        numberDefectsTm,
        numberClosedDefectsTm,
        numberOpenedDefectsTm,
        numberDefectsOs,
        numberClosedDefectsOs,
        numberOpenedDefectsOs,
      },
      dataDefectsTm: {
        typesDefectsTm,
        typesClosedDefectsTm,
        typesOpenedDefectsOs,
      },
      dataDistrictsDefects: {
        numberDistrictsDefects,
        numberDistrictsOpenedDefects,
        numberDistrictsClosedDefects,
      },
    })
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
