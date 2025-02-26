import { Header } from "./_components/header"
import { Button } from "./_components/button"
import { Calendar, Eye, Gift, HeartHandshake, Package, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <section className="w-full relative h-[30vh] md:h-[50vh] lg:h-[70vh]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/homepage.svg"
              alt="Background"
              className="w-full h-full object-cover brightness-50"
              fill
              priority
            />
          </div>
          <div className="container mx-auto relative z-10 px-4 md:px-6 h-full flex items-center">
            <div className="flex flex-col items-center justify-center space-y-4 text-center w-full">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-6xl/none text-white">
                  Make Your Special Day Perfect
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 text-sm md:text-xl">
                  Create unforgettable moments with our elegant event rentals. From intimate weddings to enchanting
                  celebrations, we help bring your vision to life.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/products">
                  <Button className="bg-rose-300 text-white hover:bg-rose-400">Browse Products</Button>
                </Link>
                <Link href="/schedule-tour">
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                    Schedule a Tour
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-rose-50 py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-rose-300 p-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">1. Check Availability</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Let us know your event date so we can check availability for the items you&apos;re interested in.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-rose-300 p-4">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">2. Select Your Items</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Explore our extensive selection of elegant table settings, decor pieces, and accessories to create your perfect event.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-rose-300 p-4">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">3. Take a Look</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Come and see your rental items in person, visualize your perfect setup, and finalize all the details
                  for your special day.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm">Why Choose Us</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Elevate Your Event Experience</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    We&apos;re more than just a rental company. We&apos;re your partner in creating unforgettable moments.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-4">
                    <Gift className="h-6 w-6 text-rose-300" />
                    <div className="space-y-1">
                      <h3 className="font-bold">Premium Selection</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Curated collection of high-quality rentals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <HeartHandshake className="h-6 w-6 text-rose-300" />
                    <div className="space-y-1">
                      <h3 className="font-bold">Dedicated Support</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Personal attention and support throughout your rental experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="overflow-hidden rounded-xl">
                  <Image
                    alt="Setup showcase"
                    className="aspect-video object-cover object-center scale-105 hover:scale-110 transition-transform duration-500"
                    height={310}
                    width={550}
                    src="/showcase.svg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Ever After Rentals. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-6 items-center">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">Questions? Contact us</span>
          </div>
          <a href="tel:+18166803252" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <Phone className="h-4 w-4" />
            <span className="text-xs">(816) 680-3252</span>
          </a>
          <a href="mailto:vallennttinne.mj@gmail.com" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <Mail className="h-4 w-4" />
            <span className="text-xs">vallennttinne.mj@gmail.com</span>
          </a>
          <a 
            href="https://www.facebook.com/profile.php?id=61571500715684" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </nav>
      </footer>
    </div>
  )
}


