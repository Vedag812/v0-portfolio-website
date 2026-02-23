"use client"

import { useEffect, useRef, useCallback } from "react"

/**
 * Hook that observes child elements and adds 'visible' class
 * when they enter the viewport for scroll-reveal animations.
 * 
 * Usage:
 *   const revealRef = useScrollReveal()
 *   <div ref={revealRef} className="reveal">...</div>
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible")
                    }
                })
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        )

        // Observe the element itself and any children with reveal classes
        const revealElements = el.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale")
        revealElements.forEach((child) => observer.observe(child))

        // Also observe the element itself if it has a reveal class
        if (el.classList.contains("reveal") || el.classList.contains("reveal-left") || el.classList.contains("reveal-right") || el.classList.contains("reveal-scale")) {
            observer.observe(el)
        }

        return () => observer.disconnect()
    }, [])

    return ref
}
