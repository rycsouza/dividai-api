import mail from '@adonisjs/mail/services/main'
import { Queue } from 'bullmq'

const emailsQueue = new Queue('emails')

mail.setMessenger((mailer) => {
  return {
    async queue(mailMessage, config) {
      await emailsQueue.add('send_email', {
        mailMessage,
        config,
        mailerName: mailer.name,
      })
    },
  }
})
