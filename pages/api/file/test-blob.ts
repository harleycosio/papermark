import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let blobExports;
  let blobClientExports;
  let errorBlob = null;
  let errorClient = null;

  try {
    const blob = require("@vercel/blob");
    blobExports = Object.keys(blob);
  } catch (e) {
    errorBlob = e.message;
  }

  try {
    const blobClient = require("@vercel/blob/client");
    blobClientExports = Object.keys(blobClient);
  } catch (e) {
    errorClient = e.message;
  }

  res.status(200).json({
    blobExports,
    blobClientExports,
    errorBlob,
    errorClient
  });
}
