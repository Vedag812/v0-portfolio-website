"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-toggle"

export function NetflixNavbar() {
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-netflix-black" : "bg-gradient-to-b from-black/90 to-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-netflix-red text-2xl font-bold">
            Vedant
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/browse" className="text-white hover:text-netflix-red transition-colors">
              Home
            </Link>
            <Link href="/experience" className="text-white hover:text-netflix-red transition-colors">
              Experience
            </Link>
            <Link href="/skills" className="text-white hover:text-netflix-red transition-colors">
              Skills
            </Link>
            <Link href="/projects" className="text-white hover:text-netflix-red transition-colors">
              Projects
            </Link>
            <Link href="/contact" className="text-white hover:text-netflix-red transition-colors">
              Contact
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-netflix-dark-gray hover:bg-netflix-light-gray transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-400" />}
          </button>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
            </div>
          </button>

          <div className="w-8 h-8 rounded bg-netflix-red cursor-pointer" onClick={() => router.push("/browse")} />
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-netflix-black border-t border-gray-800">
          <div className="flex flex-col space-y-4 px-6 py-4">
            <Link href="/browse" className="text-white hover:text-netflix-red transition-colors">
              Home
            </Link>
            <Link href="/experience" className="text-white hover:text-netflix-red transition-colors">
              Experience
            </Link>
            <Link href="/skills" className="text-white hover:text-netflix-red transition-colors">
              Skills
            </Link>
            <Link href="/projects" className="text-white hover:text-netflix-red transition-colors">
              Projects
            </Link>
            <Link href="/contact" className="text-white hover:text-netflix-red transition-colors">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
