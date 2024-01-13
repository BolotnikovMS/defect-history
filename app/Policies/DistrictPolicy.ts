import Roles from 'App/Enums/Roles'
import User from 'App/Models/User'
import BasePolicy from 'App/Policies/BasePolicy'
import { userPermissionCheck } from 'App/Utils/utils'

export default class DistrictPolicy extends BasePolicy {
  public async view(user: User) {
    await user.load('permissions')

    return user.id_role === Roles.MODERATOR || userPermissionCheck('viewDistrict', user.permissions)
  }
  public async create(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('createDistrict', user.permissions)
    )
  }
  public async update(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('updateDistrict', user.permissions)
    )
  }
  public async delete(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('deleteDistrict', user.permissions)
    )
  }
}
