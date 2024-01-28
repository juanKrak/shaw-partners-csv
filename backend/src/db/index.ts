import { drizzle as drizzleBetterSqlite3 } from 'drizzle-orm/better-sqlite3'
import { migrate as migrateBetterSqlite3 } from 'drizzle-orm/better-sqlite3/migrator'
import { drizzle as drizzleTurso } from 'drizzle-orm/libsql'

import Database from 'better-sqlite3'
import { createClient } from '@libsql/client'

import { config } from 'dotenv'
config()


function chooseDb(prod: boolean) {
    if (prod) {
        let url = process.env.DATABASE_URL
        let authToken = process.env.DATABASE_AUTH_TOKEN
        if (!url || !authToken) throw new Error("Missing env files.")
        
        const client = createClient({url, authToken})
        const db = drizzleTurso(client)
        return db        
    } else {
        const database = new Database('sqlite.db')
        const db = drizzleBetterSqlite3(database)

        console.log("Setting up sqlite.db file.")

        return db
    }
}

export const db = chooseDb(Boolean(process.env.PROD ?? false))