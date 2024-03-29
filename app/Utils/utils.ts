import { DateTime } from 'luxon'

/**
 * Возвращает логическое значение после проверки объекта на наличие необходимого свойства.
 * @param {object} checkedObject
 * @param {string} checkedProperty
 * @returns {boolean}
 */
export const checkObjectProperty = (checkedObject: object, checkedProperty: string): boolean =>
  checkedObject.hasOwnProperty(checkedProperty) &&
  checkedObject[checkedProperty] !== '' &&
  checkedObject[checkedProperty] !== null &&
  checkedObject[checkedProperty] !== undefined

/**
 * Возвращает логическое значение после проверки объекта.
 * @param {object} checkedObject Проверяемый объект.
 * @returns {boolean} true/false
 */
export const checkObjectEmpty = (checkedObject: object): boolean =>
  Object.entries(checkedObject).length === 0 && checkedObject.constructor === Object

/**
 * Возвращает принимаемый текст после замены экранированных символов.
 * @param {string} text Текст, где есть экранированные символы.
 * @returns {string} Текст после замены.
 */
export const replacementEscapeSymbols = (text: string | null): string | null => {
  if (text === null) return null

  const replSymbol: string[] = ["'", '"', '/', '<', '>']
  const escapeSymbols: string[] = ['&#x27;', '&quot;', '&#x2F;', '&lt;', '&gt;']

  escapeSymbols.forEach((symb: string, i: number): string | null => {
    if (text === null) return null

    return (text = text.replace(new RegExp(symb, 'g'), replSymbol[i]))
  })

  return text
}

/**
 * Возвращает новую дату, путем прибавления к текущей дате days.
 * @param {number} days Дни которые надо добавить к текущей дате.
 * @returns {DateTime} Новая дата.
 */
export const addDays = (days: number): DateTime => DateTime.now().plus({ day: days })

/**
 * Возвращает рандомную строку из 5 символов.
 * @returns {string} Random string.
 */
export const randomStr = (): string => Math.random().toString(36).slice(2, 7)

interface Permission {
  id: number
  access: string
  description: string
}

/**
 *  Возвращает true/false в зависимости от наличия доступа у пользователя.
 *
 * @param {string} permission Проверяемый доступ пользователя.
 * @param {object[]} userPermissionsArray Массив доступов пользователя.
 * @return {boolean} true/false
 */
export const userPermissionCheck = (
  permission: string,
  userPermissionsArray: object[]
): boolean => {
  if (!userPermissionsArray.length) return false

  return userPermissionsArray.find((elem: Permission) => elem.access === permission) ? true : false
}

export const fileStreamValidation = (file, validationRules) => {
  const validationErrors: string[] = []
  console.log(file)

  if (!RegExp(/^[0-9a-zA-Z_\-.]+$/).test(file._clientName)) {
    validationErrors.push(
      `${file._clientName}'s name should only contain alphanumeric, underscore, dot, hypen`
    )
  }

  if (validationRules.extnames && validationRules.extnames.length) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const [_, fileExtension] = file._clientName.split(/\.(?=[^.]+$)/)
    if (!validationRules.extnames.includes(fileExtension)) {
      validationErrors.push(`${file._clientName}'s extension is not acceptable`)
    }
  }

  if (validationRules.maxFileSizeInMb) {
    if (file.stream.byteCount > validationRules.maxFileSizeInMb * 1000000) {
      validationErrors.push(`${file._clientName}'s size exceeded limit`)
    }
  }
  return validationErrors
}
