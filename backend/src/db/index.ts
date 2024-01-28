import { drizzle as drizzleBetterSqlite3 } from 'drizzle-orm/better-sqlite3'
import { migrate as migrateBetterSqlite3 } from 'drizzle-orm/better-sqlite3/migrator'
import { drizzle as drizzleTurso } from 'drizzle-orm/libsql'

import Database from 'better-sqlite3'
import { createClient } from '@libsql/client'

import { config } from 'dotenv'
config()

let url = process.env.DATABASE_URL
let authToken = process.env.DATABASE_AUTH_TOKEN
if (!url || !authToken) console.log("Missing URL or AUTHTOKEN")

const client = createClient({ url: url ?? "file:sqlite.db", authToken })
export const db = drizzleTurso(client)
