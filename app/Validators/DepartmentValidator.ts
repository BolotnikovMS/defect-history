import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import { booleanCheckOptional, text100 } from './fields'

export default class DepartmentValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: text100,
    addNext: booleanCheckOptional,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длинна поля {{ options.maxLength }} символов',
  }
}
