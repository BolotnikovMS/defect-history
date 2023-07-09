import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Substation from 'App/Models/Substation'
import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'

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
      intermediate_checks: schema.boolean.optional(),
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
      switch (validateData.filter) {
        case 'allDefects':
          await substation.load('defects', async (query) => {
            await query.preload('defect_type').preload('accession')
          })
          titleText = 'всех дефектов'
          noContent = substation.defects.length ? null : 'По ПС нету дефектов.'
          break
        case 'openDefects':
          await substation.load('defects', (query) => {
            query
              .whereNull('result')
              .preload('defect_type')
              .preload('accession')
              .if(validateData?.intermediate_checks, (queryDefect) => {
                queryDefect.preload('intermediate_checks')
              })
          })

          const interChecks = substation.defects.filter(
            (defect) => defect.countIntermediateChecks !== 0
          )

          substation.defects = interChecks
          console.log(interChecks)

          titleText = 'открытых дефектов'
          noContent = substation.defects.length ? null : 'По ПС нету открытых дефектов.'
          break
        case 'closeDefects':
          await substation.load('defects', (query) => {
            query.whereNotNull('result').preload('defect_type').preload('accession')
          })
          titleText = 'закрытых дефектов'
          noContent = substation.defects.length ? null : 'По ПС нету закрытых дефектов.'
          break
        default:
          console.log('Error...')
          break
      }

      return view.render('pages/reports/substation_defects/index', {
        title: `Список ${titleText} по ПС '${substation.name}'`,
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

  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
