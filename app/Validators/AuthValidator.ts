import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string([
      rules.minLength(2),
      rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      rules.trim(),
      rules.escape(),
    ]),
    surname: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
    name: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
    patronymic: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
    position: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
    department: schema.number(),
    role: schema.number(),
    email: schema.string([
      rules.email(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
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
    'minLength': 'Минимальная длина поля 2 символа.',
    'password.minLength': 'Минимальная длина пароля 8 символов!',
    'unique': 'Введенное значение должно быть уникальным!',
  }
}
