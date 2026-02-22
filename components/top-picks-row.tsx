"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useEffect, useMemo, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { scrollContainerBy, useHorizontalScroll } from "@/hooks/use-horizontal-scroll"
import { useMediaConfig } from "./media-config-provider"
import gsap from "gsap"

interface TopPicksRowProps {
  profile: string
  title?: string
}

export const TopPicksRow = ({ profile, title }: TopPicksRowProps) => {
  const router = useRouter()
  const { profiles } = useMediaConfig()
  const { ref: scrollRef, scrollState } = useHorizontalScroll<HTMLDivElement>()
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const topPicks = useMemo(() => {
    const profileConfig = profiles[profile as keyof typeof profiles]
    if (!profileConfig) return []

    const basePicks = [
      { title: "About Me", imgSrc: profileConfig.backgrounds.about, route: "/about" },
      { title: "Skills", imgSrc: profileConfig.backgrounds.skills, route: "/skills" },
      { title: "Projects", imgSrc: profileConfig.backgrounds.projectsFeatured, route: "/projects" },
      { title: "Experience", imgSrc: profileConfig.backgrounds.experience, route: "/experience" },
    ]

    if (profile !== "student") {
      basePicks.push({ title: "Contact", imgSrc: profileConfig.backgrounds.contact, route: "/contact" })
    }

    return basePicks
  }, [profiles, profile])

  // 3D scroll perspective effect
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
      const containerRect = container.getBoundingClientRect()
      const centerX = containerRect.left + containerRect.width / 2

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect()
        const cardCenterX = cardRect.left + cardRect.width / 2
        const distFromCenter = (cardCenterX - centerX) / containerRect.width

        // Cards away from center get rotated and slightly scaled down
        const rotateY = distFromCenter * 25 // max 25deg rotation
        const scale = 1 - Math.abs(distFromCenter) * 0.15 // min 0.85 scale
        const translateZ = -Math.abs(distFromCenter) * 50 // push back

        gsap.to(card, {
          rotateY: rotateY,
          scale: Math.max(scale, 0.85),
          z: translateZ,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        })
      })
    }

    // Run once on mount
    handleScroll()

    container.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    return () => {
      container.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [scrollRef, topPicks])

  // Staggered entrance animation
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    if (cards.length === 0) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, rotateX: 15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2,
      }
    )
  }, [topPicks])

  return (
    <div className="bg-netflix-black px-4 sm:px-6 py-6 sm:py-8">
      <h2 className="text-white text-xl sm:text-2xl font-semibold mb-6 animate-fade-in">
        {title || `Today's Top Picks for ${profile}`}
      </h2>
      <div className="relative" style={{ perspective: "1000px" }}>
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
          style={{ transformStyle: "preserve-3d" }}
        >
          {topPicks.map((pick, index) => (
            <div
              key={`${pick.title}-${index}`}
              ref={(el) => { cardRefs.current[index] = el }}
              className="relative min-w-[220px] sm:min-w-[280px] h-[140px] sm:h-[180px] rounded-xl overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-2xl hover:shadow-netflix-red/20 group snap-start"
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
              onClick={() => router.push(pick.route)}
            >
              <Image
                src={pick.imgSrc || "/placeholder.svg"}
                alt={pick.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <span className="text-white text-sm sm:text-lg font-semibold drop-shadow-lg">{pick.title}</span>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-netflix-red/60 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
