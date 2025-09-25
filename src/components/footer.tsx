import Link from "next/link"
import { Mail, Phone } from "lucide-react" // Assuming these are the icons used

const Footer = () => {
  return (
    <footer className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl">Cambia</span>
          </Link>
          <p className="text-muted-foreground leading-relaxed">
            Connecting Nigerian vendors with global communities worldwide. Authentic foods, secure payments,
            international delivery.
          </p>
        </div>
        <div className="space-y-2 pt-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>support@cambia.com</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>+234 (0) 800 CAMBIA-HELP</span>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">© 2025 Cambia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
