"use client"

import { useEffect, useState } from "react"

export function KeyboardNavigationHint() {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "?") {
        setShowHint(!showHint)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [showHint])

  return (
    <>
      {showHint && (
        <div className="fixed bottom-6 left-6 z-40 glass-effect rounded-lg p-4 max-w-sm">
          <h3 className="font-semibold text-white mb-2">Keyboard Shortcuts</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">?</kbd> - Toggle this help
            </li>
            <li>
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Tab</kbd> - Navigate elements
            </li>
            <li>
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Enter</kbd> - Activate buttons
            </li>
            <li>
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Space</kbd> - Scroll down
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
