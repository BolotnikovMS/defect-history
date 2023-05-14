import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DefectValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */

  public schema = schema.create({
    defect_type: schema.number(),
    substation: schema.number(),
    accession: schema.number(),
    description_defect: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(2)]),
    defect_img: schema.array
      .optional()
      .members(schema.file({ size: '1mb', extnames: ['jpg', 'png', 'jpeg'] })),
    importance: schema.boolean.optional(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'required': 'Поле является обязательным.',
    'minLength': 'Минимальная длина поля {{ options.minLength }} символа.',
    'file.size': 'Размер файла должен быть меньше {{ options.size }}.',
    'file.extname': 'Файл должен иметь одно из следующих расширений {{ options.extnames }}.',
  }
}
