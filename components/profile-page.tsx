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
    <>
      <div className="fixed top-4 left-4 z-50 animate-fade-in">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="icon"
          className="bg-netflix-red/20 border-netflix-red hover:bg-netflix-red/30 text-netflix-red transition-all hover:scale-110"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div
        className="h-screen bg-cover bg-center flex items-center transition-all duration-500"
        style={{ backgroundImage: `url(${backgroundGif})` }}
      >
        <ProfileBanner />
      </div>
      {profileName === "student" ? (
        <TopPicksRow profile={profileName} title="Today's Top Picks" />
      ) : (
        <TopPicksRow profile={profileName} />
      )}
    </>
  )
}
