import Defect from 'App/Models/Defect'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WorkPlanning from 'App/Models/WorkPlanning'
import WorkPlanningValidator from 'App/Validators/WorkPlanningValidator'

export default class WorkPlanningsController {
  public async index({}: HttpContextContract) {}

  public async create({ params, response, view, session, bouncer }: HttpContextContract) {
    const idDefect: number = parseInt(await params.idDefect)
    const defect = await Defect.find(idDefect)

    if (defect) {
      if (await bouncer.denies('addingWorkPlanningEntry', defect)) {
        session.flash(
          'dangerMessage',
          'У вас нет прав на добавление новой записи или дефект уже закрыт!'
        )

        return response.redirect().toPath('/')
      }

      return view.render('pages/work-planning/form', {
        title: 'Планирование работ',
        options: {
          idDefect,
          routePath: {
            savePath: 'work-planning.store',
          },
        },
      })
    }
  }

  public async store({ request, response, params, auth, session, bouncer }: HttpContextContract) {
    const idDefect: number = parseInt(await params.idDefect)
    const defect = await Defect.find(idDefect)

    if (defect) {
      if (await bouncer.denies('addingWorkPlanningEntry', defect)) {
        session.flash(
          'dangerMessage',
          'У вас нет прав на добавление новой записи или дефект уже закрыт!'
        )

        return response.redirect().toPath('/')
      }

      const validateData = await request.validate(WorkPlanningValidator)

      await WorkPlanning.create({
        ...validateData,
        id_user_created: auth.user?.id,
        id_defect: idDefect,
      })

      session.flash('successMessage', `Запись успешно добавлена!`)
      response.redirect().toRoute('defects.show', { id: idDefect })
    } else {
      session.flash(
        'dangerMessage',
        'Вы не можете запланировать работы по не существующему дефекту!'
      )

      return response.redirect().toPath('/')
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    const plannedWork = await WorkPlanning.find(params.id)
    const idDefect: number = parseInt(await params.idDefect)
    const defect = await Defect.find(idDefect)

    if (plannedWork && idDefect && defect) {
      if (await bouncer.denies('editingPlannedWorkEntry', plannedWork, defect)) {
        session.flash('dangerMessage', 'У вас нет прав на внесение изменений или дефект закрыт!')

        return response.redirect().toPath('/')
      }

      return view.render('pages/work-planning/form', {
        title: 'Редактирование',
        options: {
          idDefect,
          idData: plannedWork.id,
          routePath: {
            savePath: 'work-planning.update',
          },
        },
        plannedWork,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ request, response, params, session, bouncer }: HttpContextContract) {
    const plannedWork = await WorkPlanning.find(params.id)
    const idDefect = parseInt(await params.idDefect)
    const defect = await Defect.find(idDefect)

    if (plannedWork && idDefect && defect) {
      if (await bouncer.denies('editingPlannedWorkEntry', plannedWork, defect)) {
        session.flash('dangerMessage', 'У вас нет прав на внесение изменений или дефект закрыт!')

        return response.redirect().toPath('/')
      }

      const validateData = await request.validate(WorkPlanningValidator)

      await plannedWork.merge({ ...validateData }).save()

      session.flash('successMessage', `Запись успешно обновлена.`)
      response.redirect().toRoute('defects.show', { id: idDefect })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    const plannedWork = await WorkPlanning.find(params.id)
    const defect = await Defect.find(plannedWork?.id_defect)

    if (plannedWork && defect) {
      if (await bouncer.denies('deletingPlannedWorkEntry', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на удаление записи или дефект закрыт!')

        return response.redirect().toPath('/')
      }

      await plannedWork.delete()

      session.flash('successMessage', `Запись успешно удалена!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }
}
