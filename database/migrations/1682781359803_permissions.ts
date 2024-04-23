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
          description: 'Просмотр типов дефектов',
        },
        {
          access: 'createTypeDefect',
          description: 'Добавление нового типа дефекта',
        },
        {
          access: 'editTypeDefect',
          description: 'Редактирование типа дефекта',
        },
        {
          access: 'deleteTypeDefect',
          description: 'Удаление типа дефекта',
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
        {
          access: 'viewPermissions',
          description: 'Просмотр всех прав',
        },
        {
          access: 'createPermissions',
          description: 'Добавление нового права',
        },
        // Actions with defects
        {
          access: 'viewDefectsTM',
          description: 'Просмотр дефектов по ТМ',
        },
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
          description: 'Удаление дефекта ТМ',
        },
        // Activities with defect checks and closures
        {
          access: 'createCheckup',
          description: 'Добавление промежуточной проверки',
        },
        {
          access: 'deleteCheckup',
          description: 'Удаление промежуточной проверки',
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
          access: 'viewingUsersForDepartment',
          description: 'Просмотр пользователей отдела',
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
        // Reports
        {
          access: 'viewReportSubstationDefects',
          description: 'Формирование отчета "Дефекты ПС"',
        },
        {
          access: 'viewReportDistrictDefects',
          description: 'Формирование отчета "Дефекты по районам или ГП"',
        },
        {
          access: 'viewReportAllDefects',
          description: 'Формирование отчета "Дефекты по всем ПС"',
        },
        {
          access: 'addingWorkPlanningEntry',
          description: 'Добавление записи планирования работ',
        },
        {
          access: 'editingPlannedWorkEntry',
          description: 'Редактирование записей запланированных работ',
        },
        {
          access: 'deletingPlannedWorkEntry',
          description: 'Удаление записи запланированных работ',
        },
        {
          access: 'resetPassword',
          description: 'Сброс пароля пользователя',
        },
        // Defect OS
        {
          access: 'viewDefectsOS',
          description: 'Просмотр дефектов по ОС',
        },
        {
          access: 'closeDefectOS',
          description: 'Закрытие дефекта по ОС',
        },
        {
          access: 'deleteDefectOS',
          description: 'Удаление дефекта по ОС',
        },
        {
          access: 'editDefectOS',
          description: 'Редактирование дефекта по ОС',
        },
        {
          access: 'updateCheckup',
          description: 'Редактирование промежуточных проверок дефектов ТМ',
        },
        // Defect groups
        {
          access: 'viewDefectGroups',
          description: 'Просмотр групп дефектов',
        },
        {
          access: 'createDefectGroup',
          description: 'Добавление новой группы дефектов',
        },
        {
          access: 'editDefectGroup',
          description: 'Редактирование группы дефектов',
        },
        {
          access: 'deleteDefectGroup',
          description: 'Удаление группы дефектов',
        },
        // Defect classifiers
        {
          access: 'viewDefectClassifiers',
          description: 'Просмотр классификаторов дефектов',
        },
        {
          access: 'createDefectClassifier',
          description: 'Добавление нового классификатора дефектов',
        },
        {
          access: 'updateDefectClassifier',
          description: 'Редактирование классификатора дефектов',
        },
        {
          access: 'deleteDefectClassifier',
          description: 'Удаление классификаторов дефектов',
        },
        {
          access: 'deletingCompletionRecord',
          description: 'Удаление записи о выполнении работы по дефекту',
        },
        {
          access: 'createCheckupOs',
          description: 'Добавление промежуточной проверки для дефекта ОС',
        },
        {
          access: 'updateCheckupOs',
          description: 'Редактирование промежуточных проверок дефектов ОС',
        },
        {
          access: 'deleteCheckupOs',
          description: 'Удаление промежуточных проверок дефектов ОС',
        },
        {
          access: 'viewReportAllDefectsTm',
          description: 'Формирование отчета "Все дефекты по ТМ"',
        },
      ])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
