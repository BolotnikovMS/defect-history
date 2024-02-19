import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AccessionSubstation from 'App/Models/AccessionSubstation'
import AccessionSubstationValidator from 'App/Validators/AccessionSubstationValidator'

export default class AccessionSubstationsController {
  public async index({ response }: HttpContextContract) {
    const accession = await AccessionSubstation.query()

    return response.send(accession)
  }

  public async create({ response, view, params, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('SubstationPolicy').denies('creatingAttachment')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    return view.render('pages/substation/form-accession', {
      title: 'Добавление нового присоединения',
      options: {
        idData: { idSubstation: params.idSubstation },
        dataSubstation: { idSubstation: params.idSubstation },
        routePath: {
          saveData: 'accession-substations.store',
        },
      },
    })
  }

  public async store({ request, response, params, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('SubstationPolicy').denies('creatingAttachment')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const idSubstation = parseInt(params.idSubstation)
    const validateData = await request.validate(AccessionSubstationValidator)

    await AccessionSubstation.create({
      id_substation: idSubstation,
      name: validateData.name,
      importance: validateData.importance,
    })

    session.flash('successMessage', `Присоединение "${validateData.name}" успешно добавлено!`)

    if (validateData.addNext) {
      return response.redirect().back()
    }

    return response
      .redirect()
      .toRoute('SubstationsController.showAttachments', { idSubstation: idSubstation })
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('SubstationPolicy').denies('editAttachment')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    const accession = await AccessionSubstation.findOrFail(params.id)

    return view.render('pages/substation/form-accession', {
      title: 'Добавление нового присоединения',
      options: {
        idData: { id: params.id },
        dataSubstation: { idSubstation: accession.id_substation },
        routePath: {
          saveData: 'accession-substations.update',
        },
      },
      accession,
    })
  }

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('SubstationPolicy').denies('editAttachment')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    const accession = await AccessionSubstation.findOrFail(params.id)
    const validateData = await request.validate(AccessionSubstationValidator)

    await accession
      .merge({ ...validateData, importance: validateData.importance ? true : false })
      .save()

    session.flash('successmessage', `Данные "${validateData.name}" успешно обновлены.`)
    response
      .redirect()
      .toRoute('SubstationsController.showAttachments', { idSubstation: accession.id_substation })
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('SubstationPolicy').denies('deleteAttachment')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().toPath('/')
    }

    const accession = await AccessionSubstation.findOrFail(params.id)

    await accession.delete()

    session.flash('successMessage', `Присоединение успешно удалено!`)
    return response.redirect().back()
  }
}
