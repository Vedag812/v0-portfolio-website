"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { ProfileBanner } from "./profile-banner"
import { TopPicksRow } from "./top-picks-row"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ProfilePageProps {
  profileName: string
}

export function ProfilePage({ profileName }: ProfilePageProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const backgroundGif = searchParams.get("bg") || "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif"

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="icon"
          className="bg-netflix-red/20 border-netflix-red hover:bg-netflix-red/30 text-netflix-red"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div
        className="h-screen bg-cover bg-center flex items-center"
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
