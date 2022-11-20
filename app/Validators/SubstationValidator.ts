import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SubstationValidator {
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
    name: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(2)]),
    voltage_class: schema.string({}, [rules.trim(), rules.minLength(2)]),
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
  // public messages: CustomMessages = {
  //   'name.required': 'Поле "Название объекта" является обязательным.',
  //   'name.minLength': 'Минимальная длинна поля "Название объекта" 2 символа.',
  //   'voltage_class.required': 'Поле "Класс объекта" является обязательным.',
  //   'voltage_class.minLength': 'Минимальная длинна поля "Класс объекта" 2 символа.',
  // }

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длинна поля 2 символа.',
  }
}