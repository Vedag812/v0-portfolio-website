import type React from "react"
import { NetflixNavbar } from "./netflix-navbar"
import { ScrollProgressBar } from "./scroll-progress-bar"

interface NetflixLayoutProps {
  children: React.ReactNode
}

export function NetflixLayout({ children }: NetflixLayoutProps) {
  return (
    <div className="min-h-screen bg-netflix-black">
      <ScrollProgressBar />
      <NetflixNavbar />
      <div className="pt-16">{children}</div>
    </div>
  )
}
