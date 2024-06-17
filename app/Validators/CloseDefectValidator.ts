import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CloseDefectValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    employee: schema.string(),
    description_results: schema.string({}, [
      rules.trim(),
      rules.minLength(2),
      rules.maxLength(700),
      rules.escape(),
    ]),
    defect_img: schema.array
      .optional()
      .members(schema.file({ size: '1mb', extnames: ['jpg', 'png', 'jpeg'] })),
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ options.maxLength }} символов',
  }
}
