import express, { Request, Response } from 'express'
import cors from 'cors'
import multer from 'multer'
import csvtojson from 'csvtojson'
import { users, insertUsersSchema, InsertUser } from './db/schema'
import { db } from './db'
import { config } from 'dotenv'
import { asc, desc, sql } from 'drizzle-orm'
config()

const app = express()

const upload = multer({
    storage: multer.memoryStorage(),
})

app.use(cors())

app.post('/api/files', upload.array('files'), async (req, res) => {
    const files = req.files as Express.Multer.File[]
    if (!files || files.length === 0) {
        res.status(500)
        return res.json({
            message: 'Missing files!',
        })
    }
    if (!files.every((file) => file.mimetype === 'text/csv')) {
        res.status(500)
        return res.json({
            message: 'Invalid file type.',
        })
    }

    let rows: InsertUser[] = []

    for (let file of files) {
        try {
            let jsonArray = await csvtojson({ delimiter: ',' }).fromString(
                file.buffer.toString('utf8')
            )
            let parsedJson = insertUsersSchema.parse(jsonArray)
            rows.push(...parsedJson)
        } catch (e) {
            res.status(500)
            return res.json({
                message: `Invalid or malformed CSV file: ${file.originalname}`,
            })
        }
    }
    try {
        let insertedUsers = await db.insert(users).values(rows).returning()
        res.status(200)
        return res.json({ message: 'The file was uploaded successfully.' })
    } catch (e) {
        res.status(500)
        return res.json({
            message: 'Error uploading to database. Try again later.',
        })
    }
})
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        let textSearch = `%${String(req.query.q ?? '').toLowerCase()}%`
        
        
        let selectedUsers = await db
            .select()
            .from(users)
            .where(sql.join(Object.keys(users).map(column => sql`LOWER(${users[column as keyof typeof users]}) LIKE ${textSearch}`), sql` OR `))
            .orderBy(desc(users.created_at))

        return res.json({
            data: selectedUsers
        })
    } catch (e) {
        res.status(500)
        return res.json({
            message: 'Unable to select from the database. Try again later.',
        })
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Listenting on port ${process.env.PORT || 3000}.`)
})
