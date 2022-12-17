import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DefectValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */

  public schema = schema.create({
    defect_type: schema.string(),
    substation: schema.string(),
    accession: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(2)]),
    description_defect: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(2)]),
    term_elimination: schema.string(),
    importance: schema.string.optional(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'defect_type.required': 'Поле "Тип дефекта" является обязательным.',
    'substation.required': 'Поле "Объект" является обязательным.',
    'accession.required': 'Поле "Присоединение" является обязательным.',
    'accession.minLength': 'Минимальная длинна поля "Присоединение" 2 символа.',
    'description_defect.required': 'Поле "Описание дефекта" является обязательным.',
    'description_defect.minLength': 'Минимальная длинна поля "Описание дефекта" 2 символа.',
  }
}
