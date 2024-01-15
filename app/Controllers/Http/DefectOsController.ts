import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Departments } from 'App/Enums/Departments'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import DefectOs from 'App/Models/DefectOs'
import DefectOsDepartment from 'App/Models/DefectOsDepartment'
import Department from 'App/Models/Department'
import Substation from 'App/Models/Substation'
import { addDays } from 'App/Utils/utils'
import CloseDefectOsValidator from 'App/Validators/CloseDefectOsValidator'
import DefectOsValidator from 'App/Validators/DefectOValidator'
import { DateTime } from 'luxon'

export default class DefectOsController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectOSPolicy').denies('view')) {
      session.flash('dangerMessage', 'У вас нет прав на просмотр дефектов ОС!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 15
    const { status } = request.qs() as IQueryParams
    // const departments = await Department.query().where((queryDepartment) => {
    //   queryDepartment.where('id', '!=', Departments.admins)
    //   queryDepartment.where('id', '!=', Departments.withoutDepartment)
    // })

    const defectsOs = await DefectOs.query()
      .if(status === 'open', (query) => query.whereNull('result'))
      .if(status === 'close', (query) => query.whereNotNull('result'))
      // .if(department && +department !== 0, (query) =>
      //   // query.preload('departments', (queryDep) => queryDep.where('id_department', '=', department))
      //   // query.where('id', '=', query.preload('departments', (queryDep) => queryDep.where('id_department', '=', department))[0])
      // )
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
      .preload('departments')
      .paginate(page, limit)

    defectsOs.baseUrl('/defects-os')
    defectsOs.queryString({ status })
    // const test = defectsOs.map((defectOs) => {
    //   return defectOs.serialize()
    // })
    // console.log(test)

    return view.render('pages/defect-os/index', {
      title: 'Дефекты по ОС',
      defectsOs,
      filters: {
        status,
      },
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectTMPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toRoute('DefectOsController.index')
    }

    const departments = await Department.query().where((queryDepartment) => {
      queryDepartment.where('id', '!=', Departments.admins)
      queryDepartment.where('id', '!=', Departments.withoutDepartment)
    })
    const substations = await Substation.query()

    return view.render('pages/defect-os/form', {
      title: 'Добавление нового дефекта по ОС',
      options: {
        routePath: {
          savePath: 'defects-os.store',
        },
      },
      departments,
      substations,
    })
  }

  public async store({ request, response, auth, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectTMPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toRoute('DefectOsController.index')
    }

    const validatedDefectOsData = await request.validate(DefectOsValidator)

    if (validatedDefectOsData) {
      const defectOs = {
        id_user_created: auth.user!.id,
        id_substation: validatedDefectOsData.substation,
        accession_substations: validatedDefectOsData.accession,
        description_defect: validatedDefectOsData.description_defect,
        comment: validatedDefectOsData.comment,
        term_elimination: addDays(20),
        importance: validatedDefectOsData.importance,
      }

      const newDefectOs = await DefectOs.create(defectOs)
      const defectOsId = newDefectOs.id

      validatedDefectOsData.departments.map(async (departmentId) => {
        await DefectOsDepartment.create({
          id_defect: defectOsId,
          id_department: departmentId,
        })
      })

      session.flash('successMessage', `Дефект по ОС успешно добавлен!`)
      response.redirect().toRoute('defects-os.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defects-os.index')
    }
  }

  public async show({ response, params, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectOSPolicy').denies('view')) {
      session.flash('dangerMessage', 'У вас нет прав на просмотр дефекта ОС!')

      return response.redirect().toRoute('DefectOsController.index')
    }

    const defectOs = await DefectOs.find(params.id)

    if (defectOs) {
      await defectOs.load('substation')
      await defectOs.load('user')
      await defectOs.load('name_eliminated')
      await defectOs.load('departments')

      return view.render('pages/defect-os/show', {
        title: 'Подробный просмотр',
        defectOs: defectOs.serialize(),
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defects.index')
    }
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    const defectOs = await DefectOs.find(params.id)

    if (defectOs) {
      if (await bouncer.with('DefectOSPolicy').denies('update', defectOs)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

        return response.redirect().toRoute('DefectOsController.index')
      }

      await defectOs.load('departments')
      const departments = await Department.query().where((queryDepartment) => {
        queryDepartment.where('id', '!=', Departments.admins)
        queryDepartment.where('id', '!=', Departments.withoutDepartment)
      })
      const substations = await Substation.query()

      return view.render('pages/defect-os/form', {
        title: 'Редактирование',
        options: {
          idData: defectOs.id,
          edit: true,
          routePath: {
            savePath: 'defects-os.update',
          },
        },
        defectOs,
        departments,
        substations,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ params, request, response, auth, session, bouncer }: HttpContextContract) {
    const defectOs = await DefectOs.find(params.id)

    if (defectOs) {
      if (await bouncer.with('DefectOSPolicy').denies('update', defectOs)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

        return response.redirect().toRoute('DefectOsController.index')
      }

      const validatedDefectOsData = await request.validate(DefectOsValidator)
      console.log('validatedDefectOsData: ', validatedDefectOsData)
      const editedDefect = {
        id_user_updater: auth.user!.id,
        id_substation: validatedDefectOsData.substation,
        accession_substations: validatedDefectOsData.accession,
        description_defect: validatedDefectOsData.description_defect,
        comment: validatedDefectOsData.comment,
        importance: validatedDefectOsData.importance,
      }
      const defectOsDepartments = await DefectOsDepartment.query().where(
        'id_defect',
        '=',
        defectOs.id
      )
      defectOsDepartments.forEach(async (elem) => {
        await elem.delete()
      })
      validatedDefectOsData.departments.map(async (departmentId) => {
        await DefectOsDepartment.create({
          id_defect: defectOs.id,
          id_department: departmentId,
        })
      })
      await defectOs.merge(editedDefect).save()

      session.flash('successMessage', `Данные дефекта успешно обновлены.`)
      response.redirect().toRoute('DefectOsController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    const defectOs = await DefectOs.find(params.id)

    if (defectOs) {
      if (await bouncer.with('DefectOSPolicy').denies('delete', defectOs)) {
        session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

        return response.redirect().toRoute('DefectOsController.index')
      }

      await defectOs.related('departments').query().delete()
      await defectOs.delete()

      session.flash('successMessage', `Дефект успешно удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async closeDefectOsCreate({
    response,
    params,
    view,
    session,
    bouncer,
  }: HttpContextContract) {
    const id = params.id
    const defectOs = await DefectOs.find(id)

    if (defectOs) {
      if (await bouncer.with('DefectOSPolicy').denies('close', defectOs)) {
        session.flash('dangerMessage', 'У вас нет прав на закрытие дефекта или дефект уже закрыт')

        return response.redirect().toRoute('DefectOsController.index')
      }

      return view.render('pages/defect-os/form_checkupandclose', {
        title: 'Закрытие дефекта',
        options: {
          defectOs: id,
          routes: {
            saveData: 'defects-os.close.store',
            back: 'defects-os.show',
          },
        },
      })
    } else {
      session.flash('dangerMessage', 'Вы не можете закрыть несуществующий дефект!')

      return response.redirect().toPath('/')
    }
  }

  public async closeDefectOsStore({
    response,
    request,
    params,
    auth,
    session,
    bouncer,
  }: HttpContextContract) {
    const id = params.id
    const defectOs = await DefectOs.find(id)

    if (defectOs) {
      if (await bouncer.with('DefectOSPolicy').denies('close', defectOs)) {
        session.flash('dangerMessage', 'У вас нет прав на закрытие дефекта или дефект уже закрыт!')

        return response.redirect().toRoute('DefectOsController.index')
      }

      const validateData = await request.validate(CloseDefectOsValidator)

      defectOs.result = validateData.result
      defectOs.id_name_eliminated = auth?.user!.id
      defectOs.elimination_date = DateTime.now()

      await defectOs.save()

      session.flash('successMessage', `Дефект закрыт.`)
      response.redirect().toRoute('defects-os.show', { id })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defects-os.index')
    }
  }
}
