import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(401).json("Méthode non autorisé");
    const { id } = req.query;
    if (id && typeof id === "number") {
      const delete_lot = await prisma.lot.delete({
        where: { id_lot: id },
      });
      if (delete_lot) {
        await prisma.produit.update({
          where: { id_produit: delete_lot.id_produit },
          data: {
            stock: { decrement: delete_lot.quantite_lot },
          },
        });
        return res.status(200).json(delete_lot);
      }
    } else {
      return res.status(404).json({ error: "ID invalide ou introuvable" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}
