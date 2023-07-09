import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import Logger from '@ioc:Adonis/Core/Logger'
import Roles from 'App/Enums/Roles'
import Defect from 'App/Models/Defect'
import User from 'App/Models/User'
import IntermediateCheck from 'App/Models/IntermediateCheck'
import { userPermissionCheck } from 'App/Utils/utils'

/*
|--------------------------------------------------------------------------
| Bouncer Actions
|--------------------------------------------------------------------------
|
| Actions allows you to separate your application business logic from the
| authorization logic. Feel free to make use of policies when you find
| yourself creating too many actions
|
| You can define an action using the `.define` method on the Bouncer object
| as shown in the following example
|
| ```
| 	Bouncer.define('deletePost', (user: User, post: Post) => {
|			return post.user_id === user.id
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "actions" const from this file
|****************************************************************
*/
export const { actions } = Bouncer.before((user: User | null) => {
  // Проверяем роль пользователя, если admin, то есть все права
  if (user?.id_role !== Roles.ADMIN) {
  } else {
    return true
  }
})
  .after((user: User | null, actionName, actionResult) => {
    const userType = user ? 'User' : 'Guest'

    actionResult.authorized
      ? Logger.info(`${userType} was authorized to ${actionName}`)
      : Logger.info(`${userType} was denied to ${actionName} for ${actionResult.errorResponse}`)
  })

  // Type defect action
  .define('viewTypesDefects', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('viewTypesDefects', user.permissions)
    )
  })
  .define('createTypeDefect', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('createTypeDefect', user.permissions)
    )
  })
  .define('editTypeDefect', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('editTypeDefect', user.permissions)
    )
  })
  .define('deleteTypeDefect', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('deleteTypeDefect', user.permissions)
    )
  })

  // Substations action
  .define('viewSubstations', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('viewSubstations', user.permissions)
    )
  })
  .define('createSubstation', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('createSubstation', user.permissions)
    )
  })
  .define('editSubstation', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('editSubstation', user.permissions)
    )
  })
  .define('deleteSubstation', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('deleteSubstation', user.permissions)
    )
  })

  // Accession substations
  .define('viewAttachment', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('viewAttachment', user.permissions)
    )
  })
  .define('creatingAttachment', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('creatingAttachment', user.permissions)
    )
  })
  .define('editAttachment', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('editAttachment', user.permissions)
    )
  })
  .define('deleteAttachment', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('deleteAttachment', user.permissions)
    )
  })

  // Users
  .define('viewUsers', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('viewUsers', user.permissions)
  })
  .define('createUser', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('createUser', user.permissions)
  })
  .define('editUser', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('editUser', user.permissions)
  })
  .define('viewingUserPermissions', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('viewingUserPermissions', user.permissions)
  })
  .define('addingPermissionToUser', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('addingPermissionToUser', user.permissions)
  })
  .define('removeUserPermissions', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('removeUserPermissions', user.permissions)
  })
  .define('deleteUser', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('deleteUser', user.permissions)
  })
  // Permission actions
  .define('viewPermissions', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('viewPermissions', user.permissions)
  })
  .define('createPermissions', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('createPermissions', user.permissions)
  })

  // Defects action
  // .define('viewDefects', (user: User) => {})
  // await user.load('permissions')
  .define('createDefect', async (user: User) => {
    await user.load('permissions')

    return user.id_role === Roles.MODERATOR || userPermissionCheck('createDefect', user.permissions)
  })
  .define('editDefect', async (user: User, defect: Defect) => {
    await user.load('permissions')

    if (defect.elimination_date !== null && defect.result !== null) {
      return false
    } else {
      return (
        // eslint-disable-next-line eqeqeq
        (defect.id_user_created === user.id && defect.elimination_date == null) ||
        user.id_role === Roles.MODERATOR ||
        userPermissionCheck('editDefect', user.permissions)
      )
    }
  })
  .define('editDefectDeadline', async (user: User, defect: Defect) => {
    await user.load('permissions')

    if (defect.elimination_date !== null && defect.result !== null) {
      return false
    } else {
      return (
        user.id_role === Roles.MODERATOR ||
        userPermissionCheck('editDefectDeadline', user.permissions)
      )
    }
  })
  .define('deleteDefect', async (user: User, defect: Defect) => {
    await user.load('permissions')

    return (
      (defect.id_user_created === user.id && defect.elimination_date === null) ||
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('deleteDefect', user.permissions)
    )
  })

  // Checkup
  .define('createCheckup', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('createCheckup', user.permissions)
    )
  })
  .define('deleteCheckup', async (user: User, intermediateCheck: IntermediateCheck) => {
    await user.load('permissions')

    return (
      intermediateCheck?.id_user_created === user.id ||
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('deleteCheckup', user.permissions)
    )
  })
  .define('createCloseDefect', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('createCloseDefect', user.permissions)
    )
  })

  // Department
  .define('viewDepartment', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('viewDepartment', user.permissions)
  })
  .define('createDepartment', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('createDepartment', user.permissions)
  })
  .define('viewingUsersForDepartment', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('viewingUsersForDepartment', user.permissions)
  })
  .define('updateDepartment', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('updateDepartment', user.permissions)
  })
  .define('deleteDepartment', async (user: User) => {
    await user.load('permissions')

    return userPermissionCheck('deleteDepartment', user.permissions)
  })

  // Districts
  .define('viewDistrict', async (user: User) => {
    await user.load('permissions')

    return user.id_role === Roles.MODERATOR || userPermissionCheck('viewDistrict', user.permissions)
  })
  .define('createDistrict', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('createDistrict', user.permissions)
    )
  })
  .define('updateDistrict', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('updateDistrict', user.permissions)
    )
  })
  .define('deleteDistrict', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('deleteDistrict', user.permissions)
    )
  })

  // Distribution groups
  .define('viewDistributionGroup', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('viewDistributionGroup', user.permissions)
    )
  })
  .define('createDistributionGroup', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('createDistributionGroup', user.permissions)
    )
  })
  .define('showDistributionGroup', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('showDistributionGroup', user.permissions)
    )
  })
  .define('addUserInGroup', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR || userPermissionCheck('addUserInGroup', user.permissions)
    )
  })
  .define('removeUserFromGroup', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('removeUserFromGroup', user.permissions)
    )
  })
  .define('updateDistributionGroup', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('updateDistributionGroup', user.permissions)
    )
  })
  .define('deleteDistributionGroup', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('deleteDistributionGroup', user.permissions)
    )
  })
  // Reports
  .define('viewReportSubstationDefects', async (user: User) => {
    await user.load('permissions')

    return (
      user.id_role === Roles.MODERATOR ||
      userPermissionCheck('viewReportSubstationDefects', user.permissions)
    )
  })

/*
|--------------------------------------------------------------------------
| Bouncer Policies
|--------------------------------------------------------------------------
|
| Policies are self contained actions for a given resource. For example: You
| can create a policy for a "User" resource, one policy for a "Post" resource
| and so on.
|
| The "registerPolicies" accepts a unique policy name and a function to lazy
| import the policy
|
| ```
| 	Bouncer.registerPolicies({
|			UserPolicy: () => import('App/Policies/User'),
| 		PostPolicy: () => import('App/Policies/Post')
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "policies" const from this file
|****************************************************************
*/
export const { policies } = Bouncer.registerPolicies({})
