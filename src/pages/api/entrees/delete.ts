import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      const { id: id_bon_entree } = req.body;

      // Récupérer toutes les entrées associées au bon d'entrée
      const entrees = await prisma.entree.findMany({
        where: { id_bon_entree: id_bon_entree },
        include: { lot: true },
      });

      // Mettre à jour le stock de chaque produit et supprimer les lots
      await Promise.all(
        entrees.map(async (entree) => {
          // Décrémenter le stock du produit par la quantité de l'entrée
          await prisma.produit.update({
            where: { id_produit: entree.id_produit },
            data: { stock: { decrement: entree.qte_entree } },
          });

          // Supprimer le lot associé
          await prisma.lot.delete({
            where: { id_lot: entree.lot.id_lot },
          });
        })
      );

      // Supprimer les entrées associées au bon d'entrée
      await prisma.entree.deleteMany({
        where: { id_bon_entree: id_bon_entree },
      });

      // Supprimer le bon d'entrée
      await prisma.bonEntree.delete({
        where: { id_bon_entree: id_bon_entree },
      });

      res.status(200).json({ message: "Bon d'entrée supprimé avec succès" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression du bon d'entrée" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
