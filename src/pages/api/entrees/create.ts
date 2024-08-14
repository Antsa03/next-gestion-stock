import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

type EntreeInput = {
  id_produit: number;
  qte_entree: number;
  date_production: Date;
  date_peremption: Date;
};

type BonEntreeInput = {
  date_entree: Date;
  entrees: EntreeInput[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { date_entree, entrees }: BonEntreeInput = req.body;

      const bonEntree = await prisma.bonEntree.create({
        data: {
          date_entree: new Date(date_entree),
          entrees: {
            create: await Promise.all(
              entrees.map(async (entree) => {
                // Créer un nouveau lot pour chaque entrée
                const newLot = await prisma.lot.create({
                  data: {
                    id_produit: entree.id_produit,
                    date_production: new Date(entree.date_production),
                    date_peremption: new Date(entree.date_peremption),
                    quantite_lot: entree.qte_entree,
                  },
                });

                // Mettre à jour le stock du produit
                await prisma.produit.update({
                  where: { id_produit: entree.id_produit },
                  data: { stock: { increment: entree.qte_entree } },
                });

                // Retourner les données pour créer l'entrée
                return {
                  id_produit: entree.id_produit,
                  qte_entree: entree.qte_entree,
                  id_lot: newLot.id_lot,
                };
              })
            ),
          },
        },
        include: {
          entrees: {
            include: {
              produit: true,
              lot: true,
            },
          },
        },
      });

      res.status(200).json(bonEntree);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la création du bon d'entrée" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
