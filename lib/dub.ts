import { Dub } from "dub";

const realDub = process.env.DUB_API_KEY
  ? new Dub({
      token: process.env.DUB_API_KEY,
    })
  : null;

/**
 * Fallback to a proxy if dub is not initialized to avoid build errors.
 */
export const dub = new Proxy({} as any, {
  get: (target, prop) => {
    if (realDub) {
      return (realDub as any)[prop];
    }
    return () => null;
  },
}) as any;

export async function getDubDiscountForExternalUserId(externalId: string) {
  try {
    const customers = await dub.customers.list({
      externalId,
      includeExpandedFields: true,
    });
    const first = customers[0];
    const couponId =
      process.env.NODE_ENV !== "production" && first?.discount?.couponTestId
        ? first.discount.couponTestId
        : first?.discount?.couponId;

    return couponId ? { discounts: [{ coupon: couponId }] } : null;
  } catch (err) {
    console.warn("Skipping Dub discount due to API error", err);
    return null; // degrade gracefully; don't block checkout
  }
}
