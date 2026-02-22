"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useMediaConfig } from "@/components/media-config-provider"
import type { ProfileType } from "@/lib/media-config"
import dynamic from "next/dynamic"

const Galaxy = dynamic(() => import("@/components/Galaxy"), { ssr: false })

export function Browse() {
  const router = useRouter()
  const media = useMediaConfig()

  const profiles: { name: ProfileType; label: string }[] = [
    { name: "recruiter", label: "recruiter" },
    { name: "student", label: "student" },
    { name: "explorer", label: "explorer" },
  ]

  const handleProfileClick = (profileName: ProfileType) => {
    if (profileName === "explorer") {
      router.push("/explorer")
      return
    }
    const profile = media.profiles[profileName]
    router.push(`/profile/${profileName}?bg=${encodeURIComponent(profile.backgroundGif)}`)
  }

  return (
    <div className="relative h-screen bg-netflix-black overflow-hidden">
      {/* Galaxy star field background */}
      <div className="absolute inset-0 z-0">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1}
          glowIntensity={0.3}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
        />
      </div>

      {/* Content on top */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full">
        <h1 className="text-white text-3xl md:text-5xl font-normal mb-16 text-center drop-shadow-lg">Who&apos;s Watching?</h1>
        <div className="flex gap-6 flex-wrap justify-center mb-32">
          {profiles.map((profileItem, index) => {
            const profileConfig = media.profiles[profileItem.name]
            return (
              <div
                key={profileItem.name}
                role="button"
                tabIndex={0}
                aria-label={`View ${profileItem.label} profile`}
                className="netflix-profile-card cursor-pointer text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => handleProfileClick(profileItem.name)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleProfileClick(profileItem.name) }}
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-2 rounded-lg overflow-hidden border-2 border-transparent hover:border-white transition-all">
                  <Image
                    src={profileConfig.image || "/placeholder.svg"}
                    alt={`${profileItem.name} profile`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-white text-sm md:text-lg capitalize font-normal drop-shadow-md">{profileItem.label}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
