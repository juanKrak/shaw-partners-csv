"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const csvtojson_1 = __importDefault(require("csvtojson"));
const schema_1 = require("./db/schema");
const db_1 = require("./db");
const dotenv_1 = require("dotenv");
const drizzle_orm_1 = require("drizzle-orm");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
});
app.use((0, cors_1.default)());
app.post('/api/files', upload.array('files'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files || files.length === 0) {
        res.status(500);
        return res.json({
            message: 'Missing files!',
        });
    }
    if (!files.every((file) => file.mimetype === 'text/csv')) {
        res.status(500);
        return res.json({
            message: 'Invalid file type.',
        });
    }
    let rows = [];
    for (let file of files) {
        try {
            let jsonArray = yield (0, csvtojson_1.default)({ delimiter: ',' }).fromString(file.buffer.toString('utf8'));
            let parsedJson = schema_1.insertUsersSchema.parse(jsonArray);
            rows.push(...parsedJson);
        }
        catch (e) {
            res.status(500);
            return res.json({
                message: `Invalid or malformed CSV file: ${file.originalname}`,
            });
        }
    }
    try {
        let insertedUsers = yield db_1.db.insert(schema_1.users).values(rows).returning();
        res.status(200);
        return res.json({ message: 'The file was uploaded successfully.' });
    }
    catch (e) {
        res.status(500);
        return res.json({
            message: 'Error uploading to database. Try again later.',
        });
    }
}));
app.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let textSearch = `%${String((_a = req.query.q) !== null && _a !== void 0 ? _a : '').toLowerCase()}%`;
        let selectedUsers = yield db_1.db
            .select()
            .from(schema_1.users)
            .where(drizzle_orm_1.sql.join(Object.keys(schema_1.users).map(column => (0, drizzle_orm_1.sql) `LOWER(${schema_1.users[column]}) LIKE ${textSearch}`), (0, drizzle_orm_1.sql) ` OR `))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.users.created_at));
        return res.json({
            data: selectedUsers
        });
    }
    catch (e) {
        res.status(500);
        return res.json({
            message: 'Unable to select from the database. Try again later.',
        });
    }
}));
app.listen(process.env.PORT || 3000, () => {
    console.log(`Listenting on port ${process.env.PORT || 3000}.`);
});
//# sourceMappingURL=index.js.map