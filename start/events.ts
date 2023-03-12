/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application boot.
*/

import Mail from '@ioc:Adonis/Addons/Mail'
import Event from '@ioc:Adonis/Core/Event'
import Defect from 'App/Models/Defect'
import IntermediateCheck from 'App/Models/IntermediateCheck'
import User from 'App/Models/User'

interface SendMailNewEntry {
  users: object[]
  templateMail: string
  subjectMail: string
  textMail: string
  defectId: number
  note: Defect | IntermediateCheck
}

const creatingNewEntryEmail = async ({
  users,
  templateMail,
  subjectMail,
  textMail,
  defectId,
  note,
}: SendMailNewEntry) => {
  users.forEach(async (user: User) => {
    await Mail.sendLater((message) => {
      message
        .from('defect-journal@examp.com')
        .to(user.email)
        .subject(subjectMail)
        .htmlView(templateMail, {
          user: { fullName: user.fullName },
          text: textMail,
          defectId,
          note,
        })
    })
  })
}

Event.on('send:mail-new-entry', creatingNewEntryEmail)
