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

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname: string) => {
        // Generate a client token for the browser to upload the file
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          console.error("[Upload] Unauthorized: No session found");
          res.status(401).end("Unauthorized");
          throw new Error("Unauthorized");
        }

        const userId = (session.user as CustomUser).id;
        const team = await prisma.team.findFirst({
          where: {
            users: {
              some: {
                userId,
              },
            },
          },
          select: {
            plan: true,
          },
        });

        // Default to premium limits since we are forcing high tier for self-hosted admin
        let maxSize = 100 * 1024 * 1024; // 100 MB default for forced premium

        if (team) {
          const stripedTeamPlan = team.plan.replace("+old", "");
          console.log(`[Upload] Team found with plan: ${stripedTeamPlan}`);
          if (
            !["business", "datarooms", "datarooms-plus", "datarooms-premium"].includes(stripedTeamPlan)
          ) {
             // If for some reason it's a legacy or lower plan, we still allow 100MB in this self-hosted context
             console.log("[Upload] Using forced premium limits");
          }
        } else {
          console.warn(`[Upload] No team found for user ${userId}. Defaulting to premium limits.`);
        }

        return {
          addRandomSuffix: true,
          allowedContentTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ],
          maximumSizeInBytes: maxSize,
          metadata: JSON.stringify({
            userId: userId,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of browser upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          // throw new Error("Could not update user");
        }
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    // The webhook will retry 5 times waiting for a 200
    return res.status(400).json({ error: (error as Error).message });
  }
}
