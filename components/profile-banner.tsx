"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useMediaConfig } from "@/components/media-config-provider"

export const ProfileBanner = () => {
  const media = useMediaConfig()
  const handleResumeClick = () => {
    window.open("https://github.com/Vedag812", "_blank")
  }

  const handleLinkedInClick = () => {
    window.open("https://www.linkedin.com/in/vedant-agarwal-36bb18142", "_blank")
  }

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-netflix-red shadow-2xl">
            <Image
              src={media.profileImage}
              alt="Vedant Agarwal"
              width={256}
              height={256}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-netflix-red to-blue-500 opacity-20 blur-lg"></div>
        </div>

        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">Vedant Agarwal</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
            Sophomore Computer Science & Data Science student at SRMIST, passionate about AI, Machine Learning, and
            Blockchain technologies. Building innovative solutions and exploring the intersection of technology and
            creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleResumeClick}
              className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3 rounded flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              View GitHub
            </Button>
            <Button
              onClick={handleLinkedInClick}
              variant="outline"
              className="bg-gray-600/70 text-white border-gray-500 hover:bg-gray-500/70 font-semibold px-8 py-3 rounded flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              LinkedIn Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
