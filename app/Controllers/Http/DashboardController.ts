import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectOSService from 'App/Services/DefectOSService'
import DefectTMService from 'App/Services/DefectTMService'
import DistrictService from 'App/Services/DistrictService'

export default class DashboardController {
  public async index({ view }: HttpContextContract) {
    // Defects TM
    const numberDefectsTm = await DefectTMService.getNumberDefects()
    const numberClosedDefectsTm = await DefectTMService.getNumberDefects({ status: 'close' })
    const numberOpenedDefectsTm = numberDefectsTm - numberClosedDefectsTm
    const typesDefectsTm = await DefectTMService.getDefectsByType()
    const typesClosedDefectsTm = await DefectTMService.getDefectsByType({ status: 'close' })
    const typesOpenedDefectsOs = await DefectTMService.getDefectsByType({ status: 'open' })

    // Defects OS
    const numberDefectsOs = await DefectOSService.getNumberDefects()
    const numberClosedDefectsOs = await DefectOSService.getNumberDefects({ status: 'close' })
    const numberOpenedDefectsOs = numberDefectsOs - numberClosedDefectsOs

    // Districts defects используется для карточки с дефектами с разбивкой по ТМ ОС РС
    const numberDistrictsDefects = await DistrictService.getDistricts({})
    const numberDistrictsOpenedDefects = await DistrictService.getDistricts({ status: 'open' })
    const numberDistrictsClosedDefects = await DistrictService.getDistricts({ status: 'close' })
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
