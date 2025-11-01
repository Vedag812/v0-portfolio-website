"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function NetflixIntro() {
  const [isClicked, setIsClicked] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const router = useRouter()

  const handleClick = () => {
    setIsClicked(true)
    playNetflixSound()
  }

  const playNetflixSound = () => {
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
  }

  useEffect(() => {
    const autoPlayTimer = setTimeout(() => {
      if (autoPlay) {
        setIsClicked(true)
        playNetflixSound()
      }
    }, 2000)

    return () => clearTimeout(autoPlayTimer)
  }, [autoPlay])

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
      <div
        className={`flex flex-col items-center justify-center transition-all duration-1000 transform ${
          isClicked ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center mb-8">
          <div className="text-8xl md:text-9xl font-black text-netflix-red drop-shadow-2xl animate-pulse">V</div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">Vedant Agarwal</h1>
          <p className="text-lg md:text-2xl text-netflix-red mt-4 font-semibold animate-fade-in">
            Aspiring Data Scientist
          </p>
        </div>
      </div>
    </div>
  )
}
