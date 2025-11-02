"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { scrollContainerBy, useHorizontalScroll } from "@/hooks/use-horizontal-scroll"
import { useMediaConfig } from "./media-config-provider"

interface TopPicksRowProps {
  profile: string
  title?: string
}

export const TopPicksRow = ({ profile, title }: TopPicksRowProps) => {
  const router = useRouter()
  const { profiles } = useMediaConfig()
  const { ref: scrollRef, scrollState } = useHorizontalScroll<HTMLDivElement>()

  // Dynamically generate picks from media config
  const topPicks = useMemo(() => {
    const profileConfig = profiles[profile as keyof typeof profiles]
    if (!profileConfig) return []

    const basePicks = [
      { title: "About Me", imgSrc: profileConfig.backgrounds.about, route: "/about" },
      { title: "Skills", imgSrc: profileConfig.backgrounds.skills, route: "/skills" },
      { title: "Projects", imgSrc: profileConfig.backgrounds.projectsFeatured, route: "/projects" },
      { title: "Experience", imgSrc: profileConfig.backgrounds.experience, route: "/experience" },
    ]

    // Only add Contact for recruiter and explorer profiles, not for student
    if (profile !== "student") {
      basePicks.push({ title: "Contact", imgSrc: profileConfig.backgrounds.contact, route: "/contact" })
    }

    return basePicks
  }, [profiles, profile])

  return (
    <div className="bg-netflix-black px-4 sm:px-6 py-6 sm:py-8">
      <h2 className="text-white text-xl sm:text-2xl font-semibold mb-6 animate-fade-in">
        {title || `Today's Top Picks for ${profile}`}
      </h2>
      <div className="relative">
        <div className={`scroll-gradient-left ${scrollState.canScrollLeft ? "opacity-100" : "opacity-0"}`} />
        <div className={`scroll-gradient-right ${scrollState.canScrollRight ? "opacity-100" : "opacity-0"}`} />
        <button
          type="button"
          className={`scroll-nav-button left-2 ${scrollState.canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => scrollContainerBy(scrollRef, -280)}
          aria-label="Scroll picks left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          className={`scroll-nav-button right-2 ${scrollState.canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => scrollContainerBy(scrollRef, 280)}
          aria-label="Scroll picks right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div
          ref={scrollRef}
          className="horizontal-scroll-container flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
        >
          {topPicks.map((pick, index) => (
            <div
              key={`${pick.title}-${index}`}
              className="relative min-w-[200px] sm:min-w-[240px] h-[150px] sm:h-[200px] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-netflix-red/20 group snap-start"
              onClick={() => router.push(pick.route)}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
            <Image
              src={pick.imgSrc || "/placeholder.svg"}
              alt={pick.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-sm sm:text-xl font-semibold text-center px-4">{pick.title}</span>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  )
}
