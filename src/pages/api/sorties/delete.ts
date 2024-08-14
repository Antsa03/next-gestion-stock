// pages/api/bon-sorties.ts
import prisma from "@/lib/prisma-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      // Récupérer toutes les sorties associées au bon de sortie
      const sorties = await prisma.sortie.findMany({
        where: { id_bon_sortie: id },
      });

      // Mettre à jour le stock de chaque produit et les quantités des lots
      await Promise.all(
        sorties.map(async (sortie) => {
          // Incrementer le stock du produit par la quantité de la sortie
          await prisma.produit.update({
            where: { id_produit: sortie.id_produit },
            data: { stock: { increment: sortie.qte_sortie } },
          });

          // Réajuster le lot associé
          await prisma.lot.update({
            where: { id_lot: sortie.id_lot },
            data: { quantite_lot: { increment: sortie.qte_sortie } },
          });
        })
      );

      // Supprimer les sorties associées au bon de sortie
      await prisma.sortie.deleteMany({
        where: { id_bon_sortie: id },
      });

      // Supprimer le bon de sortie
      await prisma.bonSortie.delete({
        where: { id_bon_sortie: id },
      });

      res.status(200).json({ message: "Bon de sortie supprimé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression du bon de sortie" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
