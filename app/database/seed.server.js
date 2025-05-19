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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
var enums_1 = require("~/lib/enums");
var client_server_1 = require("./client.server");
var schema_server_1 = require("./schema.server");
var faker_1 = require("@faker-js/faker");
var argon2_1 = require("argon2");
function populateUsers(tx) {
    return __awaiter(this, void 0, void 0, function () {
        var i, _a, _b, _c, _d;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    i = 0;
                    _g.label = 1;
                case 1:
                    if (!(i <= 10)) return [3 /*break*/, 5];
                    _b = (_a = tx.insert(schema_server_1.usersTable)).values;
                    _e = {
                        name: faker_1.faker.person.fullName(),
                        email: faker_1.faker.internet.email()
                    };
                    return [4 /*yield*/, (0, argon2_1.hash)("pass1234")];
                case 2: return [4 /*yield*/, _b.apply(_a, [(_e.password = _g.sent(),
                            _e.type = enums_1.UserType.CUSTOMER,
                            _e.phone = faker_1.faker.phone.number({ style: "international" }),
                            _e)])];
                case 3:
                    _g.sent();
                    _g.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    _d = (_c = tx.insert(schema_server_1.usersTable)).values;
                    _f = {
                        name: faker_1.faker.person.fullName(),
                        email: "admin@test.com"
                    };
                    return [4 /*yield*/, (0, argon2_1.hash)("pass1234")];
                case 6: return [4 /*yield*/, _d.apply(_c, [(_f.password = _g.sent(),
                            _f.type = enums_1.UserType.ADMIN,
                            _f.phone = faker_1.faker.phone.number({ style: "international" }),
                            _f)])];
                case 7:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function populateProducts(tx) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, _i, data_1, record;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://fakestoreapi.com/products")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_a.sent());
                    if (!data) return [3 /*break*/, 6];
                    _i = 0, data_1 = data;
                    _a.label = 3;
                case 3:
                    if (!(_i < data_1.length)) return [3 /*break*/, 6];
                    record = data_1[_i];
                    return [4 /*yield*/, tx.insert(schema_server_1.productsTable).values({
                            name: record.title,
                            images: [record.image],
                            price: record.price,
                            description: record.description,
                            discount: Math.ceil(Math.random() * 40),
                            stock: Math.floor(Math.random() * 1000),
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function populateOrders(tx) {
    return __awaiter(this, void 0, void 0, function () {
        var users, _i, users_1, user, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tx.query.usersTable.findMany()];
                case 1:
                    users = _a.sent();
                    _i = 0, users_1 = users;
                    _a.label = 2;
                case 2:
                    if (!(_i < users_1.length)) return [3 /*break*/, 7];
                    user = users_1[_i];
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < faker_1.faker.number.int({ min: 8, max: 20 }))) return [3 /*break*/, 6];
                    return [4 /*yield*/, tx.insert(schema_server_1.ordersTable).values({
                            userId: user.id,
                            transactionId: faker_1.faker.number.int().toString(),
                            deliveryAddress: "".concat(faker_1.faker.location.streetAddress(), ", ").concat(faker_1.faker.location.city(), " ").concat(faker_1.faker.location.state(), ", ").concat(faker_1.faker.location.country()),
                            status: faker_1.faker.number.int({ min: 5, max: 15, multipleOf: 5 }).toString(),
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function populateProductOrder() {
    return __awaiter(this, void 0, void 0, function () {
        var orders, products, _i, orders_1, order, i, product, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client_server_1.db.query.ordersTable.findMany()];
                case 1:
                    orders = _a.sent();
                    return [4 /*yield*/, client_server_1.db.query.productsTable.findMany()];
                case 2:
                    products = _a.sent();
                    _i = 0, orders_1 = orders;
                    _a.label = 3;
                case 3:
                    if (!(_i < orders_1.length)) return [3 /*break*/, 10];
                    order = orders_1[_i];
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < 10)) return [3 /*break*/, 9];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    product = products[faker_1.faker.number.int({ max: products.length - 1 })];
                    return [4 /*yield*/, client_server_1.db.insert(schema_server_1.productOrderTable).values({
                            orderId: order.id,
                            productId: product.id,
                            quantity: faker_1.faker.number.int({ max: 5 }),
                            price: product.price,
                        })];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 8];
                case 8:
                    i++;
                    return [3 /*break*/, 4];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, client_server_1.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, populateProducts(tx)];
                                    case 1:
                                        _a.sent();
                                        console.log("Products Populated");
                                        return [4 /*yield*/, populateUsers(tx)];
                                    case 2:
                                        _a.sent();
                                        console.log("Users Populated");
                                        return [4 /*yield*/, populateOrders(tx)];
                                    case 3:
                                        _a.sent();
                                        console.log("Orders Populated");
                                        console.log("seeding completed!");
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, populateProductOrder()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
await seed();
process.exit(0);
