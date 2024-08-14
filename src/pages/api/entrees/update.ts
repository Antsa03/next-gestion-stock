import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

type EntreeUpdateInput = {
  id_entree: number;
  id_produit: number;
  qte_entree: number;
  date_production: Date;
  date_peremption: Date;
};

type BonEntreeUpdateInput = {
  id_bon_entree: number;
  date_entree: Date;
  entrees: EntreeUpdateInput[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { id_bon_entree, date_entree, entrees }: BonEntreeUpdateInput =
        req.body;

      const bonEntree = await prisma.bonEntree.update({
        where: { id_bon_entree: id_bon_entree },
        data: {
          date_entree: new Date(date_entree),
          entrees: {
            updateMany: await Promise.all(
              entrees.map(async (entree) => {
                // Récupérer l'entrée actuelle pour connaître l'ancienne quantité
                const currentEntree = await prisma.entree.findUnique({
                  where: { id_entree: entree.id_entree },
                  include: { lot: true },
                });
                if (!currentEntree) {
                  throw new Error(
                    `Entree with ID ${entree.id_entree} not found.`
                  );
                }
                // Calculer la différence de quantité
                const quantityDifference =
                  entree.qte_entree - currentEntree.qte_entree;
                // Mettre à jour le lot associé
                await prisma.lot.update({
                  where: { id_lot: currentEntree.lot.id_lot },
                  data: {
                    date_production: new Date(entree.date_production),
                    date_peremption: new Date(entree.date_peremption),
                    quantite_lot: entree.qte_entree,
                  },
                });

                // Mettre à jour le stock du produit en ajustant par la différence de quantité
                await prisma.produit.update({
                  where: { id_produit: entree.id_produit },
                  data: { stock: { increment: quantityDifference } },
                });

                // Mettre à jour l'entrée
                return {
                  where: { id_entree: entree.id_entree },
                  data: {
                    qte_entree: entree.qte_entree,
                  },
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
        .json({ error: "Erreur lors de la mise à jour du bon d'entrée" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
