import { config } from 'dotenv'
import { z } from 'zod'

config()

const envShema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']).default('sqlite'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})
const _env = envShema.safeParse(process.env)

if (_env.success === false) {
  console.error('⚠️ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variable')
}

export const env = _env.data
