import Roles from 'App/Enums/Roles'
import User from 'App/Models/User'
import BasePolicy from 'App/Policies/BasePolicy'
import { userPermissionCheck } from 'App/Utils/utils'

export default class DistributionGroupPolicy extends BasePolicy {
  public async view(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('viewDistributionGroup', user.permissions)
    )
  }
  public async create(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('createDistributionGroup', user.permissions)
    )
  }
  public async show(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('showDistributionGroup', user.permissions)
    )
  }
  public async update(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('updateDistributionGroup', user.permissions)
    )
  }
  public async delete(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('deleteDistributionGroup', user.permissions)
    )
  }
  public async addUserInGroup(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('addUserInGroup', user.permissions)
    )
  }
  public async removeUserFromGroup(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('removeUserFromGroup', user.permissions)
    )
  }
}
