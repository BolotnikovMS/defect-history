import User from 'App/Models/User'
import BasePolicy from 'App/Policies/BasePolicy'
import { userPermissionCheck } from 'App/Utils/utils'

export default class DepartmentPolicy extends BasePolicy {
  public async view(user: User) {
    await user.load('permissions')

    return userPermissionCheck('viewDepartment', user.permissions)
  }
  public async create(user: User) {
    await user.load('permissions')

    return userPermissionCheck('createDepartment', user.permissions)
  }
  public async update(user: User) {
    await user.load('permissions')

    return userPermissionCheck('updateDepartment', user.permissions)
  }
  public async delete(user: User) {
    await user.load('permissions')

    return userPermissionCheck('deleteDepartment', user.permissions)
  }
  public async viewingUsersForDepartment(user: User) {
    await user.load('permissions')

    return userPermissionCheck('viewingUsersForDepartment', user.permissions)
  }
}
