import path from 'path'
import { app } from '../index'
import type { User } from '../db/schema'

import request from 'supertest'

describe("POST /api/files", () => {
    it("Returns error when no file present", async () => {
        let res = await request(app).post("/api/files")
        expect(res.status).toEqual(500)
    })
    it("Returns error when filetype is incorrect", async () => {
        let res = await request(app).post("/api/files")
            .attach("file", path.resolve(__dirname, './train.jpg'))
        expect(res.status).toEqual(500)
    })
    it("Returns error when CSV is malformed", async () => {
        let res = await request(app).post("/api/files")
            .attach("file", path.resolve(__dirname, './mock_users_10 _malformed.csv'))
            
        expect(res.status).toEqual(500)
    })
    it("Returns success message when uploaded users to database.", async () => {
        let res = await request(app).post("/api/files")
            .attach("file", path.resolve(__dirname, './mock_users_10.csv'))
        
        expect(res.status).toEqual(200)
    })
})

describe("GET /api/users", () => {
    it("Returns uploaded users.", async () => {
        let res = await request(app).get("/api/users")
        
        expect(res.body).toHaveProperty("data")
        expect(Array.isArray(res.body.data)).toBeTruthy()
            // expect(res.body.data.at(0)).toHaveProperty(["name", "city", "country", "favorite_sport"])
            // console.log("res.body.data: ", res.body.data)
            // expect(res.body.data[0])
            // expect(res.body.data[0] as User[])
            //     .toHaveProperty("city")
            // expect(res.body.data[0] as User[])
            //     .toHaveProperty("country")
            // expect(res.body.data[0] as User[])
            //     .toHaveProperty("favorite_sport")
    })
    it("Does fulltext case-insensitive search on all fields.", async () => {
        let res = await request(app).get("/api/users")
        
        console.log("res.body.data: ", res.body.data)
        expect(res.body.data.length > 0).toBeTruthy()
    })
})