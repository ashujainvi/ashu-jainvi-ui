import { HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { db, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from "../config.js";

const rateLimitsCollection = db.collection("rateLimits");

/**
 * Firestore-based sliding-window rate limiter.
 * Tracks request timestamps per IP and rejects if over limit.
 */
export async function enforceRateLimit(ip: string): Promise<void> {
  // Sanitize IP for use as document ID (replace dots/colons)
  const docId = ip.replace(/[.:]/g, "_");
  const docRef = rateLimitsCollection.doc(docId);
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  await db.runTransaction(async (tx) => {
    const doc = await tx.get(docRef);
    const data = doc.data();

    // Filter timestamps within the current window
    const timestamps: number[] = (data?.timestamps ?? []).filter(
      (ts: number) => ts > windowStart
    );

    if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
      throw new HttpsError(
        "resource-exhausted",
        "Too many requests. Please try again later."
      );
    }

    tx.set(docRef, {
      timestamps: [...timestamps, now],
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}
