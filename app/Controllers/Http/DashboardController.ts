import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectOs from 'App/Models/DefectOs'
import District from 'App/Models/District'
import DefectTMService from 'App/Services/DefectTMService'

export default class DashboardController {
  public async index({ view }: HttpContextContract) {
    // Defects TM
    const numberDefectsTm = await DefectTMService.getNumberDefects()
    const numberClosedDefectsTm = await DefectTMService.getNumberDefects({ closedDefects: true })
    const numberOpenedDefectsTm = numberDefectsTm - numberClosedDefectsTm
    const typesDefectsTm = await DefectTMService.getDefectsByType()
    const typesClosedDefectsTm = await DefectTMService.getDefectsByType({ closedDefects: true })
    const typesOpenedDefectsOs = await DefectTMService.getDefectsByType({ openedDefects: true })

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
}
