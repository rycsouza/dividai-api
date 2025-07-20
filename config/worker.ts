import { Worker } from 'bullmq'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'

const connection = {
  host: env.get('REDIS_HOST'),
  port: Number(env.get('REDIS_PORT')),
  db: Number(env.get('REDIS_DATABASES', 0)),
}

new Worker(
  'emails',
  async (job) => {
    if (job.name === 'send_email') {
      const { mailMessage, config, mailerName } = job.data

      console.log('[WORKER] Processando job de e-mail')

      await mail.use(mailerName).sendCompiled(mailMessage, config)
    }
  },
  {
    connection,
  }
)
