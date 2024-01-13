import User from 'App/Models/User'
import BasePolicy from 'App/Policies/BasePolicy'
import { userPermissionCheck } from 'App/Utils/utils'

export default class PermissionPolicy extends BasePolicy {
  public async view(user: User) {
    await user.load('permissions')

    return userPermissionCheck('viewPermissions', user.permissions)
  }
  public async create(user: User) {
    await user.load('permissions')

    return userPermissionCheck('createPermissions', user.permissions)
  }
  public async viewPermissions(user: User) {
    await user.load('permissions')

    return userPermissionCheck('viewingUserPermissions', user.permissions)
  }
  public async addPermissionToUser(user: User) {
    await user.load('permissions')

    return userPermissionCheck('addingPermissionToUser', user.permissions)
  }
  public async removeUserPermissions(user: User) {
    await user.load('permissions')

    return userPermissionCheck('removeUserPermissions', user.permissions)
  }
}
