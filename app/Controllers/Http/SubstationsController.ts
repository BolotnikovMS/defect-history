import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { typesObject } from 'App/Constants/TypesObject'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import DefectType from 'App/Models/DefectType'
import District from 'App/Models/District'
import Substation from 'App/Models/Substation'
import SubstationValidator from '../../Validators/SubstationValidator'

export default class SubstationsController {
  public async index({ request, response, view, bouncer, session }: HttpContextContract) {
    if (await bouncer.with('SubstationPolicy').denies('view')) {
      session.flash('dangerMessage', 'У вас нет прав для просмотра!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 20
    const { typeObject } = request.qs() as IQueryParams
    const customTitle = typeObject === 'ps' ? 'ПС' : typeObject === 'vl' ? 'ВЛ' : 'всех объектов'
    const substations = await Substation.query()
      .if(typeObject, (query) => query.where('type', typeObject))
      .orderBy('name', 'asc')
      .preload('defects')
      .preload('defectsOs')
      .paginate(page, limit)

    substations.baseUrl('/substations')
    substations.queryString({ typeObject })

    // substations.sort(
    //   (prevItem, nextItem) => nextItem.numberOpenDefects - prevItem.numberOpenDefects
    // )

    return view.render('pages/substation/index', {
      title: `Список ${customTitle}`,
      substations,
      typeObject,
    })
  }

  public async create({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('SubstationPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const districts = await District.query()
    const { typeObject, district } = request.qs() as IQueryParams

    return view.render('pages/substation/form', {
      title: 'Добавление нового объкта',
      districts,
      options: {
        routePath: {
          saveData: 'substations.store',
        },
        routeParams: {
          back: typeObject,
          district,
        },
      },
      typesObject,
    })
  }

  public async store({ request, response, session, auth, bouncer }: HttpContextContract) {
    if (await bouncer.with('SubstationPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const validateSubstation = await request.validate(SubstationValidator)

    if (validateSubstation) {
      await Substation.create({
        id_district: validateSubstation.district,
        id_user_created: auth.user?.id,
        name: validateSubstation.name,
        type: validateSubstation.type,
      })

      session.flash(
        'successMessage',
        `Объект с названием "${validateSubstation.name}" успешно добавлен!`
      )

      if (validateSubstation.addNext) {
        return response.redirect().back()
      }

      response
        .redirect()
        .toRoute('substations.index', { qs: { typeObject: validateSubstation.type } })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('substations.index')
    }
  }

  public async show({ request, response, params, view, session }: HttpContextContract) {
    const substation = await Substation.find(params.id)

    if (substation) {
      const {
        status,
        typeDefect,
        defectsClass = 'defects',
        sort = 'default',
      } = request.qs() as IQueryParams
      const typesDefects = await DefectType.query()

      if (defectsClass === 'defects') {
        await substation.load('defects', (query) => {
          query
            .if(typeDefect !== undefined && typeDefect !== 'all', (query) =>
              query.where('id_type_defect', '=', typeDefect!)
            )
            .if(sort === 'elimination_date_desc', (query) =>
              query.orderBy('elimination_date', 'desc')
            )
            .if(sort === 'elimination_date_asc', (query) =>
              query.orderBy('elimination_date', 'asc')
            )
            .if(sort === 'term_elimination_desc', (query) =>
              query.orderBy('term_elimination', 'desc')
            )
            .if(sort === 'term_elimination_asc', (query) =>
              query.orderBy('term_elimination', 'asc')
            )
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
            .if(status === 'open', (query) => query.whereNull('result'))
            .if(status === 'close', (query) => query.whereNotNull('result'))
            .preload('accession')
            .preload('defect_type')
            .preload('work_planning')
            .preload('intermediate_checks')
            .preload('user')
        })
      } else {
        await substation.load('defectsOs', (query) => {
          query
            .orderBy('elimination_date', 'asc')
            .if(status === 'open', (query) => query.whereNull('result'))
            .if(status === 'close', (query) => query.whereNotNull('result'))
            .preload('user')
            .preload('defect_group')
        })
      }

      return view.render('pages/substation/show', {
        title: `Дефекты ${substation.name}`,
        substation,
        typesDefects,
        filters: {
          status,
          defectsClass,
          sort,
          typeDefect,
        },
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async showAttachments({
    request,
    response,
    params,
    view,
    session,
    bouncer,
  }: HttpContextContract) {
    const substation = await Substation.find(params.idSubstation)

    if (request.ajax()) {
      await substation?.load('accession')

      return response.send(substation?.accession)
    }

    if (substation) {
      if (await bouncer.with('SubstationPolicy').denies('viewAttachment')) {
        session.flash('dangerMessage', 'У вас нет прав для просмотра!')

        return response.redirect().toPath('/')
      }

      await substation?.load('accession')

      return view.render('pages/substation/show-accession', {
        title: `Список присоединений ${substation.name}`,
        substation,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    const substation = await Substation.find(params.id)

    if (await bouncer.with('SubstationPolicy').denies('update')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    if (substation) {
      const districts = await District.query()

      return view.render('pages/substation/form', {
        title: 'Редактирование',
        options: {
          idData: substation.id,
          routePath: {
            saveData: 'substations.update',
          },
          routeParams: {
            back: substation.type,
          },
        },
        districts,
        substation,
        typesObject,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    const substation = await Substation.find(params.id)

    if (await bouncer.with('SubstationPolicy').denies('update')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    if (substation) {
      const validateSubstation = await request.validate(SubstationValidator)

      await substation
        .merge({
          id_district: validateSubstation.district,
          type: validateSubstation.type,
          name: validateSubstation.name,
          importance: validateSubstation.importance ? true : false,
        })
        .save()

      session.flash('successmessage', `Данные "${validateSubstation.name}" успешно обновлены.`)
      return response
        .redirect()
        .toRoute('SubstationsController.index', { qs: { typeObject: validateSubstation.type } })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      return response.redirect().back()
    }
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    const substation = await Substation.find(params.id)

    if (await bouncer.with('SubstationPolicy').denies('delete')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().toPath('/')
    }

    if (substation) {
      await substation.delete()

      session.flash('successMessage', `Объект успешно удален!`)
      return response
        .redirect()
        .toRoute('SubstationsController.index', { qs: { typeObject: substation.type } })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      return response.redirect().back()
    }
  }
}
