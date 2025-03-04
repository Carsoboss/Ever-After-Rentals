"use client"

import { Card, CardContent } from "../_components/card"
import { Badge } from "../_components/badge"
import Image from "next/image"
import Link from "next/link"
import { cn } from "../../lib/utils"
import { Header } from ".././_components/header"
import React from "react"
import { api } from "~/trpc/react"
import { LoadingSpinner } from "../_components/loading"
import type { RentalItem } from "~/server/api/routers/rentals"

// Add category display mapping with ordered categories
const CATEGORY_ORDER = [
  "SPECIALTY_ITEMS",
  "TABLE_DECOR",
  "CENTERPIECES_VASES",
  "SERVING_DINNERWARE",
  "DECORATIVE_ELEMENTS",
  "CANDLES_LIGHTING",
] as const;

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  SPECIALTY_ITEMS: "Specialty Items",
  TABLE_DECOR: "Table Decor",
  CENTERPIECES_VASES: "Centerpieces & Vases",
  SERVING_DINNERWARE: "Serving & Dinnerware",
  DECORATIVE_ELEMENTS: "Decorative Elements",
  CANDLES_LIGHTING: "Candles & Lighting",
}

interface ProcessedRentalItem extends RentalItem {
  category: string; // This will hold the display name version of the category
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = React.useState("Specialty Items")
  
  const { data: rentalItems = [], isLoading } = api.rentals.getAllProducts.useQuery()

  // Process items to handle specialty items and categories
  const processedItems = React.useMemo(() => {
    const items: ProcessedRentalItem[] = []
    
    rentalItems.forEach((item: RentalItem) => {
      // Add item to its original category with proper display name
      items.push({
        ...item,
        category: CATEGORY_DISPLAY_NAMES[item.category] ?? item.category
      })
      
      // If it's a specialty item, add it to Specialty Items category as well
      if (item.isSpecialty) {
        items.push({
          ...item,
          category: "Specialty Items"
        })
      }
    })
    
    return items
  }, [rentalItems])

  // Modified categories extraction to maintain order
  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(processedItems.map(item => item.category))]
    return uniqueCategories.sort((a, b) => {
      // Ensure "Specialty Items" is always first
      if (a === "Specialty Items") return -1;
      if (b === "Specialty Items") return 1;
      // For other categories, maintain the order from CATEGORY_ORDER
      const aIndex = CATEGORY_ORDER.findIndex(cat => CATEGORY_DISPLAY_NAMES[cat] === a);
      const bIndex = CATEGORY_ORDER.findIndex(cat => CATEGORY_DISPLAY_NAMES[cat] === b);
      return aIndex - bIndex;
    });
  }, [processedItems])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-16">
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

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
          {processedItems
            .filter((item) => item.category === activeCategory)
            .map((item) => (
              <Link href={`/rentals/${item.name}`} key={`${item.name}-${item.category}`} className="group">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/50 backdrop-blur-sm">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.isSpecialty && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-rose-300 text-white border-none">Specialty Item</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                    {item.price && (
                      <p className="text-rose-500 font-medium">
                        Inquire for pricing
                      </p>
                    )}
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