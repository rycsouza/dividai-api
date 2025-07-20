import env from '#start/env'
import { defineConfig } from '@adonisjs/redis'

export default defineConfig({
  connection: 'main',
  connections: {
    main: {
      host: env.get('REDIS_HOST'),
      port: env.get('REDIS_PORT'),
      password: env.get('REDIS_PASSWORD', ''),
      db: env.get('REDIS_DATABASES', 0),
      keyPrefix: '',
    },
  },
})
