"use client"

import { useState, useEffect, useRef } from "react"

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

export function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "", decimals = 0 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      setCount(startValue + (end - startValue) * easeProgress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={ref} className="font-bold text-netflix-red">
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  )
}

interface StatsCardProps {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
  prefix?: string
  decimals?: number
}

export function StatsCard({ icon, value, label, suffix = "", prefix = "", decimals = 0 }: StatsCardProps) {
  return (
    <div className="bg-netflix-light-gray rounded-lg p-6 hover-lift pulse-glow text-center">
      <div className="flex justify-center mb-3 text-netflix-red">{icon}</div>
      <div className="text-3xl font-bold text-white mb-2">
        <AnimatedCounter end={value} suffix={suffix} prefix={prefix} decimals={decimals} />
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}
