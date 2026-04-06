import type { NextApiRequest, NextApiResponse } from "next";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { Buffer } from 'buffer';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { filename, contentType, content } = req.body;
  
  if (!filename || !content) {
    return res.status(400).json({ error: "Missing filename or content" });
  }

  try {
    const buffer = Buffer.from(content, 'base64');
    
    // Server-side upload directly to Vercel Blob! No CORS! No client tokens!
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: contentType || 'application/octet-stream',
      addRandomSuffix: true,
    });

    return res.status(200).json(blob);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
