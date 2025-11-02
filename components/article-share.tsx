"use client"

import { Share2, Copy, Check } from "lucide-react"
import { useState } from "react"

interface ArticleShareProps {
  articleId: string
  author: string
  content: string
}

export function ArticleShare({ articleId, author, content }: ArticleShareProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/explorer?post=${articleId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(`Check out this article from ${author}: ${content.slice(0, 50)}...`)

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400")
      setShowMenu(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center justify-center gap-2 text-gray-400 hover:text-netflix-red transition-colors text-xs sm:text-sm"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {showMenu && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 w-full px-4 py-2 text-gray-300 hover:bg-gray-700 text-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2 w-full px-4 py-2 text-gray-300 hover:bg-gray-700 text-xs transition-colors border-t border-gray-700"
          >
            𝕏 Twitter
          </button>
          <button
            onClick={() => handleShare("linkedin")}
            className="flex items-center gap-2 w-full px-4 py-2 text-gray-300 hover:bg-gray-700 text-xs transition-colors border-t border-gray-700"
          >
            in LinkedIn
          </button>
          <button
            onClick={() => handleShare("facebook")}
            className="flex items-center gap-2 w-full px-4 py-2 text-gray-300 hover:bg-gray-700 text-xs transition-colors border-t border-gray-700"
          >
            f Facebook
          </button>
        </div>
      )}
    </div>
  )
}
