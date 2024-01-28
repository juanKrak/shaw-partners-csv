import 'dotenv/config'

import type { Config } from 'drizzle-kit'

export default {
    schema: './src/db/schema.ts',
    out: './drizzle',
    driver: Boolean(process.env.PROD) ? 'better-sqlite' : 'turso',
    dbCredentials: Boolean(process.env.PROD) ? {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    } : {
        url: 'file:./sqlite.db'
    },
} satisfies Config
