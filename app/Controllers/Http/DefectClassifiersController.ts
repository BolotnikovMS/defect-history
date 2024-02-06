import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectClassifier from 'App/Models/DefectClassifier'

export default class DefectClassifiersController {
  public async index({ params, request, response, view, session, bouncer }: HttpContextContract) {
    const idDefectGroup = params.idDefectGroup
    const page = request.input('page', 1)
    const limit = 15
    const defectClassifiers = await DefectClassifier.query()
      .where('id_group_defect', '=', idDefectGroup)
      .paginate(page, limit)

    defectClassifiers.baseUrl('/defect-classifiers')

    return view.render('pages/defect-classifier/index', {
      title: 'Классификаторы дефектов',
      options: {
        idDefectGroup,
      },
      defectClassifiers,
    })
  }

  public async create({ params, response, view, session, bouncer }: HttpContextContract) {
    const idDefectGroup = params.idDefectGroup

    return view.render('pages/defect-classifier/form', {
      title: 'Добавление нового классификатора дефекта',
      options: {
        idDefectGroup,
        routePath: {
          saveData: 'defect-groups.store.classifiers',
        },
      },
    })
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
