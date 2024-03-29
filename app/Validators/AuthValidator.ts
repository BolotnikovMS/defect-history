import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(20),
      rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      rules.escape(),
    ]),
    surname: schema.string([rules.minLength(2), rules.maxLength(20), rules.trim(), rules.escape()]),
    name: schema.string([rules.minLength(2), rules.maxLength(20), rules.trim(), rules.escape()]),
    patronymic: schema.string([
      rules.minLength(2),
      rules.maxLength(20),
      rules.trim(),
      rules.escape(),
    ]),
    position: schema.string([
      rules.minLength(2),
      rules.maxLength(40),
      rules.trim(),
      rules.escape(),
    ]),
    department: schema.number(),
    role: schema.number(),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      rules.escape(),
    ]),
    password: schema.string({}, [rules.minLength(8)]),
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длинна поля {{ options.maxLength }} символов',
    unique: 'Введенное значение должно быть уникальным!',
  }
}
