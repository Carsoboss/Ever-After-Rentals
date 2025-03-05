import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { and, between, eq, gt, lt } from "drizzle-orm";
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

export const toursRouter = createTRPCRouter({
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
    }))
    .mutation(async ({ ctx, input }) => {
      const now = new Date();

      // Validate tour date is in the future
      if (input.tourDateTime < now) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tour date must be in the future",
        });
      }

      // Validate wedding date is at least 2 weeks after tour date
      const tourToWeddingGap = input.weddingDateTime.getTime() - input.tourDateTime.getTime();
      if (tourToWeddingGap < MIN_TOUR_TO_WEDDING_GAP) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Wedding date must be at least 2 weeks after the tour date",
        });
      }

      // Validate that tour is on a Saturday
      if (input.tourDateTime.getDay() !== 6) { // 6 represents Saturday (0 = Sunday, 1 = Monday, etc.)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tours are only available on Saturdays",
        });
      }

      // Validate tour time is between 9 AM and 5 PM
      const hour = input.tourDateTime.getHours();
      if (hour < BUSINESS_START_HOUR || hour >= BUSINESS_END_HOUR) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tours are only available between 9 AM and 5 PM",
        });
      }

      // Check if tour time conflicts with other tours (within 1 hour)
      const tourStartWindow = new Date(input.tourDateTime.getTime() - MIN_TOUR_GAP);
      const tourEndWindow = new Date(input.tourDateTime.getTime() + MIN_TOUR_GAP);

      const conflictingTours = await ctx.db.query.tours.findMany({
        where: and(
          gt(tours.tourDateTime, tourStartWindow),
          lt(tours.tourDateTime, tourEndWindow)
        ),
      });

      if (conflictingTours.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tour time conflicts with another tour",
        });
      }

      // Create the tour
      const [tour] = await ctx.db.insert(tours).values({
        userId: ctx.userId,
        tourDateTime: input.tourDateTime,
        weddingDateTime: input.weddingDateTime,
      }).returning();

      return tour;
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
