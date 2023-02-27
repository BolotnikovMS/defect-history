import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DistributionGroup from 'App/Models/DistributionGroup'
import DistributionGroupsUser from 'App/Models/DistributionGroupsUser'
import User from 'App/Models/User'
import DistributionGroupValidator from 'App/Validators/DistributionGroupValidator'
import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'

export default class DistributionGroupsController {
  public async index({ view }: HttpContextContract) {
    const distributionGroups = await DistributionGroup.query()
      .orderBy('created_at', 'asc')
      .preload('group_users')

    return view.render('pages/distribution/index', {
      title: 'Группы рассылок',
      distributionGroups,
    })
  }

  public async create({ response, view, session }: HttpContextContract) {
    return view.render('pages/distribution/form', {
      title: 'Добавление новой записи',
      options: {
        routePath: {
          savePath: 'distribution.store',
        },
      },
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const validateDataGroup = await request.validate(DistributionGroupValidator)

    await DistributionGroup.create(validateDataGroup)

    response.redirect().toRoute('distribution.index')
  }

  public async show({ response, params, view, session }: HttpContextContract) {
    const group = await DistributionGroup.find(params.id)
    const users = await User.all()

    if (group) {
      await group.load('group_users')

      return view.render('pages/distribution/show', {
        title: `Подробный просмотр группы: '${group.name}'`,
        group,
        users,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('distribution.index')
    }
  }

  public async addUserInGroup({ params, request, response, session }: HttpContextContract) {
    const idGroup = await params.idGroup
    const _schema = schema.create({
      user: schema.array([rules.minLength(1), rules.maxLength(15)]).members(schema.number()),
    })
    const _messages: CustomMessages = {
      required: 'Поле является обязательным.',
    }

    const validateDate = await request.validate({ schema: _schema, messages: _messages })

    validateDate.user.forEach(async (user) => {
      await DistributionGroupsUser.create({
        id_user: user,
        id_distribution_group: idGroup,
      })
    })

    session.flash('successMessage', `Пользователь успешно добавлен в группу!`)
    response.redirect().back()
  }

  public async removeUserFromGroup({ response, params, session }: HttpContextContract) {
    const userGroup = await DistributionGroupsUser.query().where(
      'id_distribution_group',
      '=',
      params.idGroup
    )
    const userFromGroup = userGroup.filter((group) => group.id_user === +params.idUser)

    if (userGroup.length && userFromGroup.length) {
      // console.log('userFromGroup: ', userFromGroup[0].serialize())
      await userFromGroup[0].delete()

      session.flash('successMessage', `Пользователь успешно удален из группы!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('distribution.index')
    }
  }

  public async edit({ params, response, view, session }: HttpContextContract) {
    const group = await DistributionGroup.find(params.id)

    if (group) {
      return view.render('pages/distribution/form', {
        title: 'Редактирование',
        options: {
          idData: group.id,
          routePath: {
            savePath: 'distribution.update',
          },
        },
        group,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ params, request, response, session }: HttpContextContract) {
    const group = await DistributionGroup.find(params.id)

    const validateDataGroup = await request.validate(DistributionGroupValidator)

    await group?.merge(validateDataGroup).save()

    session.flash('successMessage', `Данные группы успешно обновлены.`)
    response.redirect().toRoute('distribution.index')
  }

  public async destroy({ response, params, session }: HttpContextContract) {
    const group = await DistributionGroup.find(params.id)

    if (group) {
      await group.related('group_users').query().delete()
      await group.delete()

      session.flash('successMessage', `Группа успешно удалена!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }
}
