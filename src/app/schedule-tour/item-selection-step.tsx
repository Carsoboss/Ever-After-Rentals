"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "../_components/button"
import { Card, CardContent } from "../_components/card"
import { Badge } from "../_components/badge"
import { cn } from "../../lib/utils"
import { api } from "~/trpc/react"
import { Loader2 } from "lucide-react"
import React from "react"

interface ItemSelectionStepProps {
  selectedItems: string[]
  onNext: (items: string[]) => void
  onBack: () => void
}

export function ItemSelectionStep({ selectedItems, onNext, onBack }: ItemSelectionStepProps) {
  const [selected, setSelected] = useState<string[]>(selectedItems)
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false)

  // Query available items
  const { data: items, isLoading } = api.tours.selectTourItems.useQuery({
    selectedItemIds: [],
  }, {
    staleTime: Infinity,
  });

  // Track initial load
  React.useEffect(() => {
    if (items && !hasLoadedInitially) {
      setHasLoadedInitially(true)
    }
  }, [items, hasLoadedInitially])

  const toggleItem = (itemId: string) => {
    setSelected((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Select Items to View</h2>
        <p className="text-muted-foreground">Choose the items you&apos;d like to see during your tour</p>
      </div>

      {!hasLoadedInitially ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-rose-300" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {items?.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl",
                "bg-white/50 backdrop-blur-sm",
                selected.includes(item.id) ? "ring-2 ring-rose-300" : "",
              )}
              onClick={() => toggleItem(item.id)}
            >
              <div className="aspect-square relative overflow-hidden">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                {item.isSpecialty && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-rose-300 text-white border-none">Specialty Item</Badge>
                  </div>
                )}
                {selected.includes(item.id) && (
                  <div className="absolute inset-0 bg-rose-300/20 flex items-center justify-center">
                    <Badge className="bg-rose-300 text-white border-none">Selected</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="bg-rose-300 hover:bg-rose-400"
          onClick={() => onNext(selected)}
          disabled={selected.length === 0 || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

