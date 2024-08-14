import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const lot = await prisma.lot.findMany({
      include: {
        produit: true,
      },
    });
    return res.status(200).json(lot);
  } catch (error) {
    return res.status(401).json(error);
  }
}
