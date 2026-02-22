"use client"

import Image from "next/image"
import { Github, Linkedin } from "lucide-react"
import { useMediaConfig } from "@/components/media-config-provider"

export function ProfileBanner() {
  const media = useMediaConfig()

  return (
    <div className="max-w-4xl px-6 sm:px-10 pb-8 space-y-4">
      {/* Profile photo */}
      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[3px] border-white/30 shadow-2xl">
        <Image
          src={media.profileImage}
          alt="Vedant Agarwal"
          width={112}
          height={112}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name & description */}
      <div className="space-y-2">
        <h1 className="text-white text-3xl sm:text-5xl font-bold tracking-tight drop-shadow-xl">
          Vedant Agarwal
        </h1>
        <p className="text-gray-200 text-sm sm:text-lg max-w-xl leading-relaxed drop-shadow-lg">
          Data Science & AI/ML • Full Stack Developer • B.Tech CSE (DS) @ SRMIST
        </p>
      </div>

      {/* Social links */}
      <div className="flex gap-3 pt-1">
        <a
          href="https://github.com/Vedag812"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/vedant-agarwal-36bb18142"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </a>
      </div>
    </div>
  )
}
