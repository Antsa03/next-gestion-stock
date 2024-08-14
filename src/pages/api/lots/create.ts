import prisma from "@/lib/prisma-client";
import { Lot } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(401).json("Méthode non autorisé");
    const lot: Lot = req.body;
    const create_lot = await prisma.lot.create({
      data: lot,
    });
    return res.status(200).json(create_lot);
  } catch (error) {
    return res.status(500).json(error);
  }
}
