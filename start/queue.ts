import { Queue } from 'bullmq'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'

const connection = {
  host: env.get('REDIS_HOST'),
  port: Number(env.get('REDIS_PORT')),
  db: Number(env.get('REDIS_DATABASES', 0)),
}

const emailsQueue = new Queue('emails', { connection })

mail.setMessenger((mailer) => {
  return {
    async queue(mailMessage, config) {
      console.log(`Email entrou na fila: `, {
        to: mailMessage.message.to,
        subject: mailMessage.message.subject,
      })

      await emailsQueue.add('send_email', {
        mailMessage,
        config,
        mailerName: mailer.name,
      })
    },
  }
})
