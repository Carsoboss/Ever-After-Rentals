/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client"

import { Calendar } from "../_components/calendar"
import { Button } from "../_components/button"
import { Card } from "../_components/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/select"
import { useState, useMemo } from "react"

interface TourDateStepProps {
  tourDate: Date | null
  tourTime: string
  onNext: (date: Date, time: string) => void
  onBack: () => void
}

export function TourDateStep({ tourDate, tourTime, onNext, onBack }: TourDateStepProps) {
  const [selectedTime, setSelectedTime] = useState<string>(tourTime)
  const [selectedDate, setSelectedDate] = useState<Date | null>(tourDate)

  // Find the first available Saturday
  const defaultMonth = useMemo(() => {
    const today = new Date()
    const minDate = new Date(today)
    minDate.setDate(today.getDate() + 3)

    // Find the next Saturday
    const date = new Date(minDate)
    while (date.getDay() !== 6) {
      date.setDate(date.getDate() + 1)
    }

    return date
  }, [])

  // Create array of time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9
    return {
      value: `${hour}:00`,
      label: `${hour === 12 ? 12 : hour % 12}:00 ${hour < 12 ? "AM" : "PM"}`,
    }
  })

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      const hours = selectedTime?.split(":")[0]
      const dateWithTime = new Date(selectedDate)
      dateWithTime.setHours(Number.parseInt(hours ?? "0"), 0, 0, 0)
      onNext(dateWithTime, selectedTime)
    }
  }

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
          onSelect={setSelectedDate}
          className="rounded-md border shadow"
          fromDate={(() => {
            const minDate = new Date()
            minDate.setDate(minDate.getDate() + 3)
            return minDate
          })()}
          disabled={(date) => {
            return date.getDay() !== 6
          }}
        />

        <Select value={selectedTime} onValueChange={setSelectedTime}>
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
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="bg-rose-300 hover:bg-rose-400"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
        >
          Next
        </Button>
      </div>
    </Card>
  )
}

