"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"

const topPicksConfig = {
  recruiter: [
    { title: "Learning", imgSrc: "/about-me-logo.png", route: "/about" },
    { title: "Projects", imgSrc: "/projects-workspace.jpg", route: "/projects" },
    { title: "Growth", imgSrc: "/skills-illustration.png", route: "/skills" },
    { title: "Connect", imgSrc: "/contact-icons.jpg", route: "/contact" },
  ],
  student: [
    { title: "About Me", imgSrc: "/insights/ai-ml.png", route: "/about" },
    { title: "Projects", imgSrc: "/data-analytics-dashboard-charts-graphs.jpg", route: "/projects" },
    { title: "Skills", imgSrc: "/machine-learning-algorithms-code-visualization.jpg", route: "/skills" },
    { title: "Experience", imgSrc: "/iit-bombay-campus-cultural-festival.jpg", route: "/experience" },
    { title: "Contact", imgSrc: "/google-developers-community-coding-workshop.jpg", route: "/contact" },
  ],
  explorer: [
    { title: "Tech Blogs", imgSrc: "/blockchain-network-cryptocurrency-digital.jpg", route: "/explorer" },
    { title: "AI Articles", imgSrc: "/machine-learning-algorithms-code-visualization.jpg", route: "/explorer" },
    { title: "Dev News", imgSrc: "/data-analytics-dashboard-charts-graphs.jpg", route: "/explorer" },
    { title: "Trending", imgSrc: "/google-developers-community-coding-workshop.jpg", route: "/explorer" },
  ],
}

interface TopPicksRowProps {
  profile: string
  title?: string
}

export const TopPicksRow = ({ profile, title }: TopPicksRowProps) => {
  const router = useRouter()
  const [images, setImages] = useState<Record<string, string>>(
    topPicksConfig[profile as keyof typeof topPicksConfig] || topPicksConfig.recruiter,
  )
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  const topPicks = images

  const handleImageChange = (index: number, newUrl: string) => {
    const updated = [...topPicks]
    updated[index].imgSrc = newUrl
    setImages(updated)
    setShowModal(false)
  }

  return (
    <div className="bg-netflix-black px-4 sm:px-6 py-6 sm:py-8">
      <h2 className="text-white text-xl sm:text-2xl font-semibold mb-6 animate-fade-in">
        {title || `Today's Top Picks for ${profile}`}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {topPicks.map((pick, index) => (
          <div
            key={index}
            className="relative min-w-[200px] sm:min-w-[250px] h-[150px] sm:h-[200px] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-netflix-red/20 group"
            onClick={() => router.push(pick.route)}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <Image
              src={pick.imgSrc || "/placeholder.svg"}
              alt={pick.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
              <span className="text-white text-sm sm:text-xl font-semibold text-center px-4">{pick.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex(index)
                  setShowModal(true)
                }}
                className="text-xs bg-netflix-red hover:bg-netflix-red/80 text-white px-3 py-1 rounded transition-colors"
              >
                Edit Image
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 max-w-md w-full border border-netflix-red/30">
            <h3 className="text-white text-lg sm:text-xl font-semibold mb-4">
              Update Image URL for {topPicks[selectedIndex].title}
            </h3>
            <input
              type="text"
              defaultValue={topPicks[selectedIndex].imgSrc}
              placeholder="Enter image URL"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 mb-4 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleImageChange(selectedIndex, e.currentTarget.value)
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Enter image URL"]') as HTMLInputElement
                  handleImageChange(selectedIndex, input.value)
                }}
                className="flex-1 bg-netflix-red hover:bg-netflix-red/90 text-white px-4 py-2 rounded transition-colors text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
