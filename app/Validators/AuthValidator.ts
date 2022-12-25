import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthValidator {
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
    username: schema.string([
      rules.minLength(2),
      rules.unique({ table: 'users', column: 'username' }),
      rules.trim(),
      rules.escape(),
    ]),
    surname: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
    name: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
    patronymic: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
    position: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
    email: schema.string([
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
      rules.trim(),
      rules.escape(),
    ]),
    password: schema.string([rules.minLength(8)]),
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
    'required': 'Поле является обязательным.',
    'minLength': 'Минимальная длинна поля 2 символа.',
    'password.minLength': 'Минимальная длина пароля 8 символов!',
    'unique': 'Введенное значение должно быть уникальным!',
  }
}
