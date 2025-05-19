"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productOrderRelations = exports.orderRelations = exports.cartRelations = exports.productRelations = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var schema_server_1 = require("./schema.server");
exports.productRelations = (0, drizzle_orm_1.relations)(schema_server_1.productsTable, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        carts: many(schema_server_1.cartsTable),
        // reviews: many(reviewsTable),
    });
});
exports.cartRelations = (0, drizzle_orm_1.relations)(schema_server_1.cartsTable, function (_a) {
    var one = _a.one;
    return ({
        user: one(schema_server_1.usersTable, {
            fields: [schema_server_1.cartsTable.userId],
            references: [schema_server_1.usersTable.id],
        }),
        product: one(schema_server_1.productsTable, {
            fields: [schema_server_1.cartsTable.productId],
            references: [schema_server_1.productsTable.id],
        }),
    });
});
exports.orderRelations = (0, drizzle_orm_1.relations)(schema_server_1.ordersTable, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        user: one(schema_server_1.usersTable, {
            fields: [schema_server_1.ordersTable.userId],
            references: [schema_server_1.usersTable.id],
        }),
        items: many(schema_server_1.productOrderTable),
    });
});
exports.productOrderRelations = (0, drizzle_orm_1.relations)(schema_server_1.productOrderTable, function (_a) {
    var one = _a.one;
    return ({
        order: one(schema_server_1.ordersTable, {
            fields: [schema_server_1.productOrderTable.orderId],
            references: [schema_server_1.ordersTable.id],
        }),
        product: one(schema_server_1.productsTable, {
            fields: [schema_server_1.productOrderTable.productId],
            references: [schema_server_1.productsTable.id],
        }),
    });
});
