import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('access', 255).notNullable()
      table.text('description').notNullable()

      table.timestamps()
    })

    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([
        // Actions with defect types
        {
          access: 'viewTypesDefects',
          description: 'Просмотр классификаторов дефектов',
        },
        {
          access: 'createTypeDefect',
          description: 'Добавление нового классификатора дефекта',
        },
        {
          access: 'editTypeDefect',
          description: 'Редактирование классификатора дефекта',
        },
        {
          access: 'deleteTypeDefect',
          description: 'Удаление классификатора дефекта',
        },
        // Actions with substations
        {
          access: 'viewSubstations',
          description: 'Просмотр подстанции',
        },
        {
          access: 'createSubstation',
          description: 'Добавление новой подстанции',
        },
        {
          access: 'editSubstation',
          description: 'Редактирование подстанции',
        },
        {
          access: 'deleteSubstation',
          description: 'Удаление подстанции',
        },
        // Actions accession substations
        {
          access: 'viewAttachment',
          description: 'Просмотр присоединений',
        },
        {
          access: 'creatingAttachment',
          description: 'Добавление нового присоединения',
        },
        {
          access: 'editAttachment',
          description: 'Редактирование присоединения',
        },
        {
          access: 'deleteAttachment',
          description: 'Удаление присоединения',
        },
        // Actions with users
        {
          access: 'viewUsers',
          description: 'Просмотр пользователей',
        },
        {
          access: 'createUser',
          description: 'Добавление нового пользователя',
        },
        {
          access: 'viewingUserPermissions',
          description: 'Просмотр разрешений пользователей',
        },
        {
          access: 'addingPermissionToUser',
          description: 'Добавление разрешений пользователю',
        },
        {
          access: 'removeUserPermissions',
          description: 'Удаление разрешений пользователя',
        },
        {
          access: 'editUser',
          description: 'Редактирование пользователя',
        },
        {
          access: 'deleteUser',
          description: 'Удаление пользователя',
        },
        // Actions with defects
        {
          access: 'createDefect',
          description: 'Добавление нового дефекта',
        },
        {
          access: 'editDefect',
          description: 'Редактирование дефекта',
        },
        {
          access: 'editDefectDeadline',
          description: 'Изменение срока устранения дефекта',
        },
        {
          access: 'deleteDefect',
          description: 'Удаление дефекта',
        },
        // Activities with defect checks and closures
        {
          access: 'createCheckup',
          description: 'Добавление промежуточной проверки',
        },
        {
          access: 'createCloseDefect',
          description: 'Закрытие дефекта',
        },
        // Actions with departments
        {
          access: 'viewDepartment',
          description: 'Просмотр отделов',
        },
        {
          access: 'createDepartment',
          description: 'Добавление нового отдела',
        },
        {
          access: 'updateDepartment',
          description: 'Редактирование отдела',
        },
        {
          access: 'deleteDepartment',
          description: 'Удаление отдела',
        },
        // Actions with districts
        {
          access: 'viewDistrict',
          description: 'Просмотр районов',
        },
        {
          access: 'createDistrict',
          description: 'Добавление нового района',
        },
        {
          access: 'updateDistrict',
          description: 'Редактирование района',
        },
        {
          access: 'deleteDistrict',
          description: 'Удаление района',
        },
        // Actions with distribution groups
        {
          access: 'viewDistributionGroup',
          description: 'Просмотр групп рассылки',
        },
        {
          access: 'createDistributionGroup',
          description: 'Добавление новой группы рассылки',
        },
        {
          access: 'showDistributionGroup',
          description: 'Просмотр выбранной группы рассылки',
        },
        {
          access: 'addUserInGroup',
          description: 'Добавление пользователя в группу рассылки',
        },
        {
          access: 'removeUserFromGroup',
          description: 'Удаление пользователя из группы рассылки',
        },
        {
          access: 'updateDistributionGroup',
          description: 'Редактирование группы рассылки',
        },
        {
          access: 'deleteDistributionGroup',
          description: 'Удаление группы рассылки',
        },
      ])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
