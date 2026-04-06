import type { NextApiRequest, NextApiResponse } from "next";

// @ts-ignore
import { handleUpload } from "@vercel/blob";
// @ts-ignore
import { type HandleUploadBody } from "@vercel/blob/client";
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
          allowedContentTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ],
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
