import prisma from "@/lib/prisma-client";
import { Produit } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json({ error: "Méthode non autorisé" });
    const produit: Produit = req.body;
    const update_produit = await prisma.produit.update({
      where: { id_produit: produit.id_produit },
      data: {
        designation: produit.designation,
        pu: produit.pu,
        stock: produit.stock,
      },
    });
    res.status(200).json(update_produit);
  } catch (error) {
    return res.status(500).json(error);
  }
}
