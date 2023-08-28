import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'

import District from 'App/Models/District'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Substation from 'App/Models/Substation'

export default class ReportsController {
  public async showSubstationDefects({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewReportSubstationDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const substations = await Substation.query()

    return view.render('pages/reports/substation_defects/index', {
      title: 'Список дефектов по ПС',
      messages: {
        noContent: 'Отчет не сформирован.',
      },
      substations,
    })
  }

  public async getSubstationDefects({
    request,
    response,
    view,
    session,
    bouncer,
  }: HttpContextContract) {
    if (await bouncer.denies('viewReportSubstationDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const substations = await Substation.query()
    const validationSchema = schema.create({
      substation: schema.number(),
      filter: schema.string(),
    })
    const customMessages: CustomMessages = {
      required: 'Поле является обязательным.',
    }
    const validateData = await request.validate({
      schema: validationSchema,
      messages: customMessages,
    })
    const substation = await Substation.find(validateData.substation)
    let noContent: string | null = null
    let titleText: string = ''

    if (substation) {
      await substation.load((loader) => {
        loader.load('defects', (defectQuery) => {
          titleText = 'всех'
          noContent = 'По ПС нету открытых дефектов'
          defectQuery
            .preload('defect_type')
            .preload('accession')
            .preload('intermediate_checks')
            .if(validateData.filter === 'openDefects', (query) => {
              titleText = 'открытых дефектов'
              noContent = substation?.defects?.length ? null : 'По ПС нету открытых дефектов.'
              query.whereNull('result')
            })
            .if(validateData.filter === 'openDefectsWithResults', (query) => {
              titleText = 'открытых дефектов с промежуточными результатами'
              noContent = substation?.defects?.length
                ? null
                : 'По ПС нету открытых дефектов с промежуточными результатами.'
              query.has('intermediate_checks')
            })
            .if(validateData.filter === 'closeDefects', (query) => {
              titleText = 'закрытых дефектов'
              noContent = substation?.defects?.length ? null : 'По ПС нету закрытых дефектов.'
              query.whereNotNull('result')
            })
        })
      })

      return view.render('pages/reports/substation_defects/index', {
        title: `Список ${titleText} дефектов по ПС '${substation.name}'`,
        messages: {
          noContent: noContent,
        },
        substation,
        substations,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('reports.show.substation.defects')
    }
  }

  public async showDistrictDefects({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewReportDistrictDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const districts = await District.query()

    return view.render('pages/reports/districts_defect/index', {
      title: 'Список дефектов по РЭС или ГП',
      messages: {
        noContent: 'Отчет не сформирован.',
      },
      districts,
    })
  }

  public async getDistrictDefects({
    request,
    response,
    view,
    session,
    bouncer,
  }: HttpContextContract) {
    if (await bouncer.denies('viewReportDistrictDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const districts = await District.query()
    const validationSchema = schema.create({
      district: schema.number(),
      filter: schema.string(),
    })
    const customMessages: CustomMessages = {
      required: 'Поле является обязательным.',
    }
    const validateData = await request.validate({
      schema: validationSchema,
      messages: customMessages,
    })
    const district = await District.find(validateData.district)
    let noContentDefect: string | null = null
    let titleText: string = ''

    if (district) {
      await district.load((loader) => {
        loader.load('substations', (substationsQuery) => {
          substationsQuery.preload('defects', (defectsQuery) => {
            titleText = 'всех'
            noContentDefect = 'По ПС нету дефектов'
            defectsQuery
              .if(validateData.filter === 'openDefects', (query) => {
                titleText = 'открытых'
                noContentDefect = 'По ПС нету открытых дефектов'
                query.whereNull('result')
              })
              .if(validateData.filter === 'closeDefects', (query) => {
                titleText = 'закрытых'
                noContentDefect = 'По ПС нету закрытых дефектов'
                query.whereNotNull('result')
              })
              .orderBy('term_elimination', 'asc')
              .preload('defect_type')
              .preload('accession')
          })
        })
      })

      return view.render('pages/reports/districts_defect/index', {
        title: `Список ${titleText} дефектов по "${district?.name}"`,
        messages: {
          noContent: 'В районе или ГП нету ПС.',
          noContentDefect: noContentDefect,
        },
        district,
        districts,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('reports.show.district.defects')
    }
  }

  public async showAllDefects({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewReportAllDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    return view.render('pages/reports/all_defects/index', {
      title: 'Список дефектов',
      messages: {
        noContent: 'Отчет не сформирован.',
      },
    })
  }

  public async getAllDefects({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewReportAllDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const validationSchema = schema.create({
      filter: schema.string(),
    })
    const customMessages: CustomMessages = {
      required: 'Поле является обязательным.',
    }
    const validateData = await request.validate({
      schema: validationSchema,
      messages: customMessages,
    })
    let noContentDefect: string | null = null
    let titleText: string = 'всех'

    const districts = await District.query()
      .preload('district_defects')
      .preload('substations', (substationQuery) => {
        substationQuery.preload('defects', (defectQuery) => {
          titleText = 'всех'
          noContentDefect = 'Дефектов нету'
          defectQuery
            .if(validateData.filter === 'openDefects', (query) => {
              titleText = 'открытых'
              noContentDefect = 'По ПС нету открытых дефектов'
              query.whereNull('result')
            })
            .if(validateData.filter === 'closeDefects', (query) => {
              titleText = 'закрытых'
              noContentDefect = 'По ПС нету закрытых дефектов'
              query.whereNotNull('result')
            })
            .orderBy('term_elimination', 'asc')
            .preload('defect_type')
            .preload('accession')
        })
      })

    // const test = districts.map((district) => district.serialize())
    // console.log(test[0])

    return view.render('pages/reports/all_defects/index', {
      title: `Список ${titleText} дефектов`,
      messages: {
        noContent: 'Нету дефектов',
        noContentDefect: noContentDefect,
      },
      districts,
    })
  }

  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
