import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectGroup from 'App/Models/DefectGroup'

export default class DefectGroupsController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    // !Check access
    const page = request.input('page', 1)
    const limit = 15
    const defectGroups = await DefectGroup.query().paginate(page, limit)

    defectGroups.baseUrl('/defect-groups')

    return view.render('pages/defect-group/index', {
      title: 'Группы дефектов',
      defectGroups,
    })
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
