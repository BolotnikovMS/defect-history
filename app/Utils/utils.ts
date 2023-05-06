import { DateTime } from 'luxon'

export const checkObjectProperty = (obj: object, prop: string): boolean => obj.hasOwnProperty(prop) && obj[prop] !== '' && obj[prop] !== null && obj[prop] !== undefined

export const checkObjectEmpty = (obj: object): boolean => Object.entries(obj).length === 0 && obj.constructor === Object

export const replacementEscapeSymbols = (text: string) => {
  const replSymbol: string[] = ["'", '"', '/', '<', '>']
  const escapeSymbols: string[] = ['&#x27;', '&quot;', '&#x2F;', '&lt;', '&gt;']

  escapeSymbols.forEach(
    (symb: string, i: number): string => (text = text.replace(new RegExp(symb, 'g'), replSymbol[i]))
  )

  return text
}

export const addDays = (days: number) => DateTime.now().plus({ day: days })

export const randomStr = () => Math.random().toString(36).slice(2, 7)

/**
 *  userPermissionCheck - Возвращает true/false в зависимости от наличия доступа у пользователя.
 *
 * @param {string} permission Проверяемый доступ пользователя.
 * @param {object[]} userPermissionsArray Массив доступов пользователя.
 * @return {boolean} true/false
 */

interface Permission {
  id: number
  access: string
  description: string
}

export const userPermissionCheck = (
  permission: string,
  userPermissionsArray: object[]
): boolean => {
  if (!userPermissionsArray.length) return false

  return userPermissionsArray.find((elem: Permission) => elem.access === permission) ? true : false
}
