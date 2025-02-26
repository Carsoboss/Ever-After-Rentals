"use client"

import { Calendar } from "../_components/calendar"
import { Button } from "../_components/button"
import { Card } from "../_components/card"
import { useState } from "react"

interface WeddingDateStepProps {
  weddingDate: Date | null
  onNext: (date: Date) => void
}

export function WeddingDateStep({ weddingDate, onNext }: WeddingDateStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(weddingDate)

  return (
    <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">When is your wedding?</h2>
        <p className="text-muted-foreground">Select your wedding date to get started</p>
      </div>

      <div className="flex justify-center mb-8">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border shadow"
          disabled={(date: Date) => date < new Date()}
        />
      </div>

      <div className="text-center text-sm text-muted-foreground mb-6">
        <p>Available dates shown in calendar</p>
        <p>Tours must be scheduled at least 2 weeks before your wedding date</p>
      </div>

      <div className="flex justify-end">
        <Button
          className="bg-rose-300 hover:bg-rose-400"
          onClick={() => selectedDate && onNext(selectedDate)}
          disabled={!selectedDate}
        >
          Next
        </Button>
      </div>
    </Card>
  )
}

