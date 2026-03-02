"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = void 0;
const https_1 = require("firebase-functions/v2/https");
const config_js_1 = require("./config.js");
const validate_js_1 = require("./utils/validate.js");
const rateLimit_js_1 = require("./utils/rateLimit.js");
const node_crypto_1 = __importDefault(require("node:crypto"));
exports.createCheckoutSession = (0, https_1.onCall)({
    // Gen 2 options
    region: "us-central1",
    cors: [config_js_1.ALLOWED_ORIGIN],
    enforceAppCheck: true,
    secrets: [config_js_1.stripeSecretKey],
}, async (request) => {
    // --- Extract caller context for auditing ---
    const ip = request.rawRequest.ip ?? "unknown";
    const userAgent = request.rawRequest.headers["user-agent"] ?? "unknown";
    // --- Rate limiting ---
    await (0, rateLimit_js_1.enforceRateLimit)(ip);
    // --- Input validation ---
    const { priceId: rawPriceId, quantity: rawQuantity } = request.data;
    const priceId = (0, validate_js_1.validatePriceId)(rawPriceId);
    const quantity = (0, validate_js_1.validateQuantity)(rawQuantity);
    // --- Create Stripe Checkout Session ---
    const stripe = (0, config_js_1.getStripe)();
    // Idempotency key: prevents duplicate sessions from retries
    const idempotencyKey = node_crypto_1.default
        .createHash("sha256")
        .update(`${ip}-${priceId}-${quantity}-${Math.floor(Date.now() / 10_000)}`)
        .digest("hex");
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity,
                },
            ],
            success_url: config_js_1.SUCCESS_URL,
            cancel_url: config_js_1.CANCEL_URL,
            // Fraud & audit metadata
            metadata: {
                source: "web",
                ip,
                userAgent: userAgent.slice(0, 500), // Truncate to avoid hitting Stripe metadata limits
                createdAt: new Date().toISOString(),
            },
            // Collect shipping address for physical goods
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "GB", "AU", "IN"],
            },
            // Let Stripe collect customer email
            customer_creation: "if_required",
        }, {
            idempotencyKey,
        });
        if (!session.url) {
            throw new https_1.HttpsError("internal", "Failed to create checkout session.");
        }
        return {
            sessionId: session.id,
            url: session.url,
        };
    }
    catch (error) {
        // Re-throw HttpsErrors (from validation/rate-limiting) as-is
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        // Log Stripe errors server-side, return generic message to client
        console.error("Stripe checkout error:", error);
        throw new https_1.HttpsError("internal", "Unable to create checkout session. Please try again.");
    }
});
//# sourceMappingURL=checkout.js.map