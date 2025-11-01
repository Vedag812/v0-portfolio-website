"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Edit2, Save, X } from "lucide-react"

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
  const [continueWatching, setContinueWatching] = useState(
    continueWatchingConfig[profile as keyof typeof continueWatchingConfig] || continueWatchingConfig.recruiter,
  )
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingUrl, setEditingUrl] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(`continueWatching_${profile}`)
    if (saved) {
      setContinueWatching(JSON.parse(saved))
    }
  }, [profile])

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false)
      return
    }
    setShowPasswordPrompt(true)
  }

  const handlePasswordSubmit = () => {
    if (adminPassword === "vedant123") {
      setIsAdminMode(true)
      setShowPasswordPrompt(false)
      setAdminPassword("")
    } else {
      alert("Wrong password")
      setAdminPassword("")
    }
  }

  const handleSaveImage = (index: number) => {
    if (editingUrl.trim()) {
      const updated = [...continueWatching]
      updated[index].imgSrc = editingUrl
      setContinueWatching(updated)
      localStorage.setItem(`continueWatching_${profile}`, JSON.stringify(updated))
      setEditingIndex(null)
      setEditingUrl("")
    }
  }

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
    <div className="bg-netflix-black px-4 sm:px-6 py-6 sm:py-8 relative group">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-white text-xl sm:text-2xl font-semibold">Today's Top Picks for {profile}</h2>
        <button
          onClick={handleAdminToggle}
          className={`text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${isAdminMode ? "bg-netflix-red text-white" : "bg-gray-700 text-gray-300"}`}
        >
          {isAdminMode ? "Exit Edit" : "Edit"}
        </button>
      </div>

      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-netflix-dark-gray p-6 rounded-lg">
            <h3 className="text-white mb-4 font-semibold">Enter Admin Password</h3>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded mb-4 outline-none"
              placeholder="Password"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handlePasswordSubmit}
                className="bg-netflix-red text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Submit
              </button>
              <button
                onClick={() => setShowPasswordPrompt(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4">
        {continueWatching.map((item, index) => (
          <div
            key={index}
            className="relative min-w-[150px] sm:min-w-[200px] h-[120px] sm:h-[150px] rounded-lg overflow-hidden flex-shrink-0 group/card"
          >
            {editingIndex === index ? (
              <div className="bg-gray-800 p-4 h-full flex flex-col justify-center gap-2">
                <input
                  type="text"
                  value={editingUrl}
                  onChange={(e) => setEditingUrl(e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveImage(index)}
                    className="bg-netflix-red text-white px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Save size={14} /> Save
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="bg-gray-600 text-white px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Image
                  src={item.imgSrc || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110 cursor-pointer"
                  onClick={() => !isAdminMode && handleClick(item.link)}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-100">
                  <span className="text-white text-sm sm:text-lg font-semibold text-center px-2">{item.title}</span>
                </div>
                {isAdminMode && (
                  <button
                    onClick={() => {
                      setEditingIndex(index)
                      setEditingUrl(item.imgSrc)
                    }}
                    className="absolute top-2 right-2 bg-netflix-red text-white p-2 rounded opacity-90 hover:opacity-100 z-10"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
