import Link from "next/link"
import { Flower } from "lucide-react"
import { Button } from "./button"

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-6 bg-white shadow-sm fixed w-full top-0 z-50">
      <Link className="flex items-center gap-2 text-lg font-semibold" href="/">
        <Flower className="h-6 w-6" />
        <span>Ever After Rentals</span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        <Link className="font-medium" href="/">
          Home
        </Link>
        <Link className="font-medium" href="/products">
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
  )
} 