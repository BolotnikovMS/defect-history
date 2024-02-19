import { Departments } from 'App/Enums/Departments'
import User from 'App/Models/User'

export default class UserService {
  public static async getCleanUsers(): Promise<User[]> {
    const users = await User.query().where((queryUser) => {
      queryUser.where('blocked', '!=', true)
      queryUser.where('id', '!=', 1)
      queryUser.where('id_department', '!=', Departments.withoutDepartment)
    })

    return users
  }
}
