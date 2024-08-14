import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const currentDate = new Date();

    // Sales histogram for the last 6 months
    const histogram = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const monthStart = startOfMonth(subMonths(currentDate, i));
        const monthEnd = endOfMonth(subMonths(currentDate, i));

        return prisma.sortie
          .findMany({
            where: {
              type_sortie: "Vente",
              bon_sortie: {
                date_sortie: {
                  gte: monthStart,
                  lte: monthEnd,
                },
              },
            },
            include: {
              produit: true,
            },
          })
          .then((sales) => ({
            month: monthStart,
            totalSales: sales.reduce(
              (sum, sale) => sum + sale.qte_sortie * sale.produit.pu,
              0
            ),
          }));
      })
    );

    // Total sales
    const totalSales = await prisma.sortie
      .findMany({
        where: {
          type_sortie: "Vente",
        },
        include: {
          produit: true,
        },
      })
      .then((sales) =>
        sales.reduce((sum, sale) => sum + sale.qte_sortie * sale.produit.pu, 0)
      );

    res.status(200).json({
      histogram: histogram.reverse(),
      totalSales,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}
