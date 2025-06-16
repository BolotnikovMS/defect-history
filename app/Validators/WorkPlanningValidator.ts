import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import { text700 } from './fields'

export default class WorkPlanningValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    comment: text700,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
  }
}
