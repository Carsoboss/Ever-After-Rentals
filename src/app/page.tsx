import { Button } from "./_components/button"
import { Calendar, Eye, Facebook, Flower, Gift, HeartHandshake, Package } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
          <Flower className="h-6 w-6" />
          <span>Ever After Rentals</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link className="font-medium" href="#">
            Home
          </Link>
          <Link className="font-medium" href="#">
            Products
          </Link>
          <Link className="font-medium" href="#">
            About
          </Link>
          <Link className="font-medium" href="#">
            Schedule a Tour
          </Link>
        </nav>
        <div className="flex gap-4">
          <Button variant="ghost">Sign in</Button>
          <Button className="bg-rose-300 text-white hover:bg-rose-400">Get Started</Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full relative h-[30vh] md:h-[50vh] lg:h-[70vh]">
          <div className="absolute inset-0 z-0">
            <img
              src="/homepage.svg?height=720&width=1920"
              alt="Background"
              className="w-full h-full object-cover brightness-50"
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
                <Button className="bg-rose-300 text-white hover:bg-rose-400">Browse Products</Button>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                  Schedule a Tour
                </Button>
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
                  Let us know your event date so we can check availability for the items you're interested in.
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
                    We're more than just a rental company. We're your partner in creating unforgettable moments.
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
                <img
                  alt="Setup showcase"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  height="310"
                  src="/showcase.svg"
                  width="550"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Ever After Rentals. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-700" aria-label="Follow us on Facebook">
            <Facebook className="h-4 w-4" />
          </Link>
        </nav>
      </footer>
    </div>
  )
}


