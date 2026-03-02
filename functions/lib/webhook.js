"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = void 0;
const https_1 = require("firebase-functions/v2/https");
const config_js_1 = require("./config.js");
exports.stripeWebhook = (0, https_1.onRequest)({
    region: "us-central1",
    secrets: [config_js_1.stripeSecretKey, config_js_1.stripeWebhookSecret],
    // Disable body parsing — Stripe needs the raw body for signature verification
    invoker: "public",
}, async (req, res) => {
    // --- Only allow POST ---
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    // --- Verify Stripe signature ---
    const signature = req.headers["stripe-signature"];
    if (!signature) {
        res.status(400).send("Missing stripe-signature header.");
        return;
    }
    const stripe = (0, config_js_1.getStripe)();
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, signature, config_js_1.stripeWebhookSecret.value());
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Webhook signature verification failed:", message);
        res.status(400).send(`Webhook Error: ${message}`);
        return;
    }
    // --- Handle events ---
    switch (event.type) {
        case "checkout.session.completed": {
            await handleCheckoutCompleted(stripe, event.data.object);
            break;
        }
        default:
            // Acknowledge unhandled event types silently
            break;
    }
    // Always respond 200 to acknowledge receipt (prevents Stripe retries)
    res.status(200).json({ received: true });
});
async function handleCheckoutCompleted(stripe, session) {
    const orderId = session.id;
    const orderRef = config_js_1.db.collection("orders").doc(orderId);
    // --- Idempotent: skip if order already exists ---
    const existing = await orderRef.get();
    if (existing.exists) {
        console.log(`Order ${orderId} already exists, skipping.`);
        return;
    }
    // --- Expand line items for the order record ---
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
    });
    const order = {
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_details?.email ?? null,
        customerName: session.customer_details?.name ?? null,
        amountTotal: session.amount_total,
        currency: session.currency,
        shippingAddress: session.shipping_details?.address ?? null,
        items: lineItems.data.map((item) => ({
            priceId: item.price?.id ?? null,
            productId: item.price?.product ?? null,
            description: item.description,
            quantity: item.quantity,
            amountTotal: item.amount_total,
        })),
        metadata: session.metadata ?? {},
        status: "paid",
        fulfillmentStatus: "pending",
        createdAt: new Date().toISOString(),
    };
    await orderRef.set(order);
    console.log(`Order ${orderId} saved to Firestore.`);
}
//# sourceMappingURL=webhook.js.map