"use client"

import { Card, CardContent } from "../_components/card"
import { Badge } from "../_components/badge"
import Image from "next/image"
import Link from "next/link"
import { cn } from "../../lib/utils"
import { Header } from ".././_components/header"
import React from "react"

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

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = React.useState("Specialty Items")

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-16">
      <Header />
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-rose-100 rounded-full blur-3xl opacity-60" />
          <h1 className="text-4xl font-bold mb-4 relative">Wedding Rental Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg relative">
            Transform your special day with our carefully curated collection of wedding rentals.
          </p>
        </div>

        {/* Category Selector */}
        <div className="mb-12 relative">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-6 py-3 rounded-full transition-all duration-300",
                  activeCategory === category 
                    ? "bg-rose-300 text-white shadow-lg scale-105 hover:bg-rose-400" 
                    : "bg-white shadow hover:bg-rose-100 hover:shadow-md"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Decorative Element */}
        <div className="flex items-center justify-center mb-12">
          <div className="h-px w-16 bg-rose-200" />
          <div className="px-4">
            <div className="w-2 h-2 rotate-45 bg-rose-300" />
          </div>
          <div className="h-px w-16 bg-rose-200" />
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
          {rentalItems
            .filter((item) => item.category === activeCategory)
            .map((item) => (
              <Link href={`/rentals/${item.id}`} key={item.id} className="group">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/50 backdrop-blur-sm">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.isSpecialtyItem && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-rose-300 text-white border-none">Specialty Item</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                    {item.price && <p className="text-rose-500 font-medium">{item.price}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="max-w-3xl mx-auto text-center py-16">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-100 rounded-full blur-3xl opacity-20" />
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 relative">Love What You See?</h2>
            <p className="text-muted-foreground text-lg mb-0 relative">
              Let&apos;s bring your vision to life. Schedule a tour to explore our collection in person.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed CTA Button */}
      <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <Link
          href="/schedule-tour"
          className={cn(
            "group flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium",
            "bg-rose-300 hover:bg-rose-400 transition-all duration-300",
            "shadow-lg hover:shadow-xl hover:-translate-y-0.5",
          )}
        >
          <span>Schedule a Tour</span>
          <svg
            className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
} 