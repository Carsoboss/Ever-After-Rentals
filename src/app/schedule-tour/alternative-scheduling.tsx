import { Phone, Mail } from "lucide-react"

export function AlternativeScheduling() {
  return (
    <div className="bg-rose-50/50 py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Need a Different Time?</h2>
          <p className="text-muted-foreground mb-8">
            Can&apos;t find a suitable time? Contact us directly and we&apos;ll be happy to accommodate your schedule.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="tel:+18166803252"
              className="flex items-center gap-2 text-foreground hover:text-rose-500 transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span>(816) 680-3252</span>
            </a>
            <a
              href="mailto:vallennttinne.mj@gmail.com"
              className="flex items-center gap-2 text-foreground hover:text-rose-500 transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>vallennttinne.mj@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
  
  