import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DistributionGroup from 'App/Models/DistributionGroup'
import DistributionGroupsUser from 'App/Models/DistributionGroupsUser'
import User from 'App/Models/User'
import DistributionGroupValidator from 'App/Validators/DistributionGroupValidator'
import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'

export default class DistributionGroupsController {
  public async index({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewDistributionGroup')) {
      session.flash('dangerMessage', 'У вас нет прав на просмотр страницы!')

      return response.redirect().toPath('/')
    }

    const distributionGroups = await DistributionGroup.query()
      .orderBy('created_at', 'asc')
      .preload('group_users')

    return view.render('pages/distribution/index', {
      title: 'Группы рассылок',
      distributionGroups,
      activeMenuLink: 'distribution.index',
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createDistributionGroup')) {
      session.flash('dangerMessage', 'У вас нет прав на создание записи!')

      return response.redirect().toPath('/')
    }

    return view.render('pages/distribution/form', {
      title: 'Добавление новой записи',
      options: {
        routePath: {
          savePath: 'distribution.store',
        },
      },
    })
  }

  public async store({ request, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createDistributionGroup')) {
      session.flash('dangerMessage', 'У вас нет прав на создание записи!')

      return response.redirect().toPath('/')
    }

    const validateDataGroup = await request.validate(DistributionGroupValidator)

    await DistributionGroup.create(validateDataGroup)

    response.redirect().toRoute('distribution.index')
  }

  public async show({ response, params, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('showDistributionGroup')) {
      session.flash('dangerMessage', 'У вас нет прав на просмотр группы!')

      return response.redirect().toPath('/')
    }

    const group = await DistributionGroup.find(params.id)

    if (group) {
      const users = await User.all()

      await group.load('group_users')

      const filteredArrayUsers = users.filter((user) => {
        return group.group_users.every((userInGroup) => {
          return userInGroup.id !== user.id
        })
      })

      return view.render('pages/distribution/show', {
        title: `Подробный просмотр группы: '${group.name}'`,
        group,
        users: filteredArrayUsers,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('distribution.index')
    }
  }

  public async addUserInGroup({ params, request, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('addUserInGroup')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление пользователя в группу!')

      return response.redirect().toPath('/')
    }

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

  public async removeUserFromGroup({ response, params, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('removeUserFromGroup')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление пользователя из группы!')

      return response.redirect().toPath('/')
    }

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

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('updateDistributionGroup')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

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

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('updateDistributionGroup')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    const group = await DistributionGroup.find(params.id)

    const validateDataGroup = await request.validate(DistributionGroupValidator)

    await group?.merge(validateDataGroup).save()

    session.flash('successMessage', `Данные группы успешно обновлены.`)
    response.redirect().toRoute('distribution.index')
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('deleteDistributionGroup')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().toPath('/')
    }

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
