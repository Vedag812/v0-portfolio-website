"use client"

import { useState, useEffect } from "react"
import { Bookmark } from "lucide-react"

interface BookmarkedArticle {
  id: string
  author: string
  content: string
  timestamp: string
}

export function useArticleBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([])

  useEffect(() => {
    // Load bookmarks from localStorage
    const saved = localStorage.getItem("article-bookmarks")
    if (saved) {
      setBookmarks(JSON.parse(saved))
    }
  }, [])

  const toggleBookmark = (article: BookmarkedArticle) => {
    setBookmarks((prev) => {
      const isBookmarked = prev.some((b) => b.id === article.id)
      const updated = isBookmarked ? prev.filter((b) => b.id !== article.id) : [...prev, article]
      localStorage.setItem("article-bookmarks", JSON.stringify(updated))
      return updated
    })
  }

  const isBookmarked = (articleId: string) => bookmarks.some((b) => b.id === articleId)

  return { bookmarks, toggleBookmark, isBookmarked }
}

export function BookmarkButton({ articleId, onToggle }: { articleId: string; onToggle: (id: string) => void }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <button
      onClick={() => {
        setIsBookmarked(!isBookmarked)
        onToggle(articleId)
      }}
      className="flex items-center justify-center gap-2 text-gray-400 hover:text-netflix-red transition-colors text-xs sm:text-sm"
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? (
        <Bookmark className="w-4 h-4 fill-netflix-red text-netflix-red" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
    </button>
  )
}
