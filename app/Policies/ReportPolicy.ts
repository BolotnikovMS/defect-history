import Roles from 'App/Enums/Roles'
import User from 'App/Models/User'
import BasePolicy from 'App/Policies/BasePolicy'
import { userPermissionCheck } from 'App/Utils/utils'

export default class ReportPolicy extends BasePolicy {
  public async viewReportSubstationDefects(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('viewReportSubstationDefects', user.permissions)
    )
  }
  public async viewReportDistrictDefects(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('viewReportDistrictDefects', user.permissions)
    )
  }
  public async viewReportAllDefects(user: User) {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('viewReportAllDefects', user.permissions)
    )
  }
}
