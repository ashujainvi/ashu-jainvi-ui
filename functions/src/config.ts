import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import Stripe from "stripe";

// Firebase Admin — singleton init
if (getApps().length === 0) {
  initializeApp();
}

export const db = getFirestore();

// Secrets managed via `firebase functions:secrets:set`
export const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
export const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

/**
 * Returns a Stripe client bound to the current secret value.
 * Must be called inside a function handler (after secrets are resolved).
 */
export function getStripe(): Stripe {
  return new Stripe(stripeSecretKey.value(), {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });
}

// Server-defined URLs — never accept these from the client
export const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://ashujainvi.com";
export const SUCCESS_URL = `${ALLOWED_ORIGIN}/order/success?session_id={CHECKOUT_SESSION_ID}`;
export const CANCEL_URL = `${ALLOWED_ORIGIN}/shop`;

// Rate limit config
export const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 10;
export const MAX_QUANTITY = 10;
