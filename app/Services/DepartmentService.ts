import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { Departments } from 'App/Enums/Departments'
import Department from 'App/Models/Department'
import DepartmentValidator from 'App/Validators/DepartmentValidator'

export default class DepartmentService {
  public static async getCleanDepartments(): Promise<Department[]> {
    const departments = await Department.query().where((queryDepartment) => {
      queryDepartment.where('id', '!=', Departments.admins)
      queryDepartment.where('id', '!=', Departments.withoutDepartment)
    })

    return departments
  }
  public static async getDepartments(
    req: RequestContract,
    limit: number = 15
  ): Promise<Department[]> {
    const page = req.input('page', 1)
    const limitData = limit
    const departments = await Department.query()
      .preload('department_users')
      .paginate(page, limitData)

    departments.baseUrl('/departments')

    return departments
  }
  public static async getDepartment(params: Record<string, unknown>): Promise<Department> {
    const department = await Department.findOrFail(params.id)

    await department.load('department_users')

    return department
  }
  public static async store(req: RequestContract, auth: AuthContract): Promise<Department> {
    const validatedData = await req.validate(DepartmentValidator)

    const department = await Department.create({
      id_user_created: auth.user?.id,
      name: validatedData.name,
    })

    return department
  }
}
