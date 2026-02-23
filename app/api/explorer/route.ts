import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface ExplorerArticle {
    id: string
    title: string
    description: string
    url: string
    image: string
    source: string
    publishedAt: string
    category: "ai" | "tech" | "dev"
}

// Fetch latest AI/ML/Data-Science articles from Dev.to
async function fetchDevToArticles(): Promise<ExplorerArticle[]> {
    try {
        const tags = ["ai", "machinelearning", "datascience", "python", "deeplearning"]
        const allArticles: ExplorerArticle[] = []

        // Fetch from multiple tags in parallel
        const fetches = tags.slice(0, 3).map(tag =>
            fetch(`https://dev.to/api/articles?tag=${tag}&per_page=4&top=7`, {
                headers: { "User-Agent": "PortfolioExplorer/1.0" },
                next: { revalidate: 3600 },
            }).then(r => r.ok ? r.json() : []).catch(() => [])
        )

        const results = await Promise.all(fetches)

        for (const articles of results) {
            for (const a of articles) {
                if (allArticles.find(x => x.id === `devto-${a.id}`)) continue
                allArticles.push({
                    id: `devto-${a.id}`,
                    title: a.title,
                    description: a.description || a.title,
                    url: a.url,
                    image: a.cover_image || a.social_image || `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80`,
                    source: `Dev.to • ${a.user?.name || "Community"}`,
                    publishedAt: a.published_at,
                    category: "ai",
                })
            }
        }

        return allArticles.slice(0, 8)
    } catch (error) {
        console.error("Dev.to fetch failed:", error)
        return []
    }
}

// Fetch top Hacker News stories (tech)
async function fetchHackerNews(): Promise<ExplorerArticle[]> {
    try {
        const topRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
            next: { revalidate: 3600 },
        })
        const topIds: number[] = await topRes.json()

        // Fetch top 15 stories in parallel, filter for AI/data/tech
        const storyFetches = topIds.slice(0, 15).map(id =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                .then(r => r.json())
                .catch(() => null)
        )
        const stories = (await Promise.all(storyFetches)).filter(Boolean)

        const techKeywords = ["ai", "gpt", "llm", "data", "machine", "python", "neural", "model", "deep", "learn", "science", "analytics", "transformer", "sql", "tensorflow"]

        const filtered = stories
            .filter(s => s.title && s.url)
            .filter(s => {
                const t = s.title.toLowerCase()
                return techKeywords.some(kw => t.includes(kw)) || s.score > 200
            })
            .slice(0, 6)

        return filtered.map((s: any) => ({
            id: `hn-${s.id}`,
            title: s.title,
            description: `${s.score} points • ${s.descendants || 0} comments on Hacker News`,
            url: s.url,
            image: `https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80`,
            source: `Hacker News • ${s.score}pts`,
            publishedAt: new Date(s.time * 1000).toISOString(),
            category: "tech" as const,
        }))
    } catch (error) {
        console.error("HN fetch failed:", error)
        return []
    }
}

export async function GET() {
    try {
        const [devtoArticles, hnArticles] = await Promise.all([
            fetchDevToArticles(),
            fetchHackerNews(),
        ])

        // Interleave: devto, hn, devto, hn, ...
        const combined: ExplorerArticle[] = []
        const maxLen = Math.max(devtoArticles.length, hnArticles.length)
        for (let i = 0; i < maxLen; i++) {
            if (i < devtoArticles.length) combined.push(devtoArticles[i])
            if (i < hnArticles.length) combined.push(hnArticles[i])
        }

        return NextResponse.json({
            success: true,
            articles: combined.slice(0, 12),
            fetchedAt: new Date().toISOString(),
        })
    } catch (error) {
        console.error("Explorer API error:", error)
        return NextResponse.json({ success: false, articles: [] }, { status: 500 })
    }
}
