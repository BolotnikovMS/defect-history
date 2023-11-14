import DefectOs from 'App/Models/DefectOs'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DefectOsController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 15

    const defectsOs = await DefectOs.query()
      .orderBy([
        {
          column: 'elimination_date',
          order: 'asc',
        },
        {
          column: 'created_at',
          order: 'desc',
        },
      ])
      .preload('substation')
      .preload('user')
      .paginate(page, limit)

    defectsOs.baseUrl('/defects-os')

    return view.render('pages/defect-os/index', {
      title: 'Дефекты ОС',
      defectsOs,
      activeMenuLink: 'defects-os.index',
    })
  }
}
