import Roles from 'App/Enums/Roles'
import DefectOs from 'App/Models/DefectOs'
import User from 'App/Models/User'
import BasePolicy from 'App/Policies/BasePolicy'
import { userPermissionCheck } from 'App/Utils/utils'

export default class DefectOSPolicy extends BasePolicy {
  public async view(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('viewDefectsOS', user.permissions)
    )
  }
  public async close(user: User, defectOs: DefectOs) {
    await user.load('permissions')

    if (defectOs.result !== null) return false

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('closeDefectOS', user.permissions)
    )
  }
  public async update(user: User, defectOs: DefectOs) {
    await user.load('permissions')

    if (defectOs.elimination_date !== null && defectOs.result !== null) {
      return false
    } else {
      return (
        user.id_role === Roles.MODERATOR || userPermissionCheck('editDefectOS', user.permissions)
      )
    }
  }
  public async delete(user: User, defectOs: DefectOs) {
    await user.load('permissions')

    if (defectOs.elimination_date !== null && defectOs.result !== null) {
      return false
    } else {
      return (
        user.id_role === Roles.MODERATOR || userPermissionCheck('deleteDefectOS', user.permissions)
      )
    }
  }
  public async updateDeadline(user: User, defectOs: DefectOs) {
    await user.load('permissions')

    if (defectOs.elimination_date !== null && defectOs.result !== null) {
      return false
    } else {
      return (
        user.id_role === Roles.MODERATOR ||
        userPermissionCheck('editDefectDeadline', user.permissions)
      )
    }
  }
}
