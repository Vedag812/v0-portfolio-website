"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin } from "lucide-react"
import { useEffect, useState } from "react"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToProjects = () => {
    const element = document.getElementById("projects")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative parallax-bg overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/20 rounded-full blur-xl float-animation"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-blue-400/20 rounded-full blur-xl float-animation"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-red-500/10 rounded-full blur-2xl float-animation"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? "fade-in-up" : "opacity-0"}`}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-balance">
            <span className="neon-text">Vedant</span> <span className="neon-red">Agarwal</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4 gradient-text typing-animation">
            <span className="neon-red">Aspiring Data Scientist</span> & AI Enthusiast
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 text-pretty max-w-3xl mx-auto">
            Computer Science & Data Science Student at SRMIST | Passionate about AI, Machine Learning, and Blockchain
            Technologies | Campus Partner @Perplexity
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg netflix-glow transition-all duration-300 hover:scale-105 relative overflow-hidden group"
              onClick={scrollToProjects}
            >
              <span className="relative z-10">▶ View My Work</span>
              <ArrowDown className="ml-2 h-5 w-5 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Button>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="glass-effect border-blue-400/50 hover:border-blue-400 transition-all duration-300 hover:scale-105 bg-transparent"
                asChild
              >
                <a href="https://github.com/Vedag812" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="glass-effect border-blue-400/50 hover:border-blue-400 transition-all duration-300 hover:scale-105 bg-transparent"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/vedant-agarwal-36bb18142"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center">
          <ArrowDown className="h-6 w-6 text-blue-400 mb-2" />
          <span className="text-sm text-gray-400">Scroll to explore</span>
        </div>
      </div>
    </section>
  )
}
