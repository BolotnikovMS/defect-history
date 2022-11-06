import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Defect from 'App/Models/Defect'

export default class DefectsController {
  public async index({ request, view }: HttpContextContract) {
    const defects = await Defect.query()

    return view.render('pages/defect/index', {
      title: 'Все дефекты',
      defects,
    })
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
