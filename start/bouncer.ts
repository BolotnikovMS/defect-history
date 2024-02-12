import Bouncer from '@ioc:Adonis/Addons/Bouncer'

// /*
// |--------------------------------------------------------------------------
// | Bouncer Actions
// |--------------------------------------------------------------------------
// |
// | Actions allows you to separate your application business logic from the
// | authorization logic. Feel free to make use of policies when you find
// | yourself creating too many actions
// |
// | You can define an action using the `.define` method on the Bouncer object
// | as shown in the following example
// |
// | ```
// | 	Bouncer.define('deletePost', (user: User, post: Post) => {
// |			return post.user_id === user.id
// | 	})
// | ```
// |
// |****************************************************************
// | NOTE: Always export the "actions" const from this file
// |****************************************************************
// */
// export const { actions } = Bouncer.before((user: User | null) => {
//   // Проверяем роль пользователя, если admin, то есть все права
//   if (user?.id_role !== Roles.ADMIN) {
//   } else {
//     return true
//   }
// })

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
export const { policies } = Bouncer.registerPolicies({
  DefectOSPolicy: () => import('App/Policies/DefectOSPolicy'),
  DefectTMPolicy: () => import('App/Policies/DefectTMPolicy'),
  TypeDefectPolicy: () => import('App/Policies/TypeDefectPolicy'),
  SubstationPolicy: () => import('App/Policies/SubstationPolicy'),
  DepartmentPolicy: () => import('App/Policies/DepartmentPolicy'),
  DistributionGroupPolicy: () => import('App/Policies/DistributionGroupPolicy'),
  DistrictPolicy: () => import('App/Policies/DistrictPolicy'),
  UserPolicy: () => import('App/Policies/UserPolicy'),
  PermissionPolicy: () => import('App/Policies/PermissionPolicy'),
  ReportPolicy: () => import('App/Policies/ReportPolicy'),
  DefectGroupPolicy: () => import('App/Policies/DefectGroupPolicy'),
  DefectClassifierPolicy: () => import('App/Policies/DefectClassifierPolicy'),
})
