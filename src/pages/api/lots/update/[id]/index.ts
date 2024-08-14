import prisma from "@/lib/prisma-client";
import { Lot } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json("Méthode non autorisé");
    const { id } = req.query;
    const lot: Lot = req.body;
    if (id && typeof id === "number") {
      const old_lot = await prisma.lot.findUnique({
        where: { id_lot: id },
      });
      const update_lot = await prisma.lot.update({
        where: { id_lot: id },
        data: lot,
      });
      if (update_lot && old_lot) {
        await prisma.produit.update({
          where: { id_produit: old_lot.id_produit },
          data: {
            stock: { decrement: old_lot.quantite_lot },
          },
        });
        await prisma.produit.update({
          where: { id_produit: update_lot.id_produit },
          data: {
            stock: { increment: update_lot.quantite_lot },
          },
        });
      }
      return res.status(200).json(update_lot);
    } else {
      return res.status(404).json({ error: "ID invalide ou introuvable" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}
