import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
    title: "Cambia - Nigerian Food Marketplace",
    description:
        "Connect with authentic Nigerian cuisine. Order from trusted vendors and enjoy traditional flavors delivered to your door."
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </Suspense>
        <Analytics />
        </body>
        </html>
    )
}
