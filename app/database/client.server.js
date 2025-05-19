"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require("dotenv/config");
var postgres_js_1 = require("drizzle-orm/postgres-js");
var schema = require("./schema.server");
var relations = require("./relations.server");
var postgres_1 = require("postgres");
var client = (0, postgres_1.default)(process.env.DATABASE_URL);
exports.db = (0, postgres_js_1.drizzle)(client, {
    schema: __assign(__assign({}, schema), relations),
});
