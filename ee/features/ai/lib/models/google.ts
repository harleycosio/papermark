import { createVertex } from "@ai-sdk/google-vertex";

const googleVertexInstance = process.env.GOOGLE_VERTEX_API_KEY
  ? createVertex({
      apiKey: process.env.GOOGLE_VERTEX_API_KEY,
    })
  : null;

/**
 * Fallback to a proxy if vertex is not initialized to avoid build errors.
 */
const vertex = new Proxy({} as any, {
  get: (target, prop) => {
    if (googleVertexInstance) {
      return (googleVertexInstance as any)[prop];
    }
    return () => null;
  },
}) as any;

export { vertex };
