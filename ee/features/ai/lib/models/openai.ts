import { OpenAI } from "openai";

const realOpenai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

/**
 * Fallback to a proxy if openai is not initialized to avoid build errors.
 */
export const openai = new Proxy({} as any, {
  get: (target, prop) => {
    if (realOpenai) {
      return (realOpenai as any)[prop];
    }
    return (...args: any[]) => {
      if (process.env.NODE_ENV === "production" && !process.env.CI) {
        console.warn(`OpenAI.${String(prop)} called but OpenAI is not configured.`);
      }
      return null;
    };
  },
}) as any;
