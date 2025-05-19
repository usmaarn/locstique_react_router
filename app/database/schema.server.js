"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsTable = exports.settingsTable = exports.feedbacksTable = exports.subscribersTable = exports.productOrderTable = exports.ordersTable = exports.cartsTable = exports.productsTable = exports.sessionsTable = exports.usersTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var enums_1 = require("~/lib/enums");
var helper_server_1 = require("~/lib/helper.server");
var uuid_1 = require("uuid");
exports.usersTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().$defaultFn(uuid_1.v7),
    name: (0, pg_core_1.varchar)("name").notNull(),
    email: (0, pg_core_1.varchar)("email").notNull().unique("users_email_idx"),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }).unique("users_phone_idx"),
    avatar: (0, pg_core_1.varchar)("avatar"),
    type: (0, pg_core_1.text)("type").notNull().default(enums_1.UserType.CUSTOMER),
    password: (0, pg_core_1.varchar)("password").notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt", { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(function () { return new Date(); }),
});
exports.sessionsTable = (0, pg_core_1.pgTable)("sessions", {
    id: (0, pg_core_1.varchar)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(function () { return exports.usersTable.id; }),
    expiresAt: (0, pg_core_1.timestamp)("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});
exports.productsTable = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.varchar)("id").primaryKey().$defaultFn(uuid_1.v7),
    name: (0, pg_core_1.varchar)("name").unique("product_name_idx").notNull(),
    details: (0, pg_core_1.text)("details").notNull().default(""),
    description: (0, pg_core_1.text)("description").notNull(),
    price: (0, pg_core_1.doublePrecision)("price").notNull(),
    discount: (0, pg_core_1.doublePrecision)("discount").notNull().default(0),
    images: (0, pg_core_1.json)("images").notNull().default([]),
    stock: (0, pg_core_1.integer)("stock").notNull().default(0),
    tag: (0, pg_core_1.varchar)("tag").default("🎁 BUY 1, GET 1 FREE HOLIDAY SALE 🎁"),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt", { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(function () { return new Date(); }),
});
exports.cartsTable = (0, pg_core_1.pgTable)("carts", {
    userId: (0, pg_core_1.varchar)("user_id")
        .references(function () { return exports.usersTable.id; })
        .notNull(),
    productId: (0, pg_core_1.varchar)("product_id")
        .references(function () { return exports.productsTable.id; })
        .notNull(),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, function (t) { return [(0, pg_core_1.primaryKey)({ name: "cart_id", columns: [t.productId, t.userId] })]; });
exports.ordersTable = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .$defaultFn(function () { return (0, helper_server_1.generateUnqueString)("TRN_"); }),
    userId: (0, pg_core_1.varchar)("user_id")
        .references(function () { return exports.usersTable.id; })
        .notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 10 }).default(enums_1.OrderStatus.PENDING_PAYMENT),
    transactionId: (0, pg_core_1.varchar)("transaction_id"),
    deliveryAddress: (0, pg_core_1.varchar)("delivery_address"),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt", { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(function () { return new Date(); }),
});
exports.productOrderTable = (0, pg_core_1.pgTable)("product_order", {
    orderId: (0, pg_core_1.varchar)("order_id")
        .references(function () { return exports.ordersTable.id; })
        .notNull(),
    productId: (0, pg_core_1.varchar)("product_id")
        .references(function () { return exports.productsTable.id; })
        .notNull(),
    price: (0, pg_core_1.doublePrecision)("price").notNull(),
    discount: (0, pg_core_1.doublePrecision)("discount").notNull().default(0),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, function (t) { return [
    (0, pg_core_1.primaryKey)({ name: "product_order_id", columns: [t.productId, t.orderId] }),
]; });
exports.subscribersTable = (0, pg_core_1.pgTable)("subscribers", {
    id: (0, pg_core_1.varchar)("id").primaryKey().$defaultFn(uuid_1.v7),
    email: (0, pg_core_1.varchar)("email").notNull().unique("subscribers_email_idx"),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
exports.feedbacksTable = (0, pg_core_1.pgTable)("feedbacks", {
    id: (0, pg_core_1.varchar)("id").primaryKey().$defaultFn(uuid_1.v7),
    name: (0, pg_core_1.varchar)("name"),
    email: (0, pg_core_1.varchar)("email"),
    phone: (0, pg_core_1.varchar)("phone"),
    comment: (0, pg_core_1.varchar)("comment").notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
exports.settingsTable = (0, pg_core_1.pgTable)("settings", {
    id: (0, pg_core_1.varchar)("id").primaryKey().$defaultFn(uuid_1.v7),
    name: (0, pg_core_1.varchar)("name").notNull().unique("settings_name_idx"),
    value: (0, pg_core_1.jsonb)("value"),
    comment: (0, pg_core_1.varchar)("comment"),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
exports.reviewsTable = (0, pg_core_1.pgTable)("reviews", {
    id: (0, pg_core_1.varchar)("id").primaryKey().$defaultFn(uuid_1.v7),
    user: (0, pg_core_1.varchar)("user").notNull(),
    image: (0, pg_core_1.varchar)("image"),
    title: (0, pg_core_1.varchar)("title").notNull(),
    comment: (0, pg_core_1.varchar)("comment"),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
