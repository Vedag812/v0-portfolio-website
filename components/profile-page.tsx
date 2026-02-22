"use client"

import { useRouter } from "next/navigation"
import { ProfileBanner } from "./profile-banner"
import { TopPicksRow } from "./top-picks-row"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useMediaConfig } from "./media-config-provider"
import { useEffect, useState } from "react"

interface ProfilePageProps {
  profileName: string
}

export function ProfilePage({ profileName }: ProfilePageProps) {
  const router = useRouter()
  const { profiles } = useMediaConfig()
  const [backgroundGif, setBackgroundGif] = useState("")

  useEffect(() => {
    const profileConfig = profiles[profileName as keyof typeof profiles]
    if (profileConfig) {
      setBackgroundGif(profileConfig.backgroundGif)
    }
  }, [profiles, profileName])

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50 animate-fade-in">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="icon"
          className="bg-black/60 backdrop-blur-sm border-white/20 hover:bg-black/80 hover:border-white/40 text-white transition-all hover:scale-110"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Hero section with background */}
      <div
        className="relative h-[70vh] bg-cover bg-center flex items-end transition-all duration-500"
        style={{ backgroundImage: `url(${backgroundGif})` }}
      >
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-black/30 to-transparent" />
        <div className="relative z-10 w-full">
          <ProfileBanner />
        </div>
      </div>

      {/* Top picks section */}
      <div className="relative z-10">
        {profileName === "student" ? (
          <TopPicksRow profile={profileName} title="Today's Top Picks" />
        ) : (
          <TopPicksRow profile={profileName} />
        )}
      </div>
    </div>
  )
}
