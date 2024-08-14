import prisma from "@/lib/prisma-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { id_bon_sortie, date_sortie, sorties } = req.body;

      // Récupérer le bon de sortie actuel et ses sorties associées
      const currentBonSortie = await prisma.bonSortie.findUnique({
        where: { id_bon_sortie: id_bon_sortie },
        include: { sorties: true },
      });

      if (!currentBonSortie) {
        return res.status(404).json({ error: "Bon de sortie non trouvé" });
      }

      // Mettre à jour chaque sortie
      for (const newSortie of sorties) {
        const currentSortie = currentBonSortie.sorties.find(
          (sortie) => sortie.id_sortie === newSortie.id_sortie
        );

        if (!currentSortie) {
          return res.status(404).json({ error: "Sortie non trouvée" });
        }

        // Vérifier le stock et la péremption pour chaque sortie
        const lot = await prisma.lot.findUnique({
          where: { id_lot: newSortie.id_lot },
        });

        if (!lot || lot.quantite_lot < newSortie.qte_sortie) {
          return res.status(400).json({
            error: `Stock insuffisant dans le lot pour le produit ${newSortie.id_produit}`,
          });
        }

        if (new Date() > lot.date_peremption) {
          return res
            .status(400)
            .json({ error: `Produit ${newSortie.id_produit} périmé` });
        }

        // Calculer la différence de quantité
        const quantityDifference =
          newSortie.qte_sortie - currentSortie.qte_sortie;

        if (quantityDifference !== 0) {
          // Ajuster le stock du produit
          await prisma.produit.update({
            where: { id_produit: newSortie.id_produit },
            data: { stock: { decrement: quantityDifference } },
          });

          // Ajuster le stock du lot
          await prisma.lot.update({
            where: { id_lot: newSortie.id_lot },
            data: { quantite_lot: { decrement: quantityDifference } },
          });
        }

        // Mettre à jour la sortie
        await prisma.sortie.update({
          where: { id_sortie: newSortie.id_sortie },
          data: {
            qte_sortie: newSortie.qte_sortie,
            id_lot: newSortie.id_lot,
            type_sortie: newSortie.type_sortie,
          },
        });
      }

      // Mettre à jour le bon de sortie
      const updatedBonSortie = await prisma.bonSortie.update({
        where: { id_bon_sortie: id_bon_sortie },
        data: { date_sortie: new Date(date_sortie) },
        include: { sorties: true },
      });

      res.status(200).json(updatedBonSortie);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour du bon de sortie" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
