"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, User, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This will be managed by your auth system
  const [userType, setUserType] = useState<"customer" | "vendor" | "shipping">("customer")

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About" },
  ]

  const userSpecificItems = {
    customer: [
      { href: "/orders", label: "My Orders" },
      { href: "/cart", label: "Cart" },
    ],
    vendor: [
      { href: "/vendors", label: "Dashboard" },
      { href: "/vendors/products/new", label: "Add Product" },
    ],
    shipping: [
      { href: "/shipping", label: "Dashboard" },
      { href: "/shipping/orders", label: "Orders" },
    ],
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-600 to-orange-500" />
            <span className="font-bold text-xl">DiasporaFood</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth & User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* User-specific navigation */}
                {userSpecificItems[userType].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Cart for customers */}
                {userType === "customer" && (
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
                  </Button>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">2</Badge>
                </Button>

                {/* User Menu */}
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {/* Main Navigation */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="border-t pt-4">
                  {isLoggedIn ? (
                    <>
                      {/* User-specific mobile navigation */}
                      {userSpecificItems[userType].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="text-lg font-medium transition-colors hover:text-primary block py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}

                      <div className="flex flex-col space-y-2 pt-4">
                        <Button variant="ghost" className="justify-start">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                        <Button variant="ghost" className="justify-start">
                          <Bell className="h-4 w-4 mr-2" />
                          Notifications
                          <Badge className="ml-auto">2</Badge>
                        </Button>
                        {userType === "customer" && (
                          <Button variant="ghost" className="justify-start">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Cart
                            <Badge className="ml-auto">3</Badge>
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button asChild className="justify-start">
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
