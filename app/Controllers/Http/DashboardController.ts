import DefectOSService from 'App/Services/DefectOSService'
import DefectTMService from 'App/Services/DefectTMService'
import DistrictService from 'App/Services/DistrictService'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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
    const numberDefectsOs = await DefectOSService.getNumberDefects()
    const numberClosedDefectsOs = await DefectOSService.getNumberDefects({ closedDefects: true })
    const numberOpenedDefectsOs = numberDefectsOs - numberClosedDefectsOs

    // Districts defects используется для карточки с дефектами с разбивкой по ТМ ОС РС
    const numberDistrictsDefects = await DistrictService.getDistricts({})
    const numberDistrictsOpenedDefects = await DistrictService.getDistricts({ openedDefects: true })
    const numberDistrictsClosedDefects = await DistrictService.getDistricts({ closedDefects: true })
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
