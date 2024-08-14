import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "DELETE")
      return res.status(401).json({ error: "Méthode non autorisé" });
    const { id } = req.body;
    const delete_produit = await prisma.produit.delete({
      where: { id_produit: id },
    });
    return res.status(201).json(delete_produit);
  } catch (error) {
    return res.status(500).json(error);
  }
}
