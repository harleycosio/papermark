import { Receiver } from "@upstash/qstash";
import { Client } from "@upstash/qstash";
import Bottleneck from "bottleneck";

// we're using Bottleneck to avoid running into Resend's rate limit of 10 req/s
export const limiter = new Bottleneck({
  maxConcurrent: 1, // maximum concurrent requests
  minTime: 100, // minimum time between requests in ms
});

// we're using Upstash's Receiver to verify the request signature
export const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "",
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "",
});

const realQstash = process.env.QSTASH_TOKEN
  ? new Client({
      token: process.env.QSTASH_TOKEN,
    })
  : null;

/**
 * Fallback to a proxy if qstash is not initialized or fails to avoid build/login errors.
 */
export const qstash = new Proxy({} as Client, {
  get: (target, prop) => {
    if (realQstash) {
      return (realQstash as any)[prop];
    }
    // Return a no-op async function for any method calls
    return () => Promise.resolve({ messageId: "mock-id" });
  },
}) as Client;
