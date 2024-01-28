"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUsersSchema = exports.insertUserSchema = exports.users = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
exports.users = (0, sqlite_core_1.sqliteTable)('users', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    city: (0, sqlite_core_1.text)('city').notNull(),
    country: (0, sqlite_core_1.text)('country').notNull(),
    favorite_sport: (0, sqlite_core_1.text)('favorite_sport').notNull(),
    created_at: (0, sqlite_core_1.text)('created_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`)
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users);
exports.insertUsersSchema = zod_1.z.array(exports.insertUserSchema);
//# sourceMappingURL=schema.js.map