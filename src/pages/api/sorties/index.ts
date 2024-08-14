import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const bon_sortie = await prisma.bonSortie.findMany({
      include: {
        sorties: {
          include: {
            produit: true,
            lot: true,
          },
        },
      },
    });
    return res.status(200).json(bon_sortie);
  } catch (error) {
    return res.status(500).json(error);
  }
}
