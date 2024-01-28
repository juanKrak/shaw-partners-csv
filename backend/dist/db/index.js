"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const libsql_1 = require("drizzle-orm/libsql");
const client_1 = require("@libsql/client");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let url = process.env.DATABASE_URL;
let authToken = process.env.DATABASE_AUTH_TOKEN;
if (!url || !authToken)
    console.error("Missing URL or AUTHTOKEN");
const client = (0, client_1.createClient)({ url: url !== null && url !== void 0 ? url : "file:sqlite.db", authToken });
exports.db = (0, libsql_1.drizzle)(client);
//# sourceMappingURL=index.js.map