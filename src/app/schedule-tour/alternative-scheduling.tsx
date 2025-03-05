import { Phone, Mail } from "lucide-react"
import React from "react"
export function AlternativeScheduling() {
  return (
    <div className="bg-rose-50/50 py-3 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <span className="text-sm text-muted-foreground text-center">
            Need a different time? Contact us:
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="tel:+18166803252"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-rose-500 transition-colors text-center"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>(916) 680-3252</span>
            </a>
            <a
              href="mailto:vallennttinne.mj@gmail.com"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-rose-500 transition-colors text-center"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>vallennttinne.mj@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
  
  