import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const produits = await prisma.produit.findMany();
    return res.status(200).json(produits);
  } catch (error) {
    return res.status(500).json(error);
  }
}
