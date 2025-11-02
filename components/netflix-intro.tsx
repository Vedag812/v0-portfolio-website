"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export function NetflixIntro() {
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasStarted = useRef(false)

  const playNetflixSound = async () => {
    try {
      console.log("🔊 Attempting to play Netflix sound from /netflix-sound.mp3...")
      
      // Create and load the audio
      const audio = new Audio()
      audio.src = "/netflix-sound.mp3"
      audio.volume = 0.8
      audio.preload = "auto"
      
      // Store reference
      audioRef.current = audio
      
      // Try to play
      try {
        await audio.play()
        console.log("✅ Netflix sound MP3 played successfully!")
      } catch (playError: any) {
        console.error("❌ Failed to play Netflix sound MP3:", playError)
        console.log("Error details:", playError.message)
        
        // Check if it's an autoplay policy issue
        if (playError.name === "NotAllowedError") {
          console.log("🔄 Autoplay blocked by browser. Sound will play on user interaction.")
        }
        
        // Fallback to synthesized sound
        console.log("🔄 Using synthesized fallback sound...")
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        
        // First note (Ta) - D5
        const osc1 = audioContext.createOscillator()
        const gain1 = audioContext.createGain()
        osc1.connect(gain1)
        gain1.connect(audioContext.destination)
        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(587.33, audioContext.currentTime)
        gain1.gain.setValueAtTime(0.8, audioContext.currentTime)
        gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        osc1.start(audioContext.currentTime)
        osc1.stop(audioContext.currentTime + 0.3)
        
        // Second note (Dum) - D4
        const osc2 = audioContext.createOscillator()
        const gain2 = audioContext.createGain()
        osc2.connect(gain2)
        gain2.connect(audioContext.destination)
        osc2.type = 'sine'
        osc2.frequency.setValueAtTime(293.66, audioContext.currentTime + 0.35)
        gain2.gain.setValueAtTime(0, audioContext.currentTime + 0.35)
        gain2.gain.setValueAtTime(0.9, audioContext.currentTime + 0.36)
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)
        osc2.start(audioContext.currentTime + 0.35)
        osc2.stop(audioContext.currentTime + 1.5)
        
        console.log("✅ Synthesized sound played")
      }
    } catch (error) {
      console.error("❌ Critical error in playNetflixSound:", error)
    }
  }

  const startIntro = async () => {
    if (hasStarted.current) return
    hasStarted.current = true
    
    console.log("🎬 Netflix intro starting...")
    
    // Start animation immediately
    setIsAnimating(true)
    
    // Play sound immediately
    await playNetflixSound()
    
    // Redirect after animation completes
    setTimeout(() => {
      console.log("🚀 Redirecting to /browse...")
      router.push("/browse")
    }, 4000)
  }

  useEffect(() => {
    // Start intro automatically - always!
    const timer = setTimeout(() => {
      startIntro()
    }, 300)
    
    // Also try click to enable sound if autoplay blocked
    const handleFirstClick = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {})
      }
      document.removeEventListener('click', handleFirstClick)
    }
    document.addEventListener('click', handleFirstClick)
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleFirstClick)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
      hasStarted.current = false // Reset for next visit
    }
  }, [])

  return (
    <div 
      className="flex items-center justify-center h-screen bg-netflix-black overflow-hidden cursor-pointer relative"
      onClick={startIntro}
    >
      {/* Netflix intro animation */}
      <div 
        className={`netflix-intro-content text-center transform transition-all ${
          isAnimating ? "animate-netflix-zoom" : "opacity-0 scale-50"
        }`}
      >
        <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-netflix-red drop-shadow-2xl">
          Vedant Agarwal
        </div>
        <div className="text-xl md:text-2xl text-white/90 text-center mt-4">
          Aspiring Data Scientist
        </div>
      </div>
      
      <style jsx>{`
        @keyframes netflix-zoom {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          12.5% {
            transform: scale(1);
            opacity: 1;
          }
          75% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(8);
            opacity: 0;
          }
        }
        
        .animate-netflix-zoom {
          animation: netflix-zoom 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  )
}
