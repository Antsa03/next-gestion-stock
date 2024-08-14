import prisma from "@/lib/prisma-client";
import { Produit } from "@prisma/client";
import { error } from "console";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(401).json({ error: "Méthode non autorisé" });
    const produit: Produit = req.body;
    const create_produit = await prisma.produit.create({
      data: {
        designation: produit.designation,
        pu: produit.pu,
        stock: 0,
      },
    });
    res.status(200).json(create_produit);
  } catch (error) {
    return res.status(500).json(error);
  }
}
