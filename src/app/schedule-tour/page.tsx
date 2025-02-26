"use client"

import { useState } from "react"
import { WeddingDateStep } from "./wedding-date-step"
import { ItemSelectionStep } from "./item-selection-step"
import { TourDateStep } from "./tour-date-step"
import { ConfirmationStep } from "./confirmation-step"
import { AlternativeScheduling } from "./alternative-scheduling"

interface EditMode {
  isEditing: boolean
  returnToStep: number
}

export default function ScheduleTour() {
  const [step, setStep] = useState(1)
  const [editMode, setEditMode] = useState<EditMode>({ isEditing: false, returnToStep: 4 })
  const [formData, setFormData] = useState({
    weddingDate: null as Date | null,
    selectedItems: [] as number[],
    tourDate: null as Date | null,
    tourTime: "" as string,
  })

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (editMode.isEditing) {
      setStep(editMode.returnToStep)
      setEditMode({ isEditing: false, returnToStep: 4 })
    } else {
      setStep((prev) => prev + 1)
    }
  }

  const prevStep = () => setStep((prev) => prev - 1)

  const handleEdit = (stepNumber: number) => {
    setEditMode({ isEditing: true, returnToStep: 4 })
    setStep(stepNumber)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-16">
      <div className="container mx-auto py-12 px-4 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-rose-100 rounded-full blur-3xl opacity-60" />
            <h1 className="text-4xl font-bold mb-4 relative">Schedule Your Tour</h1>
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-16 rounded-full transition-colors ${i <= step ? "bg-rose-300" : "bg-rose-100"}`}
                />
              ))}
            </div>
          </div>

          {step === 1 && (
            <WeddingDateStep
              weddingDate={formData.weddingDate}
              onNext={(date) => {
                updateFormData({ weddingDate: date })
                nextStep()
              }}
            />
          )}

          {step === 2 && (
            <ItemSelectionStep
              selectedItems={formData.selectedItems}
              onNext={(items) => {
                updateFormData({ selectedItems: items })
                nextStep()
              }}
              onBack={prevStep}
            />
          )}

          {step === 3 && (
            <TourDateStep
              tourDate={formData.tourDate}
              tourTime={formData.tourTime}
              onNext={(date, time) => {
                updateFormData({ tourDate: date, tourTime: time })
                nextStep()
              }}
              onBack={prevStep}
            />
          )}

          {step === 4 && <ConfirmationStep formData={formData} onEdit={handleEdit} />}
        </div>
      </div>

      <AlternativeScheduling />
    </div>
  )
}

