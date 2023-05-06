import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import Logger from '@ioc:Adonis/Core/Logger'
import Roles from 'App/Enums/Roles'
import Defect from 'App/Models/Defect'
import User from 'App/Models/User'
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

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('viewTypesDefects', user.permissions)) {
      return true
    }

    return false
  })
  .define('createTypeDefect', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('createTypeDefect', user.permissions)) {
      return true
    }

    return false
  })
  .define('editTypeDefect', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('editTypeDefect', user.permissions)) {
      return true
    }

    return false
  })
  .define('deleteTypeDefect', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('deleteTypeDefect', user.permissions)) {
      return true
    }

    return false
  })

  // Substations action
  .define('viewSubstations', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('viewSubstations', user.permissions)) {
      return true
    }

    return false
  })
  .define('createSubstation', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('createSubstation', user.permissions)) {
      return true
    }

    return false
  })
  .define('editSubstation', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('editSubstation', user.permissions)) {
      return true
    }

    return false
  })
  .define('deleteSubstation', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('deleteSubstation', user.permissions)) {
      return true
    }

    return false
  })

  // Users
  .define('viewUsers', async (user: User) => {
    await user.load('permissions')

    if (userPermissionCheck('viewUsers', user.permissions)) {
      return true
    }

    return false
  })
  .define('createUser', async (user: User) => {
    await user.load('permissions')

    if (userPermissionCheck('createUser', user.permissions)) {
      return true
    }

    return false
  })
  .define('editUser', async (user: User) => {
    await user.load('permissions')

    if (userPermissionCheck('editUser', user.permissions)) {
      return true
    }

    return false
  })
  .define('viewingUserPermissions', async (user: User) => {
    await user.load('permissions')

    if (userPermissionCheck('viewingUserPermissions', user.permissions)) {
      return true
    }

    return false
  })
  .define('addingPermissionToUser', async (user: User) => {
    await user.load('permissions')

    if (userPermissionCheck('addingPermissionToUser', user.permissions)) {
      return true
    }

    return false
  })
  .define('removeUserPermissions', async (user: User) => {
    await user.load('permissions')

    if (userPermissionCheck('removeUserPermissions', user.permissions)) {
      return true
    }

    return false
  })
  .define('deleteUser', async (user: User) => {
    await user.load('permissions')

    if (userPermissionCheck('deleteUser', user.permissions)) {
      return true
    }

    return false
  })

  // Defects action
  // .define('viewDefects', (user: User) => {})
  .define('createDefect', (user: User) => {
    return [Roles.USER, Roles.MODERATOR].includes(user.id_role)
  })
  .define('editDefect', async (user: User, defect: Defect) => {
    await user.load('permissions')

    if (defect.elimination_date !== null && defect.result !== null) {
      return false
    } else {
      return (
        user.id_role === Roles.MODERATOR ||
        (defect.id_user_created === user.id && defect.elimination_date === null) ||
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
  .define('createCheckup', (user: User) => {
    return [Roles.USER, Roles.MODERATOR].includes(user.id_role)
  })
  .define('createCloseDefect', (user: User) => {
    return [Roles.USER, Roles.MODERATOR].includes(user.id_role)
  })

  // Department
  .define('viewDepartment', async (user: User) => {
    await user.load('permissions')

    if (userPermissionCheck('viewDepartment', user.permissions)) {
      return true
    }

    return false
  })
  .define('createDepartment', async (user: User) => {
    await user.load('permissions')

    if (userPermissionCheck('createDepartment', user.permissions)) {
      return true
    }

    return false
  })
  .define('updateDepartment', async (user: User) => {
    await user.load('permissions')

    if (userPermissionCheck('updateDepartment', user.permissions)) {
      return true
    }

    return false
  })
  .define('deleteDepartment', async (user: User) => {
    await user.load('permissions')

    if (userPermissionCheck('deleteDepartment', user.permissions)) {
      return true
    }

    return false
  })

  // Districts
  .define('viewDistrict', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('viewDistrict', user.permissions)) {
      return true
    }

    return false
  })
  .define('createDistrict', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('createDistrict', user.permissions)) {
      return true
    }

    return false
  })
  .define('updateDistrict', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('updateDistrict', user.permissions)) {
      return true
    }

    return false
  })
  .define('deleteDistrict', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('deleteDistrict', user.permissions)) {
      return true
    }

    return false
  })

  // Distribution groups
  .define('viewDistributionGroup', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('viewDistributionGroup', user.permissions)) {
      return true
    }

    return false
  })

  .define('createDistributionGroup', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('createDistributionGroup', user.permissions)) {
      return true
    }

    return false
  })

  .define('showDistributionGroup', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('showDistributionGroup', user.permissions)) {
      return true
    }

    return false
  })

  .define('addUserInGroup', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('addUserInGroup', user.permissions)) {
      return true
    }

    return false
  })

  .define('removeUserFromGroup', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('removeUserFromGroup', user.permissions)) {
      return true
    }

    return false
  })

  .define('updateDistributionGroup', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('updateDistributionGroup', user.permissions)) {
      return true
    }

    return false
  })

  .define('deleteDistributionGroup', async (user: User) => {
    await user.load('permissions')

    if (user.id_role === Roles.MODERATOR) {
      return true
    } else if (userPermissionCheck('deleteDistributionGroup', user.permissions)) {
      return true
    }

    return false
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
