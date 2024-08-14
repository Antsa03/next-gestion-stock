import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const bon_entree = await prisma.bonEntree.findMany({
      include: {
        entrees: {
          include: {
            produit: true,
            lot: true,
          },
        },
      },
    });
    return res.status(200).json(bon_entree);
  } catch (error) {
    return res.status(500).json(error);
  }
}
