"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_QUANTITY = exports.RATE_LIMIT_MAX_REQUESTS = exports.RATE_LIMIT_WINDOW_MS = exports.CANCEL_URL = exports.SUCCESS_URL = exports.ALLOWED_ORIGIN = exports.stripeWebhookSecret = exports.stripeSecretKey = exports.db = void 0;
exports.getStripe = getStripe;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const params_1 = require("firebase-functions/params");
const stripe_1 = __importDefault(require("stripe"));
// Firebase Admin — singleton init
if ((0, app_1.getApps)().length === 0) {
    (0, app_1.initializeApp)();
}
exports.db = (0, firestore_1.getFirestore)();
// Secrets managed via `firebase functions:secrets:set`
exports.stripeSecretKey = (0, params_1.defineSecret)("STRIPE_SECRET_KEY");
exports.stripeWebhookSecret = (0, params_1.defineSecret)("STRIPE_WEBHOOK_SECRET");
/**
 * Returns a Stripe client bound to the current secret value.
 * Must be called inside a function handler (after secrets are resolved).
 */
function getStripe() {
    return new stripe_1.default(exports.stripeSecretKey.value(), {
        apiVersion: "2025-02-24.acacia",
        typescript: true,
    });
}
// Server-defined URLs — never accept these from the client
exports.ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://ashujainvi.com";
exports.SUCCESS_URL = `${exports.ALLOWED_ORIGIN}/order/success?session_id={CHECKOUT_SESSION_ID}`;
exports.CANCEL_URL = `${exports.ALLOWED_ORIGIN}/shop`;
// Rate limit config
exports.RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
exports.RATE_LIMIT_MAX_REQUESTS = 10;
exports.MAX_QUANTITY = 10;
//# sourceMappingURL=config.js.map