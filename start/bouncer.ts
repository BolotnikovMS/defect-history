import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import Logger from '@ioc:Adonis/Core/Logger'
import Roles from 'App/Enums/Roles'
import Defect from 'App/Models/Defect'
import User from 'App/Models/User'

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
  .define('viewTypesDefects', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })
  .define('createTypeDefect', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })
  .define('editTypeDefect', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })
  .define('deleteTypeDefect', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })

  // Substations action
  .define('viewSubstations', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })
  .define('createSubstation', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })
  .define('editSubstation', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })
  .define('deleteSubstation', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })

  // Правило запрещающее обычному пользователю выполнять действие
  .define('noAccess', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })

  // Users
  .define('viewUsers', (user: User) => {
    return user.id_role === Roles.ADMIN
  })
  .define('createUser', (user: User) => {
    return user.id_role === Roles.ADMIN
  })
  .define('editUser', (user: User) => {
    return user.id_role === Roles.ADMIN
  })
  .define('deleteUser', (user: User) => {
    return user.id_role === Roles.ADMIN
  })

  // Defects action
  // .define('viewDefects', (user: User) => {})
  .define('createDefect', (user: User) => {
    return [Roles.USER, Roles.MODERATOR].includes(user.id_role)
  })
  .define('editDefect', (user: User, defect: Defect) => {
    return (
      user.id_role === Roles.MODERATOR ||
      (defect.id_user === user.id && defect.elimination_date === null)
    )
  })
  .define('deleteDefect', (user: User, defect: Defect) => {
    return (
      user.id_role === Roles.MODERATOR ||
      (defect.id_user === user.id && defect.elimination_date === null)
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
  .define('viewDepartment', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })
  .define('createDepartment', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })
  .define('updateDepartment', (user: User) => {
    return user.id_role === Roles.MODERATOR
  })
  .define('deleteDepartment', (user: User) => {
    return user.id_role === Roles.MODERATOR
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
