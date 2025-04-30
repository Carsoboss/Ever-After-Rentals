import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { and, between, eq, gt, lt, desc, ne } from "drizzle-orm";
import { tours, totalCheckouts, tourRentalItems, rentalItems } from "~/server/db/schema";

// Minimum time between tours in milliseconds (1 hour)
const MIN_TOUR_GAP = 60 * 60 * 1000;
// Minimum time between tour and wedding in milliseconds (2 weeks)
const MIN_TOUR_TO_WEDDING_GAP = 14 * 24 * 60 * 60 * 1000;
// Business hours
const BUSINESS_START_HOUR = 9; // 9 AM
const BUSINESS_END_HOUR = 17;  // 5 PM

// Cache for wedding dates
let weddingDatesCache: {
  data: {
    minWeddingDate: Date;
    unavailablePeriods: { startDate: Date; endDate: Date; }[];
  };
  lastFetched: number;
} | null = null;

// Cache duration - 1 hour
const CACHE_DURATION = 60 * 60 * 1000;

// Shared validation logic
const validateTourDate = (tourDateTime: Date, weddingDateTime: Date, existingTourId?: string) => {
  const now = new Date();

  // Validate tour date is in the future
  if (tourDateTime < now) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Tour date must be in the future",
    });
  }

  // Validate wedding date is at least 2 weeks after tour date
  const tourToWeddingGap = weddingDateTime.getTime() - tourDateTime.getTime();
  if (tourToWeddingGap < MIN_TOUR_TO_WEDDING_GAP) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Wedding date must be at least 2 weeks after the tour date",
    });
  }

  // Validate that tour is on a Saturday
  if (tourDateTime.getDay() !== 6) { // 6 represents Saturday (0 = Sunday, 1 = Monday, etc.)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Tours are only available on Saturdays",
    });
  }

  // Validate tour time is between 9 AM and 5 PM
  const hour = tourDateTime.getHours();
  if (hour < BUSINESS_START_HOUR || hour >= BUSINESS_END_HOUR) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Tours are only available between 9 AM and 5 PM",
    });
  }
};

// Check for conflicting tours
const checkForConflictingTours = async (ctx: any, tourDateTime: Date, existingTourId?: string) => {
  // Check if tour time conflicts with other tours (within 1 hour)
  const tourStartWindow = new Date(tourDateTime.getTime() - MIN_TOUR_GAP);
  const tourEndWindow = new Date(tourDateTime.getTime() + MIN_TOUR_GAP);

  // Construct the where clause
  let whereClause;
  if (existingTourId) {
    // When updating, exclude the user's own tour
    whereClause = and(
      gt(tours.tourDateTime, tourStartWindow),
      lt(tours.tourDateTime, tourEndWindow),
      ne(tours.id, existingTourId)
    );
  } else {
    // For new tours
    whereClause = and(
      gt(tours.tourDateTime, tourStartWindow),
      lt(tours.tourDateTime, tourEndWindow)
    );
  }

  const conflictingTours = await ctx.db.query.tours.findMany({
    where: whereClause
  });

  if (conflictingTours.length > 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Tour time conflicts with another tour",
    });
  }
};

// Function to save tour-rental items relationship
const saveRentalItems = async (ctx: any, tourId: string, selectedItemIds: string[]) => {
  if (selectedItemIds.length > 0) {
    await ctx.db.insert(tourRentalItems).values(
      selectedItemIds.map(itemId => ({
        tourId: tourId,
        rentalItemId: itemId,
      }))
    );
  }
};

// Define the types for the tour item relationships
interface TourRentalItem {
  rentalItem: {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number | null;
    image: string | null;
    isSpecialty: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

export const toursRouter = createTRPCRouter({
  // Get user's scheduled tour if one exists
  getUserTour: protectedProcedure
    .query(async ({ ctx }) => {
      const userTour = await ctx.db.query.tours.findFirst({
        where: eq(tours.userId, ctx.userId),
        orderBy: (tours, { desc }) => [desc(tours.tourDateTime)],
        with: {
          rentalItems: {
            with: {
              rentalItem: true,
            }
          }
        }
      });

      if (!userTour) {
        return null;
      }

      return {
        ...userTour,
        rentalItems: userTour.rentalItems.map(item => item.rentalItem)
      };
    }),

  getAvailableWeddingDates: protectedProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      // Check if we have valid cached data
      const now = new Date();
      if (weddingDatesCache && (now.getTime() - weddingDatesCache.lastFetched) < CACHE_DURATION) {
        return weddingDatesCache.data;
      }

      const minWeddingDate = new Date(now.getTime() + MIN_TOUR_TO_WEDDING_GAP);

      // Get all checkouts that overlap with the requested period
      const checkouts = await ctx.db.query.totalCheckouts.findMany({
        where: and(
          lt(totalCheckouts.checkoutStart, input.endDate),
          gt(totalCheckouts.checkoutEnd, input.startDate)
        ),
      });

      // Cache the results
      const data = {
        minWeddingDate,
        unavailablePeriods: checkouts.map(checkout => ({
          startDate: checkout.checkoutStart,
          endDate: checkout.checkoutEnd,
        })),
      };

      weddingDatesCache = {
        data,
        lastFetched: now.getTime(),
      };

      return data;
    }),

  selectTourItems: protectedProcedure
    .input(z.object({
      selectedItemIds: z.array(z.string()),
    }))
    .query(async ({ ctx }) => {
      // Get all rental items
      const items = await ctx.db.query.rentalItems.findMany({
        columns: {
          id: true,
          name: true,
          category: true,
          description: true,
          price: true,
          image: true,
          isSpecialty: true,
        },
      });

      // Return all items with a selected flag
      return items.map(item => ({
        ...item,
        selected: false, // Default to unselected since this is just fetching available items
      }));
    }),

  // Validate and schedule a tour
  scheduleTour: protectedProcedure
    .input(z.object({
      tourDateTime: z.date(),
      weddingDateTime: z.date(),
      selectedItemIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if the user already has a tour
      const existingTour = await ctx.db.query.tours.findFirst({
        where: eq(tours.userId, ctx.userId),
        orderBy: (tours, { desc }) => [desc(tours.tourDateTime)],
      });

      // If tour exists, call updateTour instead of creating a new one
      if (existingTour) {
        // Use the update mutation logic
        await ctx.db.update(tours).set({
          tourDateTime: input.tourDateTime,
          weddingDateTime: input.weddingDateTime,
          updatedAt: new Date(),
        }).where(eq(tours.id, existingTour.id));

        // Delete existing tour rental items
        await ctx.db.delete(tourRentalItems).where(eq(tourRentalItems.tourId, existingTour.id));

        // Add new selected items
        if (input.selectedItemIds && input.selectedItemIds.length > 0) {
          await saveRentalItems(ctx, existingTour.id, input.selectedItemIds);
        }

        // Return the updated tour
        const updatedTour = await ctx.db.query.tours.findFirst({
          where: eq(tours.id, existingTour.id),
          with: {
            rentalItems: {
              with: {
                rentalItem: true,
              }
            }
          }
        });

        if (!updatedTour) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve updated tour",
          });
        }

        return {
          ...updatedTour,
          rentalItems: updatedTour.rentalItems.map((item: TourRentalItem) => item.rentalItem)
        };
      }

      // If no existing tour, create a new one
      // Run validations
      validateTourDate(input.tourDateTime, input.weddingDateTime);
      await checkForConflictingTours(ctx, input.tourDateTime);

      // Create the tour
      const result = await ctx.db.insert(tours).values({
        userId: ctx.userId,
        tourDateTime: input.tourDateTime,
        weddingDateTime: input.weddingDateTime,
      }).returning();

      const tour = result[0];
      if (!tour) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create tour",
        });
      }

      // If there are selected items, save them to the tour_rental_items table
      if (input.selectedItemIds && input.selectedItemIds.length > 0) {
        await saveRentalItems(ctx, tour.id, input.selectedItemIds);
      }

      // Return the complete tour with items
      const createdTour = await ctx.db.query.tours.findFirst({
        where: eq(tours.id, tour.id),
        with: {
          rentalItems: {
            with: {
              rentalItem: true,
            }
          }
        }
      });
      
      if (!createdTour) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve created tour",
        });
      }
      
      return {
        ...createdTour,
        rentalItems: createdTour.rentalItems.map((item: TourRentalItem) => item.rentalItem)
      };
    }),

  // Update an existing tour
  updateTour: protectedProcedure
    .input(z.object({
      tourDateTime: z.date(),
      weddingDateTime: z.date(),
      selectedItemIds: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get the user's existing tour
      const existingTour = await ctx.db.query.tours.findFirst({
        where: eq(tours.userId, ctx.userId),
        orderBy: (tours, { desc }) => [desc(tours.tourDateTime)],
      });

      if (!existingTour) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No existing tour found to update",
        });
      }

      // Run validations
      validateTourDate(input.tourDateTime, input.weddingDateTime, existingTour.id);
      await checkForConflictingTours(ctx, input.tourDateTime, existingTour.id);

      // Update the tour
      await ctx.db.update(tours).set({
        tourDateTime: input.tourDateTime,
        weddingDateTime: input.weddingDateTime,
        updatedAt: new Date(),
      }).where(eq(tours.id, existingTour.id));

      // Delete existing tour rental items
      await ctx.db.delete(tourRentalItems).where(eq(tourRentalItems.tourId, existingTour.id));

      // Add new selected items
      await saveRentalItems(ctx, existingTour.id, input.selectedItemIds);

      // Get the updated tour with rental items
      const updatedTour = await ctx.db.query.tours.findFirst({
        where: eq(tours.id, existingTour.id),
        with: {
          rentalItems: {
            with: {
              rentalItem: true,
            }
          }
        }
      });

      if (!updatedTour) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve updated tour",
        });
      }

      return {
        ...updatedTour,
        rentalItems: updatedTour.rentalItems.map((item: TourRentalItem) => item.rentalItem)
      };
    }),

  // Get available tour times
  getAvailableTourTimes: protectedProcedure
    .input(z.object({
      date: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      // Validate that the requested date is a Saturday
      if (input.date.getDay() !== 6) {
        return { error: "Tours are only available on Saturdays" };
      }

      // Get all tours on the specified date
      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);

      const existingTours = await ctx.db.query.tours.findMany({
        where: and(
          gt(tours.tourDateTime, startOfDay),
          lt(tours.tourDateTime, endOfDay)
        ),
      });

      // Generate all possible time slots for the day (9 AM to 5 PM, hourly)
      const availableTimeSlots: Date[] = [];
      const date = new Date(input.date);
      date.setHours(BUSINESS_START_HOUR, 0, 0, 0);

      while (date.getHours() < BUSINESS_END_HOUR) {
        availableTimeSlots.push(new Date(date));
        date.setHours(date.getHours() + 1);
      }

      // Filter out booked times
      const bookedTimes = new Set(existingTours.map(tour => 
        tour.tourDateTime.getTime()
      ));

      return {
        availableSlots: availableTimeSlots.filter(slot => 
          !bookedTimes.has(slot.getTime())
        ),
        bookedSlots: existingTours.map(tour => tour.tourDateTime),
      };
    }),
});
