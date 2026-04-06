import { NextApiRequest, NextApiResponse } from "next";

import { generateTriggerPublicAccessToken } from "@/lib/utils/generate-trigger-auth-token";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { documentVersionId } = req.query;

  if (!documentVersionId || typeof documentVersionId !== "string") {
    return res.status(400).json({ error: "Document version ID is required" });
  }

  try {
    const publicAccessToken = await generateTriggerPublicAccessToken(
      `version:${documentVersionId}`,
    );
    return res.status(200).json({ publicAccessToken });
  } catch (error) {
    console.error("Error generating trigger token (check TRIGGER_SECRET_KEY):", error);
    // Return null instead of 500 to prevent dashboard crash in self-hosted
    return res.status(200).json({ publicAccessToken: null });
  }
}
