import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { email, text40, text20, numberCheck, password, username } from './fields'

export default class AuthValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    username: username,
    surname: text20,
    name: text20,
    patronymic: text20,
    position: text40,
    department: numberCheck,
    role: numberCheck,
    email: email,
    password: password,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длинна поля {{ options.maxLength }} символов',
    unique: 'Введенное значение должно быть уникальным!',
  }
}
