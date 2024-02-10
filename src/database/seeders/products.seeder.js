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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function seedProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var requiredIngredients, ingredients_1, products, _loop_1, index, newProduct, _i, products_1, productPayload, _a, _b, ingredient, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 9, 10, 12]);
                    requiredIngredients = ["beef", "cheese", "onion"];
                    return [4 /*yield*/, prisma.ingredient.findMany({
                            where: {
                                name: {
                                    in: requiredIngredients,
                                },
                            },
                        })];
                case 1:
                    ingredients_1 = _c.sent();
                    products = [];
                    _loop_1 = function (index) {
                        var burgerIngredients = requiredIngredients.map(function (ingredientName) {
                            var foundIngredient = ingredients_1.find(function (ing) { return ing.name === ingredientName; });
                            var amount;
                            switch (ingredientName) {
                                case "beef":
                                    amount = 150 * index;
                                    break;
                                case "cheese":
                                    amount = 30 * index;
                                    break;
                                case "onion":
                                    amount = 20 * index;
                                    break;
                                default:
                                    amount = 0;
                                    break;
                            }
                            return {
                                ingredient_id: (foundIngredient === null || foundIngredient === void 0 ? void 0 : foundIngredient.id) || 0,
                                amount: amount,
                                unit: "g",
                            };
                        });
                        products.push({
                            name: "burger".concat(index),
                            ingredients: burgerIngredients,
                        });
                    };
                    for (index = 1; index <= 2; index++) {
                        _loop_1(index);
                    }
                    newProduct = void 0;
                    _i = 0, products_1 = products;
                    _c.label = 2;
                case 2:
                    if (!(_i < products_1.length)) return [3 /*break*/, 8];
                    productPayload = products_1[_i];
                    return [4 /*yield*/, prisma.product.create({
                            data: { name: productPayload.name },
                        })];
                case 3:
                    // create the product
                    newProduct = _c.sent();
                    _a = 0, _b = productPayload.ingredients;
                    _c.label = 4;
                case 4:
                    if (!(_a < _b.length)) return [3 /*break*/, 7];
                    ingredient = _b[_a];
                    return [4 /*yield*/, prisma.productIngredient.create({
                            data: {
                                productId: newProduct.id,
                                amount: ingredient.amount,
                                unit: ingredient.unit,
                                ingredientId: ingredient.ingredient_id,
                            },
                        })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6:
                    _a++;
                    return [3 /*break*/, 4];
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8:
                    console.log("Products inserted successfully");
                    return [3 /*break*/, 12];
                case 9:
                    error_1 = _c.sent();
                    console.error("Error seeding Products data:", error_1);
                    return [3 /*break*/, 12];
                case 10: 
                // disconnect Prisma client after seeding
                return [4 /*yield*/, prisma.$disconnect()];
                case 11:
                    // disconnect Prisma client after seeding
                    _c.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.default = seedProducts;
seedProducts();
