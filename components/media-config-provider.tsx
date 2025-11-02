"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { MediaConfig, ProfileType } from "@/lib/media-config"
import { usePathname } from "next/navigation"

interface MediaConfigContextValue {
  config: MediaConfig
  currentProfile: ProfileType
}

const MediaConfigContext = createContext<MediaConfigContextValue | null>(null)

interface MediaConfigProviderProps {
  initialConfig: MediaConfig
  children: React.ReactNode
}

export function MediaConfigProvider({ initialConfig, children }: MediaConfigProviderProps) {
  const [config, setConfig] = useState<MediaConfig>(initialConfig)
  const [currentProfile, setCurrentProfile] = useState<ProfileType>("recruiter")
  const pathname = usePathname()

  useEffect(() => {
    setConfig(initialConfig)
  }, [initialConfig])

  useEffect(() => {
    // Detect current profile from URL
    if (pathname?.includes("/profile/recruiter")) {
      setCurrentProfile("recruiter")
    } else if (pathname?.includes("/profile/student")) {
      setCurrentProfile("student")
    } else if (pathname?.includes("/profile/explorer")) {
      setCurrentProfile("explorer")
    }
  }, [pathname])

  useEffect(() => {
    // Auto-refresh media config every 3 seconds to pick up admin changes
    const refreshInterval = setInterval(async () => {
      try {
        const response = await fetch("/api/media", { 
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          }
        })
        if (response.ok) {
          const updatedConfig = await response.json()
          const oldConfig = JSON.stringify(config)
          const newConfig = JSON.stringify(updatedConfig)
          
          if (oldConfig !== newConfig) {
            console.log("🔄 Media config updated from admin dashboard!")
            setConfig(updatedConfig)
          }
        }
      } catch (error) {
        console.error("Failed to refresh media config:", error)
      }
    }, 3000) // Refresh every 3 seconds

    return () => clearInterval(refreshInterval)
  }, [config])

  return (
    <MediaConfigContext.Provider value={{ config, currentProfile }}>
      {children}
    </MediaConfigContext.Provider>
  )
}

export function useMediaConfig() {
  const context = useContext(MediaConfigContext)
  if (!context) {
    throw new Error("useMediaConfig must be used within a MediaConfigProvider")
  }
  
  const { config, currentProfile } = context
  const profileConfig = config.profiles[currentProfile]
  
  return {
    profileImage: config.profileImage,
    backgrounds: profileConfig.backgrounds,
    profiles: config.profiles,
    currentProfile,
    currentProfileConfig: profileConfig,
  }
}
