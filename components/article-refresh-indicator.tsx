"use client"

import { useState, useEffect } from "react"
import { RefreshCw, AlertCircle } from "lucide-react"

interface ArticleRefreshIndicatorProps {
  newArticlesCount: number
  onRefresh: () => void
  isRefreshing: boolean
  lastUpdated: Date
}

export function ArticleRefreshIndicator({
  newArticlesCount,
  onRefresh,
  isRefreshing,
  lastUpdated,
}: ArticleRefreshIndicatorProps) {
  const [showNotification, setShowNotification] = useState(newArticlesCount > 0)

  useEffect(() => {
    setShowNotification(newArticlesCount > 0)
  }, [newArticlesCount])

  const lastUpdatedTime = lastUpdated.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <div className="flex flex-col gap-2">
      {showNotification && newArticlesCount > 0 && (
        <div className="bg-netflix-red/10 border border-netflix-red/30 rounded-lg p-3 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-netflix-red flex-shrink-0" />
            <span className="text-xs sm:text-sm text-netflix-red font-semibold">
              {newArticlesCount} new article{newArticlesCount !== 1 ? "s" : ""} available!
            </span>
          </div>
          <button
            onClick={() => {
              onRefresh()
              setShowNotification(false)
            }}
            disabled={isRefreshing}
            className="bg-netflix-red text-white px-3 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-semibold hover:bg-netflix-red/90 transition-colors disabled:opacity-50"
          >
            {isRefreshing ? "Refreshing..." : "Load"}
          </button>
        </div>
      )}
      <div className="text-xs text-gray-400 flex items-center gap-2 px-4">
        <RefreshCw className="w-3 h-3" />
        <span>Last updated: {lastUpdatedTime}</span>
      </div>
    </div>
  )
}
