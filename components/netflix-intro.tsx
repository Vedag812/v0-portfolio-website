"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function NetflixIntro() {
  const [isClicked, setIsClicked] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    setIsClicked(true)
    playNetflixSound()
  }

  const playNetflixSound = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==")
    audio.play().catch(() => {
      // Fallback: use Web Audio API to create Netflix-like sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    })
  }

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        router.push("/browse")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isClicked, router])

  return (
    <div
      className="flex items-center justify-center h-screen bg-netflix-black cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className={`netflix-intro-logo ${isClicked ? "animate" : ""}`}>
        <div className="text-4xl md:text-6xl font-bold text-netflix-red">Vedant Agarwal</div>
        <div className="text-lg md:text-xl text-white text-center mt-2">Aspiring Data Scientist</div>
      </div>
    </div>
  )
}
