"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Home, Search } from "lucide-react"
import { useEffect, useState } from "react"

export default function NotFound() {
    const router = useRouter()
    const [glitchText, setGlitchText] = useState("404")

    // Glitch effect on the 404 text
    useEffect(() => {
        const chars = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`"
        let interval: NodeJS.Timeout

        const glitch = () => {
            let iterations = 0
            interval = setInterval(() => {
                setGlitchText(
                    "404"
                        .split("")
                        .map((char, i) =>
                            i < iterations ? "404"[i] : chars[Math.floor(Math.random() * chars.length)]
                        )
                        .join("")
                )
                iterations += 1 / 3
                if (iterations > 3) {
                    clearInterval(interval)
                    setGlitchText("404")
                }
            }, 30)
        }

        glitch()
        const loopInterval = setInterval(glitch, 4000)
        return () => {
            clearInterval(interval)
            clearInterval(loopInterval)
        }
    }, [])

    return (
        <div className="min-h-screen bg-netflix-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(229,9,20,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(229,9,20,0.3) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-netflix-red/5 rounded-full blur-[120px]" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-2xl">
                {/* Glitching 404 */}
                <h1
                    className="text-[120px] sm:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-netflix-red to-red-900 leading-none mb-2 select-none"
                    style={{
                        textShadow: "0 0 40px rgba(229,9,20,0.3), 0 0 80px rgba(229,9,20,0.1)",
                        fontFamily: "monospace",
                    }}
                >
                    {glitchText}
                </h1>

                {/* Lost title */}
                <h2 className="text-white text-2xl sm:text-4xl font-bold mb-3">
                    Lost your way?
                </h2>

                <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
                    Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-netflix-red hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-netflix-red/30"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>

                {/* Error code badge */}
                <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-netflix-red animate-pulse" />
                    <span className="text-xs text-gray-500 font-mono">Error Code: NSES-404</span>
                </div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-netflix-red/30"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
                            animationDelay: `${i * 0.3}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
