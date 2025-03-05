"use client"

import { Calendar } from "../_components/calendar"
import { Button } from "../_components/button"
import { Card } from "../_components/card"
import { useState, useMemo } from "react"
import React from "react"
import { api } from "~/trpc/react"
import { Loader2 } from "lucide-react"

// Helper to round a date to the start of the day
function roundToDay(date: Date): Date {
  const newDate = new Date(date)
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

// Calculate dates once, rounded to days
const TODAY = roundToDay(new Date())


// Minimum wedding date is 3 weeks after the next Saturday
const MIN_WEDDING_DATE = roundToDay(new Date(TODAY.getTime() + 21 * 24 * 60 * 60 * 1000))
const ONE_YEAR_FROM_NOW = roundToDay(new Date(TODAY.getTime() + 365 * 24 * 60 * 60 * 1000))

interface WeddingDateStepProps {
  weddingDate: Date | null
  onNext: (date: Date) => void
}

export function WeddingDateStep({ weddingDate, onNext }: WeddingDateStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(weddingDate)

  // Query for available wedding dates with stable inputs
  const { data, isLoading, error } = api.tours.getAvailableWeddingDates.useQuery({
    startDate: MIN_WEDDING_DATE,
    endDate: ONE_YEAR_FROM_NOW,
  });

  // Determine which month to show in the calendar
  const initialMonth = useMemo(() => {
    // If user already selected a date, use that month
    if (selectedDate) {
      return selectedDate;
    }
    // Otherwise use the minimum wedding date
    return data?.minWeddingDate || MIN_WEDDING_DATE;
  }, [selectedDate, data?.minWeddingDate]);

  // Function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    if (!data) return true // Disable all dates while loading
    
    // Check if date is before minimum wedding date
    if (date < MIN_WEDDING_DATE) return true

    // Check if date falls within any unavailable period
    return data.unavailablePeriods.some(period => {
      const periodStart = new Date(period.startDate)
      const periodEnd = new Date(period.endDate)
      return date >= periodStart && date <= periodEnd
    })
  }

  return (
    <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">When is your wedding?</h2>
        <p className="text-muted-foreground">Select your wedding date to get started</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-rose-300" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mb-8">
          <p>Error loading available dates. Please try again later.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-8">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border shadow"
              disabled={isDateDisabled}
              defaultMonth={initialMonth}
              fromDate={data?.minWeddingDate}
            />
          </div>

          <div className="text-center text-sm text-muted-foreground mb-6">
            <p>Available dates shown in calendar</p>
            {data?.unavailablePeriods && data.unavailablePeriods.length > 0 && (
              <p className="mt-2 text-rose-500">
                Some dates are unavailable due to existing rentals
              </p>
            )}
          </div>
        </>
      )}

      <div className="flex justify-end">
        <Button
          className="bg-rose-300 hover:bg-rose-400"
          onClick={() => selectedDate && onNext(selectedDate)}
          disabled={!selectedDate || isLoading}
        >
          Next
        </Button>
      </div>
    </Card>
  )
}

