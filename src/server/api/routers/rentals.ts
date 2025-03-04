import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const rentalsRouter = createTRPCRouter({
  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.query.rentalItems.findMany({
      columns: {
        name: true,
        category: true,
        description: true,
        price: true,
        image: true,
        isSpecialty: true,
      },
    });

    return items;
  }),
});
