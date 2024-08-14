import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const lot = await prisma.lot.findUniqueOrThrow({
      where: { id_lot: Number(id?.toString()) },
      include: {
        produit: true,
      },
    });
    return res.status(200).json(lot);
  } catch (error) {
    return res.status(401).json(error);
  }
}
