import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectClassifier from 'App/Models/DefectClassifier'
import DefectGroup from 'App/Models/DefectGroup'
import DefectClassifierValidator from 'App/Validators/DefectClassifierValidator'

export default class DefectClassifiersController {
  public async index({ params, request, response, view, session, bouncer }: HttpContextContract) {
    const idDefectGroup = params.idDefectGroup
    const defectGroup = await DefectGroup.findOrFail(idDefectGroup)

    if (request.ajax()) {
      await defectGroup.load('classifiers')

      return response.status(200).json(defectGroup.classifiers)
    }

    if (await bouncer.with('DefectClassifierPolicy').denies('view')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 15
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

  public async create({ params, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectClassifierPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на создание записи!')

      return response.redirect().toPath('/')
    }

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
    if (await bouncer.with('DefectClassifierPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на создание записи!')

      return response.redirect().toPath('/')
    }

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

  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectClassifierPolicy').denies('update')) {
      session.flash('dangerMessage', 'У вас нет прав на внесение изменений!')

      return response.redirect().toPath('/')
    }

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
    if (await bouncer.with('DefectClassifierPolicy').denies('update')) {
      session.flash('dangerMessage', 'У вас нет прав на внесение изменений!')

      return response.redirect().toPath('/')
    }

    const defectClassifier = await DefectClassifier.findOrFail(params.id)
    const validatedData = await request.validate(DefectClassifierValidator)

    await defectClassifier.merge(validatedData).save()

    session.flash('successMessage', 'Запись успешно обновлена!')
    return response
      .redirect()
      .toRoute('defect-groups.index.classifiers', { idDefectGroup: params.idDefectGroup })
  }

  public async destroy({ params, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectClassifierPolicy').denies('delete')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().back()
    }

    const defectClassifier = await DefectClassifier.findOrFail(params.id)

    await defectClassifier.delete()

    session.flash('successMessage', 'Запись успешно удалена!')
    return response.redirect().back()
  }
}
