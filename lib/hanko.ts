import { tenant } from "@teamhanko/passkeys-next-auth-provider";

if (!process.env.HANKO_API_KEY || !process.env.NEXT_PUBLIC_HANKO_TENANT_ID) {
  if (process.env.NODE_ENV === "production" && !process.env.CI) {
    console.warn(
      "HANKO_API_KEY or NEXT_PUBLIC_HANKO_TENANT_ID is missing. Passkey authentication will be disabled.",
    );
  }
}

const hanko =
  process.env.HANKO_API_KEY && process.env.NEXT_PUBLIC_HANKO_TENANT_ID
    ? tenant({
        apiKey: process.env.HANKO_API_KEY!,
        tenantId: process.env.NEXT_PUBLIC_HANKO_TENANT_ID!,
      })
    : null;

export default hanko;
