import { onCall, HttpsError } from "firebase-functions/v2/https";
import {
  getStripe,
  stripeSecretKey,
  SUCCESS_URL,
  CANCEL_URL,
  ALLOWED_ORIGIN,
} from "./config.js";
import { validatePriceId, validateQuantity } from "./utils/validate.js";
import { enforceRateLimit } from "./utils/rateLimit.js";
import crypto from "node:crypto";

interface CheckoutRequest {
  priceId: string;
  quantity?: number;
}

interface CheckoutResponse {
  sessionId: string;
  url: string;
}

export const createCheckoutSession = onCall<CheckoutRequest, Promise<CheckoutResponse>>(
  {
    // Gen 2 options
    region: "us-central1",
    cors: [ALLOWED_ORIGIN],
    enforceAppCheck: true,
    secrets: [stripeSecretKey],
  },
  async (request) => {
    // --- Extract caller context for auditing ---
    const ip = request.rawRequest.ip ?? "unknown";
    const userAgent = request.rawRequest.headers["user-agent"] ?? "unknown";

    // --- Rate limiting ---
    await enforceRateLimit(ip);

    // --- Input validation ---
    const { priceId: rawPriceId, quantity: rawQuantity } = request.data;
    const priceId = validatePriceId(rawPriceId);
    const quantity = validateQuantity(rawQuantity);

    // --- Create Stripe Checkout Session ---
    const stripe = getStripe();

    // Idempotency key: prevents duplicate sessions from retries
    const idempotencyKey = crypto
      .createHash("sha256")
      .update(`${ip}-${priceId}-${quantity}-${Math.floor(Date.now() / 10_000)}`)
      .digest("hex");

    try {
      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              price: priceId,
              quantity,
            },
          ],
          success_url: SUCCESS_URL,
          cancel_url: CANCEL_URL,
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
        },
        {
          idempotencyKey,
        }
      );

      if (!session.url) {
        throw new HttpsError("internal", "Failed to create checkout session.");
      }

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      // Re-throw HttpsErrors (from validation/rate-limiting) as-is
      if (error instanceof HttpsError) {
        throw error;
      }

      // Log Stripe errors server-side, return generic message to client
      console.error("Stripe checkout error:", error);
      throw new HttpsError(
        "internal",
        "Unable to create checkout session. Please try again."
      );
    }
  }
);
