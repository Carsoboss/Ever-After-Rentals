"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "../_components/button"
import { Card, CardContent } from "../_components/card"
import { Badge } from "../_components/badge"
import { cn } from "../../lib/utils"

interface RentalItem {
  id: number
  name: string
  category: string
  description: string
  price?: string
  image: string
  isSpecialtyItem?: boolean
}
const IMAGE_BASE_URL = "https://kzmow9wdn4bk644umu7c.lite.vusercontent.net/placeholder.svg?height=400&width=400"

const rentalItems: RentalItem[] = [
// Specialty Items
{
  id: 1,
  name: "Large Gold Photo Frames",
  category: "Specialty Items",
  description: "Elegant gold frames perfect for welcome signs or photo displays. Limited availability.",
  price: "Inquire for pricing",
  image: "/placeholder.svg?height=400&width=400",
  isSpecialtyItem: true,
},
{
  id: 2,
  name: "'You + Me' Sign",
  category: "Specialty Items",
  description: "Large decorative sign perfect for photo opportunities. A stunning focal point for your venue.",
  price: "Inquire for pricing",
  image: "/placeholder.svg?height=400&width=400",
  isSpecialtyItem: true,
},
{
  id: 3,
  name: "Stainless Steel Chafers",
  category: "Specialty Items",
  description: "Professional 4-quart capacity chafers, perfect for keeping dishes at the ideal temperature.",
  price: "Inquire for pricing",
  image: "/placeholder.svg?height=400&width=400",
  isSpecialtyItem: true,
},

// Table Decor
{
  id: 4,
  name: "White Rectangle Tablecloths",
  category: "Table Decor",
  description: '60" x 126" crisp white tablecloths perfect for rectangular tables',
  image: "/placeholder.svg?height=400&width=400",
},
{
  id: 5,
  name: "White Round Tablecloths",
  category: "Table Decor",
  description: '108" round tablecloths ideal for standard round tables',
  image: "/placeholder.svg?height=400&width=400",
},
{
  id: 6,
  name: "Elegant Table Runners",
  category: "Table Decor",
  description: "Available in various colors to complement your wedding theme",
  image: "/placeholder.svg?height=400&width=400",
},
{
  id: 7,
  name: "Gold Candlestick Holders",
  category: "Table Decor",
  description: "Classic gold candlestick holders for elegant table settings",
  image: "/placeholder.svg?height=400&width=400",
},
{
  id: 8,
  name: "Table Number/Picture Holders",
  category: "Table Decor",
  description: "Versatile holders perfect for table numbers or special photos",
  image: "/placeholder.svg?height=400&width=400",
},

// Centerpieces & Vases
{
  id: 9,
  name: "Glass Bud Vases",
  category: "Centerpieces & Vases",
  description: "Perfect for single stems or small floral arrangements",
  image: "/placeholder.svg?height=400&width=400",
},
{
  id: 10,
  name: "Wooden Centerpieces",
  category: "Centerpieces & Vases",
  description: "11-13 inch rustic wooden centerpieces for a natural touch",
  image: "/placeholder.svg?height=400&width=400",
},
{
  id: 11,
  name: "Glass Cylinder Vases",
  category: "Centerpieces & Vases",
  description: "Various sizes available for diverse floral arrangements",
  image: "/placeholder.svg?height=400&width=400",
},

// Serving & Dinnerware
{
  id: 12,
  name: "Stainless Steel Chafers",
  category: "Serving & Dinnerware",
  description: "4-quart capacity, perfect for keeping dishes warm",
  price: "Inquire for pricing",
  image: "/placeholder.svg?height=400&width=400",
  isSpecialtyItem: true,
},
{
  id: 13,
  name: "Gold Silverware Sets",
  category: "Serving & Dinnerware",
  description: "Elegant gold-finished flatware for a luxurious dining experience",
  image: "/placeholder.svg?height=400&width=400",
},
{
  id: 14,
  name: "Dinner & Dessert Plate Sets",
  category: "Serving & Dinnerware",
  description: "Matching dinner and dessert plates for a coordinated table setting",
  image: "/placeholder.svg?height=400&width=400",
},
{
  id: 15,
  name: "Serving Utensils",
  category: "Serving & Dinnerware",
  description: "Various serving pieces to complement your dining needs",
  image: "/placeholder.svg?height=400&width=400",
},

// Decorative Elements
{
  id: 16,
  name: "Large Gold Photo Frames",
  category: "Decorative Elements",
  description: "Elegant gold frames perfect for welcome signs or photo displays",
  price: "Inquire for pricing",
  image: "/placeholder.svg?height=400&width=400",
  isSpecialtyItem: true,
},
{
  id: 17,
  name: "'You + Me' Sign",
  category: "Decorative Elements",
  description: "Large decorative sign perfect for photo opportunities",
  price: "Inquire for pricing",
  image: "/placeholder.svg?height=400&width=400",
  isSpecialtyItem: true,
},
{
  id: 18,
  name: "Artificial Eucalyptus Collection",
  category: "Decorative Elements",
  description: "Mixed eucalyptus leaves and stems for natural-looking arrangements",
  image: "/placeholder.svg?height=400&width=400",
},
{
  id: 19,
  name: "Artificial Green Garlands",
  category: "Decorative Elements",
  description: "Lush green garlands for tables or venue decoration",
  image: "/placeholder.svg?height=400&width=400",
},

// Candles & Lighting
{
  id: 20,
  name: "White Pillar Candles",
  category: "Candles & Lighting",
  description: "10-inch unscented white candles for candlestick holders",
  image: "/placeholder.svg?height=400&width=400",
},
{
  id: 21,
  name: "Tea Light Holders",
  category: "Candles & Lighting",
  description: "Glass tea light holders for ambient lighting",
  image: "/placeholder.svg?height=400&width=400",
},
{
  id: 22,
  name: "Floating Candles",
  category: "Candles & Lighting",
  description: "Perfect for water features and cylinder vases",
  image: "/placeholder.svg?height=400&width=400",
},
].map(item => ({
  ...item,
  image: IMAGE_BASE_URL
}))

const categories = [
  "Specialty Items",
  "Table Decor",
  "Centerpieces & Vases",
  "Serving & Dinnerware",
  "Decorative Elements",
  "Candles & Lighting",
]

interface ItemSelectionStepProps {
  selectedItems: number[]
  onNext: (items: number[]) => void
  onBack: () => void
}

export function ItemSelectionStep({ selectedItems, onNext, onBack }: ItemSelectionStepProps) {
  const [selected, setSelected] = useState<number[]>(selectedItems)

  const toggleItem = (itemId: number) => {
    setSelected((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Select Items to View</h2>
        <p className="text-muted-foreground">Choose the items you&apos;d like to see during your tour</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {rentalItems.map((item) => (
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
              {item.isSpecialtyItem && (
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

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="bg-rose-300 hover:bg-rose-400"
          onClick={() => onNext(selected)}
          disabled={selected.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

