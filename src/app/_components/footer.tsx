import { Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">© 2025 Ever After Rentals. All rights reserved.</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">© 2025 Ever After Rentals</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6 items-center">
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs hidden sm:inline">Questions? Contact us</span>
          <span className="text-xs sm:hidden">Contact:</span>
        </div>
        <a href="tel:+19166803252" className="flex items-center gap-1 text-muted-foreground hover:text-foreground" aria-label="Call us">
          <Phone className="h-4 w-4" />
          <span className="text-xs hidden sm:inline">(916) 680-3252</span>
        </a>
        <a href="mailto:vallennttinne.mj@gmail.com" className="flex items-center gap-1 text-muted-foreground hover:text-foreground" aria-label="Email us">
          <Mail className="h-4 w-4" />
          <span className="text-xs hidden sm:inline">vallennttinne.mj@gmail.com</span>
        </a>
        <a 
          href="https://www.facebook.com/profile.php?id=61571500715684" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-muted-foreground hover:text-foreground"
          aria-label="Visit our Facebook page"
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
  )
} 