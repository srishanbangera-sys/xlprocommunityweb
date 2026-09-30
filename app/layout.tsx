import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"


export const metadata: Metadata = {
  title: "XL Pro",
  description:
    "XL Pro Community is a developer collective pushing boundaries with code, hardware, and product thinking. Join a league of builders who ship fast, collaborate, and level up together.",
  generator: "XL Pro Community",
  icons: {
    icon: "/edited-photo.ico",       // favicon in public folder
    shortcut: "/edited-photo.ico",   // shortcut icon for browsers
    apple: "/edited-photo.ico",      // iOS Safari / PWA icon
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark antialiased`}
    >
      <body className="font-sans">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
