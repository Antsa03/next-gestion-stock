// pages/api/bon-sorties.ts
import prisma from "@/lib/prisma-client";
import type { NextApiRequest, NextApiResponse } from "next";

type SortieInput = {
  id_produit: number;
  qte_sortie: number;
  id_lot: number;
  type_sortie: string;
};

type BonSortieInput = {
  date_sortie: Date;
  sorties: SortieInput[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { date_sortie, sorties }: BonSortieInput = req.body;

      // Vérifier le stock et la péremption pour chaque sortie
      for (const sortie of sorties) {
        const lot = await prisma.lot.findUnique({
          where: { id_lot: sortie.id_lot },
        });

        if (!lot || lot.quantite_lot < sortie.qte_sortie) {
          return res.status(400).json({
            error: `Stock insuffisant dans le lot pour le produit ${sortie.id_produit}`,
          });
        }

        if (new Date() > lot.date_peremption) {
          return res
            .status(400)
            .json({ error: `Produit ${sortie.id_produit} périmé` });
        }
      }

      // Créer le bon de sortie
      const bonSortie = await prisma.bonSortie.create({
        data: {
          date_sortie: new Date(date_sortie),
          sorties: {
            create: sorties.map((sortie) => ({
              id_produit: sortie.id_produit,
              qte_sortie: sortie.qte_sortie,
              id_lot: sortie.id_lot,
              type_sortie: sortie.type_sortie,
            })),
          },
        },
        include: {
          sorties: true,
        },
      });

      // Mettre à jour le stock des produits et les quantités des lots
      for (const sortie of sorties) {
        await prisma.produit.update({
          where: { id_produit: sortie.id_produit },
          data: { stock: { decrement: sortie.qte_sortie } },
        });

        await prisma.lot.update({
          where: { id_lot: sortie.id_lot },
          data: { quantite_lot: { decrement: sortie.qte_sortie } },
        });
      }

      res.status(200).json(bonSortie);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la création du bon de sortie" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
