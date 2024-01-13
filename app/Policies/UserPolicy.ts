import User from 'App/Models/User'
import BasePolicy from 'App/Policies/BasePolicy'
import { userPermissionCheck } from 'App/Utils/utils'

export default class UserPolicy extends BasePolicy {
  public async view(user: User) {
    await user.load('permissions')

    return userPermissionCheck('viewUsers', user.permissions)
  }
  public async create(user: User) {
    await user.load('permissions')

    return userPermissionCheck('createUser', user.permissions)
  }
  public async update(user: User) {
    await user.load('permissions')

    return userPermissionCheck('editUser', user.permissions)
  }
  public async delete(user: User) {
    await user.load('permissions')

    return userPermissionCheck('deleteUser', user.permissions)
  }
  public async resetPassword(user: User) {
    await user.load('permissions')

    return userPermissionCheck('resetPassword', user.permissions)
  }
}
