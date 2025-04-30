/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client"

import { Button } from "../_components/button"
import { Card } from "../_components/card"
import { CheckCircle, Edit2, CalendarIcon, Home, Loader2 } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState, useRef } from "react"
import { api } from "~/trpc/react"
import toast from "react-hot-toast"
const VENUE_ADDRESS = "1048 E 420 S, Provo, UT 84606"

interface ConfirmationStepProps {
  formData: {
    weddingDate: Date | null
    selectedItems: string[]
    tourDate: Date | null
    tourTime: string
  }
  onEdit: (step: number) => void
}

export function ConfirmationStep({ formData, onEdit }: ConfirmationStepProps) {
  // State to track if operations are complete
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [operationType, setOperationType] = useState<'new' | 'update' | 'loading' | null>(null)
  const hasSubmittedRef = useRef(false)
  
  // Check if the user already has a tour
  const { data: existingTour, isLoading: isLoadingTour } = api.tours.getUserTour.useQuery()
  
  // Set initial loading state
  useEffect(() => {
    if (isLoadingTour) {
      setOperationType('loading')
    } else {
      // Reset operation type once data is loaded, if we're not in the middle of an operation
      if (operationType === 'loading' && !isSubmitting) {
        setOperationType(null)
      }
    }
  }, [isLoadingTour, operationType, isSubmitting])
  
  // Schedule a new tour
  const scheduleTourMutation = api.tours.scheduleTour.useMutation({
    onSuccess: () => {
      toast.success("Tour successfully scheduled!")
      setIsSubmitting(false)
    },
    onError: (error) => {
      toast.error(`Failed to schedule tour: ${error.message}`)
      setIsSubmitting(false)
      hasSubmittedRef.current = false
    }
  })
  
  // Update an existing tour
  const updateTourMutation = api.tours.updateTour.useMutation({
    onSuccess: () => {
      setIsSubmitting(false)
    },
    onError: (error) => {
      toast.error(`Failed to update tour: ${error.message}`)
      setIsSubmitting(false)
      hasSubmittedRef.current = false
    }
  })
  
  // Create date with time for API calls
  const getFullDateTime = () => {
    if (!formData.tourDate) return null
    const [hour = "0"] = formData.tourTime?.split(":") ?? []
    const tourDateTime = new Date(formData.tourDate)
    tourDateTime.setHours(Number.parseInt(hour), 0, 0, 0)
    return tourDateTime
  }
  
  // Handle submission once when needed
  useEffect(() => {
    // Skip if missing required data or already submitted or still loading
    if (!formData.tourDate || !formData.weddingDate || hasSubmittedRef.current || isSubmitting || isLoadingTour) {
      return
    }
    
    const tourDateTime = getFullDateTime()
    if (!tourDateTime) return
    
    // Prepare the payload
    const payload = {
      tourDateTime,
      weddingDateTime: formData.weddingDate,
      selectedItemIds: formData.selectedItems
    }
    
    // Only submit if we haven't already done so
    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true
      setIsSubmitting(true)
      
      if (existingTour) {
        // Update existing tour
        setOperationType('update')
        updateTourMutation.mutate(payload)
      } else {
        // Create new tour
        setOperationType('new')
        scheduleTourMutation.mutate(payload)
      }
    }
  }, [
    formData.tourDate, 
    formData.weddingDate, 
    existingTour,
    isLoadingTour, 
    isSubmitting
  ])

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

  // Show loading state while processing
  if (isSubmitting || isLoadingTour) {
    return (
      <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-rose-300 mb-4" />
          <h2 className="text-xl font-medium">
            {operationType === 'update' ? "Fetching your tour..." :
             operationType === 'new' ? "Scheduling your tour..." :
             "Loading your tour details..."}
          </h2>
          <p className="text-muted-foreground mt-2">
            {operationType === 'loading' ? 
              "Please wait while we retrieve your information." :
              "Please wait while we confirm your booking."}
          </p>
        </div>
      </Card>
    )
  }

  // Once everything is done, show the confirmation screen
  return (
    <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-16 h-16 text-rose-300" />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Tour Scheduled!</h2>
      <p className="text-muted-foreground mb-8">
        We&apos;re excited to show you our collection. See you soon!
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
          className="gap-2 bg-white border-gray-200 hover:bg-gray-100/50 min-w-[140px]"
          asChild
        >
          <Link href="/" className="whitespace-nowrap">
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </Button>
        <Button
          className="bg-rose-300 hover:bg-rose-400 gap-2 min-w-[140px]"
          onClick={handleAddToCalendar}
        >
          <CalendarIcon className="w-4 h-4" />
          Add to Calendar
        </Button>
      </div>
    </Card>
  )
}

