import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DistributionGroup from 'App/Models/DistributionGroup'
import DistributionGroupsUser from 'App/Models/DistributionGroupsUser'

export default class DistributionGroupsController {
  public async index({ request, view }: HttpContextContract) {
    const distributionGroups = await DistributionGroup.query().orderBy('created_at', 'asc')

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
    const group = request.only(['name', 'description'])
    console.log('group: ', group)

    await DistributionGroup.create(group)

    response.redirect().toRoute('distribution.index')
  }

  public async show({ response, params, view, session }: HttpContextContract) {
    const group = await DistributionGroup.find(params.id)

    if (group) {
      await group.load('group_users')

      console.log('group: ', group.serialize())

      return view.render('pages/distribution/show', {
        title: `Подробный просмотр группы: '${group.name}'`,
        group,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('distribution.index')
    }
  }

  public async addUserInGroup({}: HttpContextContract) {}

  public async saveUserInGroup({}: HttpContextContract) {}

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

  public async update({}: HttpContextContract) {}

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
