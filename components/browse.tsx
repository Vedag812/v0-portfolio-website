"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useMediaConfig } from "@/components/media-config-provider"
import type { ProfileType } from "@/lib/media-config"

export function Browse() {
  const router = useRouter()
  const media = useMediaConfig()

  const profiles: { name: ProfileType; label: string }[] = [
    { name: "recruiter", label: "recruiter" },
    { name: "student", label: "student" },
    { name: "explorer", label: "explorer" },
  ]

  const handleProfileClick = (profileName: ProfileType) => {
    // Explorer profile goes directly to tech content page
    if (profileName === "explorer") {
      router.push("/explorer")
      return
    }
    
    // Other profiles go to their profile pages
    const profile = media.profiles[profileName]
    router.push(`/profile/${profileName}?bg=${encodeURIComponent(profile.backgroundGif)}`)
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-netflix-black">
      <h1 className="text-white text-3xl md:text-5xl font-normal mb-16 text-center">Who's Watching?</h1>
      <div className="flex gap-6 flex-wrap justify-center mb-32">
        {profiles.map((profileItem, index) => {
          const profileConfig = media.profiles[profileItem.name]
          return (
            <div
              key={index}
              className="netflix-profile-card cursor-pointer text-center"
              onClick={() => handleProfileClick(profileItem.name)}
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-2 rounded-lg overflow-hidden border-2 border-transparent hover:border-white transition-all">
                <Image
                  src={profileConfig.image || "/placeholder.svg"}
                  alt={`${profileItem.name} profile`}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-white text-sm md:text-lg capitalize font-normal">{profileItem.label}</h3>
            </div>
          )
        })}
      </div>
    </div>
  )
}
