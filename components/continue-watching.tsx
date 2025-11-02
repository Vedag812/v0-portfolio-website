"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"

const continueWatchingConfig = {
  recruiter: [
    { title: "Learning", imgSrc: "/about-me-logo.png", link: "/about" },
    { title: "Projects", imgSrc: "/projects-workspace.jpg", link: "/projects" },
    { title: "Growth", imgSrc: "/skills-illustration.png", link: "/skills" },
    { title: "Connect", imgSrc: "/contact-icons.jpg", link: "/contact" },
  ],
  student: [
    { title: "Learning", imgSrc: "/about-me-logo.png", link: "/about" },
    { title: "Projects", imgSrc: "/projects-workspace.jpg", link: "/projects" },
    { title: "Growth", imgSrc: "/skills-illustration.png", link: "/skills" },
    { title: "Connect", imgSrc: "/contact-icons.jpg", link: "/contact" },
  ],
}

interface ContinueWatchingProps {
  profile: string
}

export const ContinueWatching = ({ profile }: ContinueWatchingProps) => {
  const router = useRouter()
  const continueWatching =
    continueWatchingConfig[profile as keyof typeof continueWatchingConfig] || continueWatchingConfig.recruiter

  const handleClick = (link: string) => {
    if (link.startsWith("http")) {
      window.open(link, "_blank")
    } else {
      router.push(link)
    }
  }

  if (profile === "student") {
    return null
  }

  return (
    <div className="bg-netflix-black px-4 sm:px-6 py-6 sm:py-8">
      <h2 className="text-white text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Today's Top Picks for {profile}</h2>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4">
        {continueWatching.map((item, index) => (
          <div
            key={index}
            className="relative min-w-[150px] sm:min-w-[200px] h-[120px] sm:h-[150px] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 flex-shrink-0"
            onClick={() => handleClick(item.link)}
          >
            <Image src={item.imgSrc || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-100">
              <span className="text-white text-sm sm:text-lg font-semibold text-center px-2">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
