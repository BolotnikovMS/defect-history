import Env from '@ioc:Adonis/Core/Env'
import Event from '@ioc:Adonis/Core/Event'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Defect from 'App/Models/Defect'
import DefectImg from 'App/Models/DefectImg'
import DefectType from 'App/Models/DefectType'
import IntermediateCheck from 'App/Models/IntermediateCheck'
import Substation from 'App/Models/Substation'
import DefectTMService from 'App/Services/DefectTMService'
import DepartmentService from 'App/Services/DepartmentService'
import UserService from 'App/Services/UserService'
import { randomStr } from 'App/Utils/utils'
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

    const typesDefects = await DefectType.query()
    const data = await DefectTMService.getDefects(request)

    // const test = defects.map((defect) => defect.serialize())
    // console.log('test: ', test)

    return view.render('pages/defect/index', {
      title: 'Дефекты по ТМ',
      typesDefects,
      defects: data.defects,
      filters: data.filters,
      activeMenuLink: 'defects.index',
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DefectTMPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const typeDefects = await DefectType.all()
    const substations = await Substation.query().orderBy('name', 'asc')

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
      const newDefect = await DefectTMService.store(request, auth, validateDefectData)

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

    const defect = await DefectTMService.getDefect(params)

    return view.render('pages/defect/show', {
      title: 'Подробный просмотр',
      defect: defect.serialize(),
    })
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
    const defect = await Defect.findOrFail(params.id)

    if (await bouncer.with('DefectTMPolicy').denies('updateDeadline', defect)) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование срока устранения дефекта!')

      return response.redirect().toPath('/')
    }

    return view.render('pages/defect/form_edit_deadline', {
      title: 'Изменение даты устранения дефекта',
      defect: defect.serialize(),
    })
  }

  public async updateDeadline({
    params,
    request,
    response,
    session,
    bouncer,
  }: HttpContextContract) {
    const defect = await Defect.findOrFail(params.id)

    if (await bouncer.with('DefectTMPolicy').denies('updateDeadline', defect)) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование срока устранения дефекта!')

      return response.redirect().toPath('/')
    }

    const validateDefectData = await request.validate(DefectDeadlineValidator)

    await defect.merge(validateDefectData).save()

    session.flash('successMessage', `Сроки устранения дефекта успешно обновлены!!`)
    response.redirect().toRoute('DefectsController.index')
  }

  public async checkupCreate({ response, params, view, session, bouncer }: HttpContextContract) {
    const idDefect = await params.id
    const defect = await Defect.findOrFail(idDefect)

    if (await bouncer.with('DefectTMPolicy').denies('createCheckup', defect)) {
      session.flash('dangerMessage', 'У вас нет прав на добавление проверки или дефект уже закрыт!')

      return response.redirect().toPath('/')
    }

    const users = await UserService.getCleanUsers()
    const departments = await DepartmentService.getCleanDepartments()

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
    const defect = await Defect.findOrFail(idDefect)

    if (await bouncer.with('DefectTMPolicy').denies('createCheckup', defect)) {
      session.flash('dangerMessage', 'У вас нет прав на добавление проверки или дефект уже закрыт!')

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
  }

  public async checkupEdit({ response, params, view, session, bouncer }: HttpContextContract) {
    const check = await IntermediateCheck.findOrFail(params.id)
    const defect = await Defect.find(check.id_defect)
    if (await bouncer.with('DefectTMPolicy').denies('updateCheckup', defect!, check)) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toRoute('DefectsController.show', { id: check.id_defect })
    }

    const users = await UserService.getCleanUsers()
    const departments = await DepartmentService.getCleanDepartments()

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
  }

  public async checkupUpdate({ request, response, params, session, bouncer }: HttpContextContract) {
    const check = await IntermediateCheck.findOrFail(params.id)
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
    const defect = await Defect.findOrFail(idDefect)

    if (await bouncer.with('DefectTMPolicy').denies('close', defect)) {
      session.flash('dangerMessage', 'У вас нет прав на закрытие дефекта или дефект уже закрыт')

      return response.redirect().toPath('/')
    }

    const users = await UserService.getCleanUsers()

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
  }

  public async closeDefectStore({
    params,
    request,
    response,
    session,
    bouncer,
  }: HttpContextContract) {
    const idDefect = await params.id
    const defect = await Defect.findOrFail(idDefect)

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
  }

  public async deletingCompletionRecord({
    response,
    params,
    session,
    bouncer,
  }: HttpContextContract) {
    const { id } = params
    const defect = await Defect.findOrFail(id)

    if (await bouncer.with('DefectTMPolicy').denies('deletingCompletionRecord', defect)) {
      session.flash('dangerMessage', 'У вас нет прав на удаление или у дефекта нету результатов!')

      return response.redirect().toRoute('DefectsController.index')
    }

    const updDefect = {
      ...defect,
      result: null,
      elimination_date: null,
      id_name_eliminated: null,
    }

    await defect.merge(updDefect).save()

    session.flash('successMessage', `Запись удалена!`)
    return response.redirect().back()
  }
}
