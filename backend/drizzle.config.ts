import 'dotenv/config'

import type { Config } from 'drizzle-kit'

export default {
    schema: './src/db/schema.ts',
    out: './drizzle',
    driver: 'turso',
    dbCredentials:  {
        url: process.env.DATABASE_URL ?? 'file:./sqlite.db',
        authToken: process.env.DATABASE_AUTH_TOKEN
    },
} satisfies Config
