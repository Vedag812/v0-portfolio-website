import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { AccessibilityProvider } from "@/components/accessibility-provider"
import { ScrollProgress } from "@/components/scroll-progress"
import { BackToTop } from "@/components/back-to-top"
import { KeyboardNavigationHint } from "@/components/keyboard-navigation-hint"
import { MediaConfigProvider } from "@/components/media-config-provider"
import { getMediaConfig } from "@/lib/media"
import { ThemeProvider } from "@/components/theme-toggle"
import { KonamiCode } from "@/components/konami-code"

export const metadata: Metadata = {
  title: "Vedant Agarwal - Portfolio",
  description: "Computer Science & Data Science Student | AI & Machine Learning Enthusiast",
  generator: "v0.app",
}

export const dynamic = "force-dynamic"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const mediaConfig = await getMediaConfig()
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider>
          <MediaConfigProvider initialConfig={mediaConfig}>
            <KonamiCode />
            <ScrollProgress />
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            <AccessibilityProvider />
            <BackToTop />
            <KeyboardNavigationHint />
            <Analytics />
          </MediaConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
