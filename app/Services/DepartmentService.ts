import { Departments } from 'App/Enums/Departments'
import Department from 'App/Models/Department'

export default class DepartmentService {
  public static async getCleanDepartments(): Promise<Department[]> {
    const departments = await Department.query().where((queryDepartment) => {
      queryDepartment.where('id', '!=', Departments.admins)
      queryDepartment.where('id', '!=', Departments.withoutDepartment)
    })

    return departments
  }
}
