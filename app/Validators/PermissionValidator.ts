import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import { text250 } from './fields'

export default class PermissionValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    access: text250,
    description: text250,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ options.maxLength }} символов.',
  }
}
