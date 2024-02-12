import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectClassifier from 'App/Models/DefectClassifier'
import DefectGroup from 'App/Models/DefectGroup'
import DefectClassifierValidator from 'App/Validators/DefectClassifierValidator'

export default class DefectClassifiersController {
  public async index({ params, request, response, view, session, bouncer }: HttpContextContract) {
    const idDefectGroup = params.idDefectGroup
    const page = request.input('page', 1)
    const limit = 15
    const defectGroup = await DefectGroup.findOrFail(idDefectGroup)
    const defectClassifiers = await DefectClassifier.query()
      .where('id_group_defect', '=', idDefectGroup)
      .paginate(page, limit)

    defectClassifiers.baseUrl('/defect-classifiers')

    return view.render('pages/defect-classifier/index', {
      title: `Классификаторы дефектов "${defectGroup.name}"`,
      options: {
        idDefectGroup,
      },
      defectClassifiers,
    })
  }

  public async create({ params, view, session, bouncer }: HttpContextContract) {
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

  public async store({ params, request, response, auth, session, bouncer }: HttpContextContract) {
    try {
      const validatedData = await request.validate(DefectClassifierValidator)
      const idDefectGroup = params.idDefectGroup

      await DefectClassifier.create({
        id_user_created: auth.user?.id,
        id_group_defect: idDefectGroup,
        ...validatedData,
      })

      session.flash('successMessage', 'Запись успешно добавлена!')

      return response
        .redirect()
        .toRoute('defect-groups.index.classifiers', { idDefectGroup: idDefectGroup })
    } catch (error) {
      console.log(error)
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defect-groups.index')
    }
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    const idDefectGroup = params.idDefectGroup
    const defectClassifier = await DefectClassifier.findOrFail(params.id)

    return view.render('pages/defect-classifier/form', {
      title: 'Редактирование',
      options: {
        idData: params.id,
        idDefectGroup: idDefectGroup,
        routePath: {
          saveData: 'defect-groups.update.classifiers',
        },
      },
      defectClassifier,
    })
  }

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    const defectClassifier = await DefectClassifier.findOrFail(params.id)
    const validatedData = await request.validate(DefectClassifierValidator)

    await defectClassifier.merge(validatedData).save()

    session.flash('successMessage', 'Запись успешно обновлена!')
    return response
      .redirect()
      .toRoute('defect-groups.index.classifiers', { idDefectGroup: params.idDefectGroup })
  }

  public async destroy({ params, response, session, bouncer }: HttpContextContract) {
    const defectClassifier = await DefectClassifier.findOrFail(params.id)

    await defectClassifier.delete()

    session.flash('successMessage', 'Запись успешно удалена!')
    return response.redirect().back()
  }
}
