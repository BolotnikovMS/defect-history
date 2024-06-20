import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import { booleanCheckOptional, text700, img, numberCheck } from './fields'

export default class DefectValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    defect_type: numberCheck,
    substation: numberCheck,
    accession: numberCheck,
    description_defect: text700,
    defect_img: img,
    importance: booleanCheckOptional,
  })

  public messages: CustomMessages = {
    'required': 'Поле является обязательным.',
    'minLength': 'Минимальная длина поля {{ options.minLength }} символа.',
    'maxLength': 'Максимальная длина поля {{ options.maxLength }} символов',
    'file.size': 'Размер файла должен быть меньше {{ options.size }}.',
    'file.extname': 'Файл должен иметь одно из следующих расширений {{ options.extnames }}.',
  }
}
