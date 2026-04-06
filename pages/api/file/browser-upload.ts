import type { NextApiRequest, NextApiResponse } from "next";

import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";
import { CustomUser } from "@/lib/types";

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = req.body as HandleUploadBody;
  console.log("[Upload API] Recebido request en browser-upload", body);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[Upload API] CRITICAL ERROR: BLOB_READ_WRITE_TOKEN is not defined in environment variables.");
    return res.status(400).json({ error: "Missing Vercel Blob configuration on the server. Please connect Blob Storage." });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname: string) => {
        console.log(`[Upload API] request pathname: ${pathname}`);
        
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          console.error("[Upload API] Unauthorized: No session found");
          throw new Error("Unauthorized: No session");
        }

        const userId = (session.user as CustomUser).id;
        console.log(`[Upload API] generating token for user: ${userId}`);

        return {
          addRandomSuffix: true,
          maximumSizeInBytes: 104857600, // 100 MB force
          metadata: JSON.stringify({ userId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("[Upload API] blob upload completed", blob.url);
      },
    });

    console.log("[Upload API] token succesfully generated.");
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error(`[Upload API] Exception caught:`, error);
    return res.status(400).json({ error: (error as Error).message });
  }
}
