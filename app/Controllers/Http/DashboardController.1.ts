import Defect from 'App/Models/Defect'
import DefectOs from 'App/Models/DefectOs'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DashboardController {
  public async index({ response, request, view }: HttpContextContract) {
    const countDefectsTm = (await Defect.query().count('* as totalDefectsTm'))[0].$extras.totalDefectsTm
    const countCloseDefectsTm = (
      await Defect.query().whereNotNull('result').count('* as totalCloseDefectsTm')
    )[0].$extras.totalCloseDefectsTm
    const countDefectsOs = (await DefectOs.query().count('* as total'))[0].$extras.total
    console.log('countCloseDefectsTm: ', countCloseDefectsTm)
    console.log('countDefectsTm: ', countDefectsTm)

    return view.render('pages/dashboard/index', {
      title: 'Статистика',
      activeMenuLink: 'dashboard.index',
    })
  }

  public async create({ }: HttpContextContract) { }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
