"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePriceId = validatePriceId;
exports.validateQuantity = validateQuantity;
const https_1 = require("firebase-functions/v2/https");
const config_js_1 = require("../config.js");
const PRICE_ID_REGEX = /^price_[A-Za-z0-9]{8,}$/;
function validatePriceId(priceId) {
    if (typeof priceId !== "string" || !PRICE_ID_REGEX.test(priceId)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid price ID format.");
    }
    return priceId;
}
function validateQuantity(quantity) {
    const qty = typeof quantity === "number" ? quantity : 1;
    if (!Number.isInteger(qty) || qty < 1 || qty > config_js_1.MAX_QUANTITY) {
        throw new https_1.HttpsError("invalid-argument", `Quantity must be an integer between 1 and ${config_js_1.MAX_QUANTITY}.`);
    }
    return qty;
}
//# sourceMappingURL=validate.js.map