import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import { booleanCheckOptional, text110 } from './fields'

export default class DistrictValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: text110,
    addNext: booleanCheckOptional,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длинна поля {{ options.maxLength }} символов',
  }
}
