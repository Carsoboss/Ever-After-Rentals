import { Package, Sparkles, ChevronRight, Flower, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "../_components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../_components/pricing_card"
import { Badge } from "../_components/badge"
import { Header } from "../_components/header"
import { Footer } from "../_components/footer"

export default function WeddingPricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-rose-50 to-white">
        <div className="container px-4 py-16 mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto pt-16">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900">
              Find Your Perfect Collection
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Discover our carefully curated collections designed to make your special day unforgettable. Each collection
              offers unique pieces that reflect your personal style and vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Basic Package */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4">
                  <Package className="h-10 w-10 text-rose-300" />
                </div>
                <CardTitle className="text-xl font-semibold text-center">Classic Package</CardTitle>
                <CardDescription className="text-center">
                  Essential decorations for a beautiful celebration
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-3xl font-bold text-center mb-6">$200</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">
                      <ChevronRight className="h-4 w-4 text-rose-300" />
                    </div>
                    <span>All non-specialty wedding decorations</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Link href="/schedule-tour" className="w-full">
                  <Button className="w-full bg-rose-300 hover:bg-rose-400 text-white">Schedule Tour</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Enhanced Package */}
            <Card className="border-2 border-rose-300 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <Badge className="bg-rose-300 hover:bg-rose-300 text-white px-3 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="pb-4 pt-6">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="h-10 w-10 text-rose-300" />
                </div>
                <CardTitle className="text-xl font-semibold text-center">Signature Package</CardTitle>
                <CardDescription className="text-center">
                  Enhanced decorations with select specialty pieces
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-3xl font-bold text-center mb-6">$250</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">
                      <ChevronRight className="h-4 w-4 text-rose-300" />
                    </div>
                    <span>All non-specialty wedding decorations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">
                      <ChevronRight className="h-4 w-4 text-rose-300" />
                    </div>
                    <span>Up to 2 specialty statement pieces</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Link href="/schedule-tour" className="w-full">
                  <Button className="w-full bg-rose-300 hover:bg-rose-400 text-white">Schedule Tour</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Premium Package */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4">
                  <Flower className="h-10 w-10 text-rose-300" />
                </div>
                <CardTitle className="text-xl font-semibold text-center">Premier Package</CardTitle>
                <CardDescription className="text-center">
                  Complete decoration suite with unlimited specialty items
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-3xl font-bold text-center mb-6">$300</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">
                      <ChevronRight className="h-4 w-4 text-rose-300" />
                    </div>
                    <span>All non-specialty wedding decorations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">
                      <ChevronRight className="h-4 w-4 text-rose-300" />
                    </div>
                    <span>Unlimited specialty statement pieces</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Link href="/schedule-tour" className="w-full">
                  <Button className="w-full bg-rose-300 hover:bg-rose-400 text-white">Schedule Tour</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/products" className="inline-flex items-center text-rose-500 hover:text-rose-600 font-medium">
              View All Products
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
