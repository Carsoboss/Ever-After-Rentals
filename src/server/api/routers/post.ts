import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { rentalItems } from "~/server/db/schema";
import { categoryEnum } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text} from the rental items service!`,
      };
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      category: z.enum(categoryEnum.enumValues),
      description: z.string().min(1),
      price: z.number().optional(),
      quantity: z.number().min(0),
      value: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(rentalItems).values({
        name: input.name,
        category: input.category,
        description: input.description,
        price: input.price,
        quantity: input.quantity,
        value: input.value,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const item = await ctx.db.query.rentalItems.findFirst({
      orderBy: (items, { desc }) => [desc(items.createdAt)],
    });

    return item ?? null;
  }),
});
