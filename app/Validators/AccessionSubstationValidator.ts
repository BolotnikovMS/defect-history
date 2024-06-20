import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { booleanCheckOptional, text250 } from './fields'

export default class AccessionSubstationValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: text250,
    importance: booleanCheckOptional,
    addNext: booleanCheckOptional,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ options.maxLength }} символов.',
  }
}
