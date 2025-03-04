import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const rentalItemSchema = z.object({
  name: z.string(),
  category: z.string(),
  description: z.string(),
  price: z.number().optional(),
  image: z.string(),
  isSpecialty: z.boolean(),
});

export type RentalItem = z.infer<typeof rentalItemSchema>;

export const rentalsRouter = createTRPCRouter({
  getAllProducts: publicProcedure.query(async ({ ctx }): Promise<RentalItem[]> => {
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

    return items as RentalItem[];
  }),
});
