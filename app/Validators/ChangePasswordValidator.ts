import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChangePasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string([rules.confirmed(), rules.minLength(8)]),
  })

  public messages: CustomMessages = {
    'required': 'Поле является обязательным.',
    'password.minLength': 'Минимальная длина пароля 8 символов!',
    'password_confirmation.confirmed': 'Пароли не совпадают!!',
  }
}
