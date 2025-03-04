/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client"

import { Button } from "../_components/button"
import { Card } from "../_components/card"
import { CheckCircle, Edit2, CalendarIcon, Home } from "lucide-react"
import Link from "next/link"
import React from "react"
const VENUE_ADDRESS = "1048 E 420 S, Provo, UT 84606"

interface ConfirmationStepProps {
  formData: {
    weddingDate: Date | null
    selectedItems: number[]
    tourDate: Date | null
    tourTime: string
  }
  onEdit: (step: number) => void
}

export function ConfirmationStep({ formData, onEdit }: ConfirmationStepProps) {
  const formatDateTime = (date: Date | null, time: string) => {
    if (!date) return "Not selected"
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)

    const [hour = "0"] = time?.split(":") ?? []
    const hourNum = Number.parseInt(hour)
    const ampm = hourNum >= 12 ? "PM" : "AM"
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum

    return `${formattedDate} at ${hour12}:00 ${ampm}`
  }

  const formatItemCount = (count: number) => {
    return `${count} item${count === 1 ? "" : "s"} selected`
  }

  const handleAddToCalendar = () => {
    if (!formData.tourDate) return

    const [hours = "0"] = formData.tourTime?.split(":") ?? []
    const startDate = new Date(formData.tourDate)
    startDate.setHours(Number.parseInt(hours), 0, 0, 0)
    const endDate = new Date(startDate)
    endDate.setHours(startDate.getHours() + 1)

    const event = {
      title: "Wedding Rental Tour",
      description: `Tour of wedding rental items at ${VENUE_ADDRESS}`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      location: VENUE_ADDRESS,
    }

    // Generate Google Calendar URL
    const googleUrl = new URL("https://calendar.google.com/calendar/render")
    googleUrl.searchParams.append("action", "TEMPLATE")
    googleUrl.searchParams.append("text", event.title)
    googleUrl.searchParams.append("details", event.description)
    googleUrl.searchParams.append("location", event.location)
    googleUrl.searchParams.append("dates", `${event.start.replace(/[-:]/g, "")}/${event.end.replace(/[-:]/g, "")}`)

    window.open(googleUrl.toString(), "_blank")
  }

  return (
    <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-16 h-16 text-rose-300" />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Tour Scheduled!</h2>
      <p className="text-muted-foreground mb-8">
        We&apos;re excited to show you our collection. A confirmation email has been sent with your tour details.
      </p>

      <div className="space-y-6 text-left max-w-lg mx-auto mb-8">
        <div className="grid gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Wedding Date</h3>
              <p className="text-muted-foreground">{formData.weddingDate?.toLocaleDateString()}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-500" onClick={() => onEdit(1)}>
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Tour Details</h3>
              <p className="text-muted-foreground">{formatDateTime(formData.tourDate, formData.tourTime)}</p>
              <p className="text-sm text-muted-foreground mt-1">{VENUE_ADDRESS}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-500" onClick={() => onEdit(3)}>
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Items to View</h3>
              <p className="text-muted-foreground">{formatItemCount(formData.selectedItems.length)}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-500" onClick={() => onEdit(2)}>
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button
          variant="outline"
          className="gap-2 bg-white border-gray-200 hover:bg-gray-100/50 min-w-[140px]" // Updated styling
          asChild
        >
          <Link href="/" className="whitespace-nowrap">
            {" "}
            {/* Added whitespace-nowrap */}
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </Button>
        <Button
          className="bg-rose-300 hover:bg-rose-400 gap-2 min-w-[140px]" // Added consistent width
          onClick={handleAddToCalendar}
        >
          <CalendarIcon className="w-4 h-4" />
          Add to Calendar
        </Button>
      </div>
    </Card>
  )
}

