"use client"

import { useState, useEffect } from "react"

interface SiteContent {
    about: {
        name: string
        tagline: string
        bio: string
        cgpa: string
        college: string
        degree: string
        period: string
        coursework: string
        expertise: string
        skills: string[]
        languages: string[]
    }
    experiences: {
        title: string
        company: string
        period: string
        location: string
        description: string[]
        type: string
    }[]
    achievements: {
        title: string
        detail: string
    }[]
    certifications: string[]
    skills: {
        title: string
        icon: string
        color: string
        skills: { name: string; level: number }[]
    }[]
    contact: {
        email: string
        linkedin: string
        github: string
        location: string
        huggingface?: string
    }
}

let cachedContent: SiteContent | null = null
let fetchPromise: Promise<SiteContent> | null = null

async function fetchContent(): Promise<SiteContent> {
    if (cachedContent) return cachedContent
    if (fetchPromise) return fetchPromise

    fetchPromise = fetch("/api/content", { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
            cachedContent = data
            // Invalidate cache after 30s so fresh edits show up
            setTimeout(() => { cachedContent = null; fetchPromise = null }, 30000)
            return data
        })
        .catch(() => {
            fetchPromise = null
            return null
        })

    return fetchPromise
}

export function useSiteContent() {
    const [content, setContent] = useState<SiteContent | null>(cachedContent)
    const [isLoading, setIsLoading] = useState(!cachedContent)

    useEffect(() => {
        if (cachedContent) {
            setContent(cachedContent)
            setIsLoading(false)
            return
        }

        fetchContent().then(data => {
            if (data) setContent(data)
            setIsLoading(false)
        })
    }, [])

    return { content, isLoading }
}

// Force refresh (called after admin save)
export function invalidateSiteContent() {
    cachedContent = null
    fetchPromise = null
}
