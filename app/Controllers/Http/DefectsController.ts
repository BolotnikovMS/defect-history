import { addDays, randomStr } from 'App/Utils/utils'

import Env from '@ioc:Adonis/Core/Env'
import Event from '@ioc:Adonis/Core/Event'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Departments } from 'App/Enums/Departments'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import Defect from 'App/Models/Defect'
import DefectImg from 'App/Models/DefectImg'
import DefectType from 'App/Models/DefectType'
import Department from 'App/Models/Department'
import IntermediateCheck from 'App/Models/IntermediateCheck'
import Substation from 'App/Models/Substation'
import User from 'App/Models/User'
import CloseDefectValidator from 'App/Validators/CloseDefectValidator'
import DefectDeadlineValidator from 'App/Validators/DefectDeadlineValidator'
import DefectValidator from 'App/Validators/DefectValidator'
import IntermediateCheckValidator from 'App/Validators/IntermediateCheckValidator'
import { DateTime } from 'luxon'
import { unlink } from 'node:fs/promises'

export default class DefectsController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectTMPolicy').denies('view')) {
      session.flash('dangerMessage', 'У вас нет прав на просмотр дефектов ТМ!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 15
    const { status, typeDefect, sort = 'default' } = request.qs() as IQueryParams
    const typesDefects = await DefectType.query()
    const typesDefectsToSort = typesDefects.map((type) => ({
      name: type.type_defect,
      path: 'types-defects.show',
      params: { id: type.id },
    }))
    const defects = await Defect.query()
      .if(status === 'open', (query) => query.whereNull('result'))
      .if(status === 'close', (query) => query.whereNotNull('result'))
      .if(typeDefect !== undefined && typeDefect !== 'all', (query) =>
        query.where('id_type_defect', '=', typeDefect!)
      )
      .if(sort === 'elimination_date_desc', (query) => query.orderBy('elimination_date', 'desc'))
      .if(sort === 'elimination_date_asc', (query) => query.orderBy('elimination_date', 'asc'))
      .if(sort === 'term_elimination_desc', (query) => query.orderBy('term_elimination', 'desc'))
      .if(sort === 'term_elimination_asc', (query) => query.orderBy('term_elimination', 'asc'))
      .if(sort === 'default', (query) =>
        query.orderBy([
          {
            column: 'elimination_date',
            order: 'asc',
          },
          {
            column: 'created_at',
            order: 'desc',
          },
        ])
      )
      .preload('defect_type')
      .preload('substation')
      .preload('accession')
      .preload('work_planning')
      .preload('intermediate_checks')
      .preload('user')
      .paginate(page, limit)

    defects.baseUrl('/defects')
    defects.queryString({ status })

    // const test = defects.map((defect) => defect.serialize())
    // console.log('test: ', test)

    return view.render('pages/defect/index', {
      title: 'Дефекты по ТМ',
      typesDefects,
      typesDefectsToSort,
      defects,
      filters: {
        status,
        typeDefect,
        sort,
      },
      activeMenuLink: 'defects.index',
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectTMPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const typeDefects = await DefectType.all()
    const substations = await Substation.all()

    return view.render('pages/defect/form', {
      title: 'Добавление нового дефекта',
      options: {
        routePath: {
          savePath: 'defects.store',
        },
      },
      typeDefects,
      substations,
    })
  }

  public async store({ request, response, auth, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectTMPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const validateDefectData = await request.validate(DefectValidator)

    if (validateDefectData) {
      const defect = {
        id_substation: validateDefectData.substation,
        id_type_defect: validateDefectData.defect_type,
        id_user_created: auth.user!.id,
        id_accession: validateDefectData.accession,
        description_defect: validateDefectData.description_defect,
        term_elimination: addDays(20),
        importance: validateDefectData.importance,
      }

      const newDefect = await Defect.create(defect)

      validateDefectData?.defect_img?.forEach(async (img) => {
        const imgName = `${new Date().getTime()}${randomStr()}.${img.extname}`

        await DefectImg.create({
          id_defect: newDefect.id,
          path_img: `/uploads/images/defects/${imgName}`,
        })
        await img.moveToDisk('images/defects/', { name: imgName })
      })

      await newDefect.load('defect_type', (queryGroup) => {
        queryGroup.whereNotNull('id_distribution_group').preload('group', (queryGroupUsers) => {
          queryGroupUsers.preload('group_users')
        })
      })

      const arrayUsers = newDefect.defect_type?.group.group_users

      if (
        arrayUsers?.length &&
        Env.get('SMTP_HOST') !== 'localhost' &&
        Env.get('SMTP_HOST') !== ''
      ) {
        Event.emit('send:mail-new-entry', {
          users: arrayUsers,
          templateMail: 'emails/template_mail_defects',
          subjectMail: 'Новая запись в журнале дефектов!',
          textMail: 'В журнал дефектов была добавлена новая запись.',
          defectId: newDefect.id,
          note: newDefect,
        })
      } else {
        console.log('В списке рассылки нету пользователей или не указан SMPT host!')
      }

      session.flash('successMessage', `Дефект успешно добавлен!`)
      response.redirect().toRoute('defects.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defects.index')
    }
  }

  public async show({ response, params, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectTMPolicy').denies('view')) {
      session.flash('dangerMessage', 'У вас нет прав на просмотр дефектов ТМ!')

      return response.redirect().toPath('/')
    }

    const defect = await Defect.find(params.id)

    if (defect) {
      await defect.load('substation')
      await defect.load('accession')
      await defect.load('defect_type')
      await defect.load('user')
      await defect.load('intermediate_checks', (query) => {
        query.preload('name_inspector')
        query.preload('responsible_department')
      })
      await defect.load('name_eliminated')
      await defect.load('defect_imgs')
      await defect.load('work_planning', (query) => {
        query.preload('user_created')
      })

      return view.render('pages/defect/show', {
        title: 'Подробный просмотр',
        defect: defect.serialize(),
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defects.index')
    }
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      if (await bouncer.with('DefectTMPolicy').denies('update', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

        return response.redirect().toPath('/')
      }

      await defect.load('defect_imgs')

      const defectSerialize = defect.serialize()
      const typeDefects = await DefectType.all()
      const substations = await Substation.all()
      const accessionSubstations = await Substation.find(defectSerialize.id_substation)

      await accessionSubstations?.load('accession')

      return view.render('pages/defect/form', {
        title: 'Редактирование',
        options: {
          idData: defect.id,
          edit: true,
          routePath: {
            savePath: 'defects.update',
          },
        },
        defectSerialize,
        typeDefects,
        substations,
        accessionSubstations: accessionSubstations?.accession,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ params, request, response, auth, session, bouncer }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      if (await bouncer.with('DefectTMPolicy').denies('update', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

        return response.redirect().toPath('/')
      }

      const validateDefectData = await request.validate(DefectValidator)
      const editedDefect = {
        id_user_updater: auth.user!.id,
        id_type_defect: +validateDefectData.defect_type,
        id_substation: +validateDefectData.substation,
        id_accession: validateDefectData.accession,
        description_defect: validateDefectData.description_defect,
        importance: validateDefectData.importance ? true : false,
      }

      const updDefect = await defect.merge(editedDefect).save()

      validateDefectData.defect_img?.forEach(async (img) => {
        const imgName = `${new Date().getTime()}${randomStr()}.${img.extname}`

        await DefectImg.create({
          id_defect: updDefect.id,
          path_img: `/uploads/images/defects/${imgName}`,
        })
        await img.moveToDisk('images/defects/', { name: imgName })
      })

      session.flash('successMessage', `Данные дефекта успешно обновлены.`)
      response.redirect().toRoute('DefectsController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      if (await bouncer.with('DefectTMPolicy').denies('delete', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

        return response.redirect().toPath('/')
      }

      await defect.load('defect_imgs')
      await defect.related('intermediate_checks').query().delete()
      await defect.related('work_planning').query().delete()
      defect.defect_imgs?.forEach(async (img) => {
        try {
          await unlink(`./tmp${img.path_img}`)
        } catch (error) {
          console.log(`there was an error: ${error.message}`)
        }
      })
      await defect.related('defect_imgs').query().delete()
      await defect.delete()

      session.flash('successMessage', `Дефект успешно удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async deleteImg({ response, params, session, bouncer }: HttpContextContract) {
    const defectImg = await DefectImg.find(params.idImg)
    const defect = await Defect.find(params.id)

    if (defect && defectImg) {
      if (await bouncer.with('DefectTMPolicy').denies('update', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на удаление!')

        return response.redirect().toPath('/')
      }

      try {
        await unlink(`./tmp${defectImg.path_img}`)
      } catch (error) {
        console.log(`there was an error: ${error.message}`)
        session.flash('dangerMessage', `${error.message}`)
      }
      await defectImg.delete()

      session.flash('successMessage', `Изображение успешно удаленно!`)
      response.redirect().back()
    }
  }

  public async editDeadline({ response, params, view, session, bouncer }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      if (await bouncer.with('DefectTMPolicy').denies('updateDeadline', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование срока устранения дефекта!')

        return response.redirect().toPath('/')
      }

      return view.render('pages/defect/form_edit_deadline', {
        title: 'Изменение даты устранения дефекта',
        defect: defect.serialize(),
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async updateDeadline({
    params,
    request,
    response,
    session,
    bouncer,
  }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      if (await bouncer.with('DefectTMPolicy').denies('updateDeadline', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование срока устранения дефекта!')

        return response.redirect().toPath('/')
      }

      const validateDefectData = await request.validate(DefectDeadlineValidator)

      await defect.merge(validateDefectData).save()

      session.flash('successMessage', `Сроки устранения дефекта успешно обновлены!!`)
      response.redirect().toRoute('DefectsController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async checkupCreate({ response, params, view, session, bouncer }: HttpContextContract) {
    const idDefect = await params.id
    const defect = await Defect.find(idDefect)

    if (defect) {
      if (await bouncer.with('DefectTMPolicy').denies('createCheckup', defect)) {
        session.flash(
          'dangerMessage',
          'У вас нет прав на добавление проверки или дефект уже закрыт!'
        )

        return response.redirect().toPath('/')
      }

      const users = await User.query().where((queryUser) => {
        queryUser.where('blocked', '!=', true)
        queryUser.where('id', '!=', 1)
        queryUser.where('id_department', '!=', Departments.withoutDepartment)
      })
      const departments = await Department.query().where((queryDepartment) => {
        queryDepartment.where('id', '!=', Departments.admins)
        queryDepartment.where('id', '!=', Departments.withoutDepartment)
      })

      return view.render('pages/defect/form_checkupandclose', {
        title: 'Добавление проверки',
        checkup: true,
        options: {
          idData: idDefect,
          routes: {
            saveData: 'defects.checkup.store',
            back: 'defects.show',
            backParams: idDefect,
          },
        },
        users,
        departments,
      })
    } else {
      session.flash('dangerMessage', 'Вы не можете добавить проверку к не существующему дефекту!')

      return response.redirect().toPath('/')
    }
  }

  public async checkupStore({
    params,
    request,
    response,
    auth,
    session,
    bouncer,
  }: HttpContextContract) {
    const idDefect = await params.id
    const defect = await Defect.find(idDefect)

    if (defect) {
      if (await bouncer.with('DefectTMPolicy').denies('createCheckup', defect)) {
        session.flash(
          'dangerMessage',
          'У вас нет прав на добавление проверки или дефект уже закрыт!'
        )

        return response.redirect().toPath('/')
      }

      const validateData = await request.validate(IntermediateCheckValidator)

      if (validateData) {
        const checkupDefect = {
          id_defect: +idDefect,
          id_user_created: auth.user!.id,
          id_inspector: +validateData.employee,
          check_date: DateTime.now(),
          description_results: validateData.description_results,
          transferred: validateData.transferred ? validateData.transferred : null,
        }
        // const test = ({ employee, ...rest }) => rest

        const newCheck = await IntermediateCheck.create(checkupDefect)

        await newCheck.load('responsible_department', (query) => {
          query.preload('department_users')
        })

        const arrayUsers = newCheck?.responsible_department?.department_users

        // console.log(newCheck?.responsible_department.serialize())

        if (
          arrayUsers?.length &&
          Env.get('SMTP_HOST') !== 'localhost' &&
          Env.get('SMTP_HOST') !== ''
        ) {
          Event.emit('send:mail-new-entry', {
            users: arrayUsers,
            templateMail: 'emails/template_mail_defects',
            subjectMail: 'Добавлена промежуточная проверка по дефекту!',
            textMail:
              'В журнал дефектов были добавлены результаты проверки. Дефект относится к вашему отделу.',
            defectId: newCheck.id_defect,
            note: newCheck,
          })
        } else {
          console.log('В списке рассылки нету пользователей или не указан SMPT host!')
        }

        session.flash('successMessage', `Проверка успешно добавлена!`)
        response.redirect().toRoute('DefectsController.show', { id: idDefect })
      } else {
        session.flash('dangerMessage', 'Что-то пошло не так!')
        response.redirect().toRoute('DefectsController.index')
      }
    } else {
      session.flash('dangerMessage', 'Вы не можете добавить проверку к не существующему дефекту!')

      return response.redirect().toPath('/')
    }
  }

  public async checkupEdit({ response, params, view, session, bouncer }: HttpContextContract) {
    const check = await IntermediateCheck.find(params.id)

    if (check) {
      const defect = await Defect.find(check.id_defect)
      if (await bouncer.with('DefectTMPolicy').denies('updateCheckup', defect!, check)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

        return response.redirect().toRoute('DefectsController.show', { id: check.id_defect })
      }

      const users = await User.query().where((queryUser) => {
        queryUser.where('blocked', '!=', true)
        queryUser.where('id', '!=', 1)
        queryUser.where('id_department', '!=', Departments.withoutDepartment)
      })
      const departments = await Department.query().where((queryDepartment) => {
        queryDepartment.where('id', '!=', Departments.admins)
        queryDepartment.where('id', '!=', Departments.withoutDepartment)
      })

      return view.render('pages/defect/form_checkupandclose', {
        title: 'Редактирование промежуточных результатов',
        checkup: true,
        options: {
          idData: check.id,
          routes: {
            saveData: 'defects.checkup.update',
            back: 'defects.show',
            backParams: check.id_defect,
          },
        },
        users,
        departments,
        check,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async checkupUpdate({ request, response, params, session, bouncer }: HttpContextContract) {
    const check = await IntermediateCheck.find(params.id)

    if (check) {
      const defect = await Defect.find(check.id_defect)
      if (await bouncer.with('DefectTMPolicy').denies('updateCheckup', defect!, check)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

        return response.redirect().toRoute('DefectsController.show', { id: check.id_defect })
      }

      const validatedData = await request.validate(IntermediateCheckValidator)
      const updCheckupDefect = {
        id_defect: +check.id_defect,
        id_inspector: +validatedData.employee,
        check_date: DateTime.now(),
        description_results: validatedData.description_results,
        transferred: validatedData.transferred ? validatedData.transferred : null,
      }

      await check.merge(updCheckupDefect).save()

      session.flash('successMessage', `Данные успешно обновлены.`)
      response.redirect().toRoute('DefectsController.show', { id: check.id_defect })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async checkupDestroy({ response, params, session, bouncer }: HttpContextContract) {
    const intermediateCheck = await IntermediateCheck.find(params.id)
    const defect = await Defect.find(intermediateCheck?.id_defect)

    if (intermediateCheck && defect) {
      if (await bouncer.with('DefectTMPolicy').denies('deleteCheckup', intermediateCheck, defect)) {
        session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

        return response.redirect().toPath('/')
      }
      await intermediateCheck.delete()

      session.flash('successMessage', `Промежуточная проверка удалена!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async closeDefectCreate({
    response,
    params,
    view,
    session,
    bouncer,
  }: HttpContextContract) {
    const idDefect = await params.id
    const defect = await Defect.find(idDefect)

    if (defect) {
      if (await bouncer.with('DefectTMPolicy').denies('close', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на закрытие дефекта или дефект уже закрыт')

        return response.redirect().toPath('/')
      }

      const users = await User.query().where((queryUser) => {
        queryUser.where('blocked', '!=', true)
        queryUser.where('id', '!=', 1)
        queryUser.where('id_department', '!=', Departments.withoutDepartment)
      })

      return view.render('pages/defect/form_checkupandclose', {
        title: 'Закрытие дефекта',
        options: {
          idData: idDefect,
          routes: {
            saveData: 'defects.close.store',
            back: 'defects.show',
            backParams: idDefect,
          },
        },
        users,
      })
    } else {
      session.flash('dangerMessage', 'Вы не можете закрыть несуществующий дефект!')

      return response.redirect().toPath('/')
    }
  }

  public async closeDefectStore({
    params,
    request,
    response,
    session,
    bouncer,
  }: HttpContextContract) {
    const idDefect = await params.id
    const defect = await Defect.find(idDefect)

    if (defect) {
      if (await bouncer.with('DefectTMPolicy').denies('close', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на закрытие дефекта или дефект уже закрыт!')

        return response.redirect().toPath('/')
      }
      const validateData = await request.validate(CloseDefectValidator)

      defect.id_name_eliminated = +validateData.employee
      defect.result = validateData.description_results
      defect.elimination_date = DateTime.now()

      await defect.save()

      session.flash('successMessage', `Дефект закрыт.`)
      response.redirect().toRoute('defects.show', { id: idDefect })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defects.index')
    }
  }
}
