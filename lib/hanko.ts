import { tenant } from "@teamhanko/passkeys-next-auth-provider";

if (!process.env.HANKO_API_KEY || !process.env.NEXT_PUBLIC_HANKO_TENANT_ID) {
  if (process.env.NODE_ENV === "production" && !process.env.CI) {
    console.warn(
      "HANKO_API_KEY or NEXT_PUBLIC_HANKO_TENANT_ID is missing. Passkey authentication will be disabled.",
    );
  }
}

const hankoInstance =
  process.env.HANKO_API_KEY && process.env.NEXT_PUBLIC_HANKO_TENANT_ID
    ? tenant({
        apiKey: process.env.HANKO_API_KEY!,
        tenantId: process.env.NEXT_PUBLIC_HANKO_TENANT_ID!,
      })
    : null;

/**
 * Fallback to a proxy if hanko is not initialized to avoid build errors.
 */
const hanko = new Proxy({} as any, {
  get: (target, prop) => {
    if (hankoInstance) {
      return (hankoInstance as any)[prop];
    }
    // Return a generic function that accepts any arguments and types
    return (...args: any[]) => {
      if (process.env.NODE_ENV === "production" && !process.env.CI) {
        console.warn(`Hanko.${String(prop)} called but Hanko is not configured.`);
      }
      return null;
    };
  },
}) as any;

export default hanko;
