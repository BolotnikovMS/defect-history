import Roles from 'App/Enums/Roles'
import User from 'App/Models/User'
import BasePolicy from 'App/Policies/BasePolicy'
import { userPermissionCheck } from 'App/Utils/utils'

export default class DefectGroupPolicy extends BasePolicy {
  public async view(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('viewDefectGroups', user.permissions)
    )
  }
  public async create(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('createDefectGroup', user.permissions)
    )
  }
  public async update(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('editDefectGroup', user.permissions)
    )
  }
  public async delete(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('deleteDefectGroup', user.permissions)
    )
  }
}
