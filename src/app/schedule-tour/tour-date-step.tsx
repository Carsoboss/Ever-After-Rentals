/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client"

import { Calendar } from "../_components/calendar"
import { Button } from "../_components/button"
import { Card } from "../_components/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/select"
import { useState, useMemo, useEffect } from "react"
import { api } from "~/trpc/react"
import { Loader2 } from "lucide-react"
import React from "react"

// Helper to round a date to the start of the day
function roundToDay(date: Date): Date {
  const newDate = new Date(date)
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

// Calculate dates once, rounded to days
const TODAY = roundToDay(new Date())
const THREE_DAYS_FROM_NOW = roundToDay(new Date(TODAY.getTime() + 3 * 24 * 60 * 60 * 1000))
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000

interface TourDateStepProps {
  tourDate: Date | null
  tourTime: string
  weddingDate: Date | null
  onNext: (date: Date, time: string) => void
  onBack: () => void
}

export function TourDateStep({ tourDate, tourTime, weddingDate, onNext, onBack }: TourDateStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(tourDate)
  const [selectedTime, setSelectedTime] = useState<string>("")

  // Set initial time only when component mounts and tourTime is provided
  useEffect(() => {
    if (tourTime && tourDate) {
      setSelectedTime(tourTime)
    }
  }, [tourTime, tourDate])

  // Calculate the latest possible tour date (1 week before wedding)
  const latestTourDate = useMemo(() => {
    if (!weddingDate) return null
    const date = new Date(weddingDate.getTime() - TWO_WEEKS)
    return roundToDay(date)
  }, [weddingDate])

  // Calculate the earliest possible tour date (next Saturday)
  const earliestTourDate = useMemo(() => {
    const date = new Date(TODAY)
    // Find the next Saturday
    while (date.getDay() !== 6) {
      date.setDate(date.getDate() + 1)
    }
    return roundToDay(date)
  }, [])

  // Determine which month to show in the calendar
  const initialMonth = useMemo(() => {
    // If user already selected a date, use that month
    if (selectedDate) {
      return selectedDate;
    }
    // Otherwise use the earliest available tour date
    return earliestTourDate;
  }, [selectedDate, earliestTourDate]);

  // Query available tour times when a date is selected
  const { data: tourSlots, isLoading: isLoadingSlots } = api.tours.getAvailableTourTimes.useQuery(
    { date: selectedDate ?? THREE_DAYS_FROM_NOW },
    { 
      enabled: !!selectedDate,
      staleTime: Infinity 
    }
  )

  // Create array of available time slots
  const timeSlots = useMemo(() => {
    if (!tourSlots || !tourSlots.bookedSlots) return []

    const allSlots = Array.from({ length: 9 }, (_, i) => {
      const hour = i + 9
      return {
        value: `${hour}:00`,
        label: `${hour === 12 ? 12 : hour % 12}:00 ${hour < 12 ? "AM" : "PM"}`,
      }
    })

    const bookedHours = new Set(tourSlots.bookedSlots.map(date => date.getHours()))
    return allSlots.filter(slot => !bookedHours.has(parseInt(slot.value)))
  }, [tourSlots])

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      const hours = selectedTime?.split(":")[0]
      const dateWithTime = new Date(selectedDate)
      dateWithTime.setHours(Number.parseInt(hours ?? "0"), 0, 0, 0)
      onNext(dateWithTime, selectedTime)
    }
  }

  // Function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    // Must be a Saturday
    if (date.getDay() !== 6) return true

    // Must be at least 3 days from now
    if (date < THREE_DAYS_FROM_NOW) return true

    // Must be at least 2 weeks before wedding date
    if (weddingDate && latestTourDate) {
      return date > latestTourDate
    }

    return false
  }

  // If no wedding date is selected, show a message
  if (!weddingDate) {
    return (
      <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Wedding Date Required</h2>
          <p className="text-muted-foreground">Please go back and select a wedding date first.</p>
        </div>
        <div className="flex justify-center">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </Card>
    )
  }

  // Check if there are any available tour dates
  const hasAvailableTourDates = earliestTourDate <= latestTourDate!

  // Format wedding date for display
  const formattedWeddingDate = weddingDate ? weddingDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  return (
    <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Select Your Tour Date</h2>
        <p className="text-muted-foreground">Tours are available on Saturdays</p>
      </div>

      <div className="flex flex-col items-center gap-6 mb-8">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            if (date !== null) {
              setSelectedTime("");
            }
          }}
          className="rounded-md border shadow"
          defaultMonth={initialMonth}
          fromDate={earliestTourDate}
          toDate={latestTourDate ?? undefined}
          disabled={isDateDisabled}
        />

        {!selectedDate ? (
          <Select disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a date first" />
            </SelectTrigger>
          </Select>
        ) : isLoadingSlots ? (
          <div className="h-10 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-rose-300" />
          </div>
        ) : (
          <Select value={selectedTime} onValueChange={setSelectedTime} disabled={timeSlots.length === 0}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {selectedDate && timeSlots.length === 0 && !isLoadingSlots && (
          <p className="text-sm text-rose-500">No available time slots for this date</p>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>Available dates shown in calendar</p>
          <p>Tours must be scheduled at least 2 weeks before your wedding date</p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="bg-rose-300 hover:bg-rose-400"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime || isLoadingSlots}
        >
          Schedule Tour
        </Button>
      </div>
    </Card>
  )
}

