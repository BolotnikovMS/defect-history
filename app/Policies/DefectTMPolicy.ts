import Roles from 'App/Enums/Roles'
import Defect from 'App/Models/Defect'
import IntermediateCheck from 'App/Models/IntermediateCheck'
import User from 'App/Models/User'
import WorkPlanning from 'App/Models/WorkPlanning'
import BasePolicy from 'App/Policies/BasePolicy'
import { userPermissionCheck } from 'App/Utils/utils'

export default class DefectTMPolicy extends BasePolicy {
  public async view(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('viewDefectsTM', user.permissions)
    )
  }
  public async create(user: User) {
    await user.load('permissions')

    return user.id_role === Roles.MODERATOR || userPermissionCheck('createDefect', user.permissions)
  }
  public async close(user: User, defect: Defect) {
    await user.load('permissions')

    if (defect.result !== null) return false

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('createCloseDefect', user.permissions)
    )
  }
  public async update(user: User, defect: Defect) {
    await user.load('permissions')

    if (defect.elimination_date !== null && defect.result !== null) {
      return false
    } else {
      return user.id_role === Roles.MODERATOR || userPermissionCheck('editDefect', user.permissions)
    }
  }
  public async updateDeadline(user: User, defect: Defect) {
    await user.load('permissions')

    if (defect.elimination_date !== null && defect.result !== null) {
      return false
    } else {
      return (
        user.id_role === Roles.MODERATOR ||
        userPermissionCheck('editDefectDeadline', user.permissions)
      )
    }
  }
  public async delete(user: User, defect: Defect) {
    await user.load('permissions')

    if (defect.elimination_date !== null && defect.result !== null) {
      return false
    } else {
      return (
        user.id_role === Roles.MODERATOR || userPermissionCheck('deleteDefect', user.permissions)
      )
    }
  }
  public async createCheckup(user: User, defect: Defect) {
    await user.load('permissions')

    if (defect.result !== null) return false

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('createCheckup', user.permissions)
    )
  }
  public async deleteCheckup(user: User, intermediateCheck: IntermediateCheck, defect: Defect) {
    await user.load('permissions')

    if (defect.result !== null) return false

    return (
      intermediateCheck?.id_user_created === user.id ||
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('deleteCheckup', user.permissions)
    )
  }
  public async addingWorkPlanningEntry(user: User, defect: Defect) {
    await user.load('permissions')

    if (defect.result !== null) return false

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('addingWorkPlanningEntry', user.permissions)
    )
  }
  public async deletingPlannedWorkEntry(user: User, defect: Defect) {
    await user.load('permissions')

    if (defect.result !== null) return false

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('deletingPlannedWorkEntry', user.permissions)
    )
  }
  public async editingPlannedWorkEntry(user: User, plannedWork: WorkPlanning, defect: Defect) {
    await user.load('permissions')

    if (defect.result !== null) return false

    return (
      plannedWork.id_user_created === user.id ||
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('editingPlannedWorkEntry', user.permissions)
    )
  }
}
