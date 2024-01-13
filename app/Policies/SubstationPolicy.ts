import Roles from 'App/Enums/Roles'
import User from 'App/Models/User'
import BasePolicy from 'App/Policies/BasePolicy'
import { userPermissionCheck } from 'App/Utils/utils'

export default class SubstationPolicy extends BasePolicy {
  public async view(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('viewSubstations', user.permissions)
    )
  }
  public async create(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('createSubstation', user.permissions)
    )
  }
  public async update(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('editSubstation', user.permissions)
    )
  }
  public async delete(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('deleteSubstation', user.permissions)
    )
  }
  public async viewAttachment(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('viewAttachment', user.permissions)
    )
  }
  public async creatingAttachment(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('creatingAttachment', user.permissions)
    )
  }
  public async editAttachment(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('editAttachment', user.permissions)
    )
  }
  public async deleteAttachment(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('deleteAttachment', user.permissions)
    )
  }
}
