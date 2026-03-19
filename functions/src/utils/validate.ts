import { HttpsError } from 'firebase-functions/v2/https';
import { MAX_QUANTITY } from '../config.js';

const PRICE_ID_REGEX = /^price_[A-Za-z0-9]{8,}$/;

export function validatePriceId(priceId: unknown): string {
  if (typeof priceId !== 'string' || !PRICE_ID_REGEX.test(priceId)) {
    throw new HttpsError('invalid-argument', 'Invalid price ID format.');
  }
  return priceId;
}

export function validateQuantity(quantity: unknown): number {
  const qty = typeof quantity === 'number' ? quantity : 1;
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QUANTITY) {
    throw new HttpsError(
      'invalid-argument',
      `Quantity must be an integer between 1 and ${MAX_QUANTITY}.`,
    );
  }
  return qty;
}
