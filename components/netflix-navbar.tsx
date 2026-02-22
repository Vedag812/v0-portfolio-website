"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-toggle"

const navLinks = [
  { href: "/browse", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
]

export function NetflixNavbar() {
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActive = useCallback(
    (href: string) => pathname === href || pathname?.startsWith(href + "/"),
    [pathname]
  )

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
          ? "bg-netflix-black/95 backdrop-blur-md shadow-lg shadow-black/30"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-netflix-red text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            Vedant
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${isActive(link.href)
                    ? "text-white bg-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
              <Moon className="h-4 w-4 text-blue-400" />
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-1">
              <span
                className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[3px]" : ""
                  }`}
              />
              <span
                className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[3px]" : ""
                  }`}
              />
            </div>
          </button>

          <div
            className="w-8 h-8 rounded bg-netflix-red cursor-pointer hover:brightness-110 transition-all"
            onClick={() => router.push("/browse")}
            role="button"
            aria-label="Go to profiles"
          />
        </div>
      </div>

      {/* Mobile menu with slide animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="bg-netflix-black/95 backdrop-blur-md border-t border-white/10 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                  ? "text-white bg-white/10"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
