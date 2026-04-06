import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const realRedis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/**
 * Fallback to a proxy if redis is not initialized to avoid build errors.
 */
export const redis = new Proxy({} as any, {
  get: (target, prop) => {
    if (realRedis) {
      return (realRedis as any)[prop];
    }
    // Use an any-cast function to allow generic type arguments (e.g. .get<T>)
    return ((...args: any[]) => {
      if (process.env.NODE_ENV === "production" && !process.env.CI) {
        console.warn(`Redis.${String(prop)} called but Redis is not configured.`);
      }
      return null;
    }) as any;
  },
}) as unknown as Redis;

const realLockerRedis =
  process.env.UPSTASH_REDIS_REST_LOCKER_URL &&
  process.env.UPSTASH_REDIS_REST_LOCKER_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_LOCKER_URL,
        token: process.env.UPSTASH_REDIS_REST_LOCKER_TOKEN,
      })
    : null;

export const lockerRedisClient = new Proxy({} as any, {
  get: (target, prop) => {
    if (realLockerRedis) {
      return (realLockerRedis as any)[prop];
    }
    return ((...args: any[]) => null) as any;
  },
}) as unknown as Redis;

// Create a new ratelimiter, that allows 10 requests per 10 seconds by default
export const ratelimit = (
  requests: number = 10,
  seconds:
    | `${number} ms`
    | `${number} s`
    | `${number} m`
    | `${number} h`
    | `${number} d` = "10 s",
) => {
  return new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(requests, seconds),
    analytics: true,
    prefix: "papermark",
  });
};
