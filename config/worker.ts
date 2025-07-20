import mail from '@adonisjs/mail/services/main'
import { Worker } from 'bullmq'

new Worker('emails', async (job) => {
  if (job.name === 'send_email') {
    const { mailMessage, config, mailerName } = job.data

    await mail.use(mailerName).sendCompiled(mailMessage, config)
  }
})
