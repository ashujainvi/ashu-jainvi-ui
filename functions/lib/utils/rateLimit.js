"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceRateLimit = enforceRateLimit;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const config_js_1 = require("../config.js");
const rateLimitsCollection = config_js_1.db.collection("rateLimits");
/**
 * Firestore-based sliding-window rate limiter.
 * Tracks request timestamps per IP and rejects if over limit.
 */
async function enforceRateLimit(ip) {
    // Sanitize IP for use as document ID (replace dots/colons)
    const docId = ip.replace(/[.:]/g, "_");
    const docRef = rateLimitsCollection.doc(docId);
    const now = Date.now();
    const windowStart = now - config_js_1.RATE_LIMIT_WINDOW_MS;
    await config_js_1.db.runTransaction(async (tx) => {
        const doc = await tx.get(docRef);
        const data = doc.data();
        // Filter timestamps within the current window
        const timestamps = (data?.timestamps ?? []).filter((ts) => ts > windowStart);
        if (timestamps.length >= config_js_1.RATE_LIMIT_MAX_REQUESTS) {
            throw new https_1.HttpsError("resource-exhausted", "Too many requests. Please try again later.");
        }
        tx.set(docRef, {
            timestamps: [...timestamps, now],
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
    });
}
//# sourceMappingURL=rateLimit.js.map