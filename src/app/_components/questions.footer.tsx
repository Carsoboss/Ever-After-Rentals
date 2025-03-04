import { Phone, Mail } from "lucide-react"

export function QuestionsFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-rose-100 shadow-sm py-3 px-4 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-8 text-sm">
          <p className="font-medium">Questions about your tour?</p>

          <div className="flex items-center gap-6">
            <a
              href="tel:+18166803252"
              className="flex items-center gap-2 text-muted-foreground hover:text-rose-400 transition-colors"
            >
              <Phone className="w-4 h-4" />
              (816) 680-3252
            </a>

            <a
              href="mailto:vallennttinne.mj@gmail.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-rose-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              vallennttinne.mj@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

