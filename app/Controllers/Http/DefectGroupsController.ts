import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { typesGroups } from 'App/Constants/TypesGroups'
import DefectGroup from 'App/Models/DefectGroup'
import DefectGroupValidator from 'App/Validators/DefectGroupValidator'

export default class DefectGroupsController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectGroupPolicy').denies('view')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 15
    const defectGroups = await DefectGroup.query().paginate(page, limit)

    defectGroups.baseUrl('/defect-groups')

    return view.render('pages/defect-group/index', {
      title: 'Группы дефектов',
      defectGroups,
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectGroupPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на создание записи!')

      return response.redirect().toPath('/')
    }

    return view.render('pages/defect-group/form', {
      title: 'Добавление новой группы',
      options: {
        routePath: {
          saveData: 'defect-groups.store',
        },
      },
      typesGroups,
    })
  }

  public async store({ request, response, session, auth, bouncer }: HttpContextContract) {
    try {
      if (await bouncer.with('DefectGroupPolicy').denies('create')) {
        session.flash('dangerMessage', 'У вас нет прав на создание записи!')

        return response.redirect().toPath('/')
      }

      const validatedData = await request.validate(DefectGroupValidator)
      console.log('validatedData: ', validatedData)

      await DefectGroup.create({ id_user_created: auth.user?.id, ...validatedData })

      session.flash('successMessage', 'Запись успешно добавлена!')

      return response.redirect().toRoute('defect-groups.index')
    } catch (error) {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defect-groups.index')
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectGroupPolicy').denies('update')) {
      session.flash('dangerMessage', 'У вас нет прав на внесение изменений!')

      return response.redirect().toPath('/')
    }

    const defectGroup = await DefectGroup.findOrFail(params.id)

    return view.render('pages/defect-group/form', {
      title: 'Редактирование',
      options: {
        idData: params.id,
        routePath: {
          saveData: 'defect-groups.update',
        },
      },
      defectGroup,
      typesGroups,
    })
  }

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectGroupPolicy').denies('update')) {
      session.flash('dangerMessage', 'У вас нет прав на внесение изменений!')

      return response.redirect().toPath('/')
    }

    const defectGroup = await DefectGroup.findOrFail(params.id)
    const validatedData = await request.validate(DefectGroupValidator)

    await defectGroup.merge(validatedData).save()

    session.flash('successMessage', 'Запись успешно обновлена!')
    return response.redirect().toRoute('defect-groups.index')
  }

  public async destroy({ params, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectGroupPolicy').denies('delete')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().back()
    }

    const defectGroup = await DefectGroup.findOrFail(params.id)

    await defectGroup.delete()

    session.flash('successMessage', 'Запись успешно удалена!')

    return response.redirect().back()
  }
}
