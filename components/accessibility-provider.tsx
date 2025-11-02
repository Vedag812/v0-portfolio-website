"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface AccessibilityOptions {
  highContrast: boolean
  largeText: boolean
  reduceMotion: boolean
  screenReaderMode: boolean
}

export function AccessibilityProvider() {
  const [options, setOptions] = useState<AccessibilityOptions>({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReaderMode: false,
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("a11y-options")
    if (saved) {
      setOptions(JSON.parse(saved))
      applyOptions(JSON.parse(saved))
    }

    // Check system preference for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOptions((prev) => ({ ...prev, reduceMotion: true }))
      applyOptions({ ...options, reduceMotion: true })
    }
  }, [])

  const applyOptions = (newOptions: AccessibilityOptions) => {
    const root = document.documentElement

    if (newOptions.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    if (newOptions.largeText) {
      root.classList.add("large-text")
    } else {
      root.classList.remove("large-text")
    }

    if (newOptions.reduceMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    localStorage.setItem("a11y-options", JSON.stringify(newOptions))
  }

  const toggleOption = (key: keyof AccessibilityOptions) => {
    const newOptions = { ...options, [key]: !options[key] }
    setOptions(newOptions)
    applyOptions(newOptions)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="mb-4 glass-effect rounded-lg p-4 w-64 space-y-3">
          <h3 className="font-semibold text-sm text-white">Accessibility Options</h3>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.highContrast}
              onChange={() => toggleOption("highContrast")}
              className="w-4 h-4"
              aria-label="Toggle high contrast mode"
            />
            <span className="text-sm text-gray-300">High Contrast</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.largeText}
              onChange={() => toggleOption("largeText")}
              className="w-4 h-4"
              aria-label="Toggle large text"
            />
            <span className="text-sm text-gray-300">Large Text</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.reduceMotion}
              onChange={() => toggleOption("reduceMotion")}
              className="w-4 h-4"
              aria-label="Reduce motion"
            />
            <span className="text-sm text-gray-300">Reduce Motion</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.screenReaderMode}
              onChange={() => toggleOption("screenReaderMode")}
              className="w-4 h-4"
              aria-label="Screen reader mode"
            />
            <span className="text-sm text-gray-300">Screen Reader</span>
          </label>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-netflix-red hover:bg-red-700 rounded-full w-12 h-12 p-0"
        aria-label="Open accessibility options"
        title="Accessibility Settings"
      >
        {isOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  )
}
