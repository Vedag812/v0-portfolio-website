import { NextResponse } from "next/server"

const GITHUB_USERNAME = "Vedag812"

export async function GET() {
    try {
        const token = process.env.GITHUB_TOKEN

        const headers: Record<string, string> = {
            Accept: "application/vnd.github.v3+json",
        }
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        // If token is set → use /user/repos (returns ALL repos including private)
        // No token → /users/:user/repos (public only)
        const url = token
            ? "https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner"
            : `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`

        const response = await fetch(url, {
            headers,
            next: { revalidate: 300 },
        })

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`)
        }

        const repos = await response.json()

        // Known repo descriptions/categories for repos without GitHub descriptions
        const REPO_ENRICHMENTS: Record<string, { description: string; language: string; topics: string[] }> = {
            "FUTURE_DS_01": {
                description: "Interactive Power BI dashboard analyzing e-commerce sales across multiple countries — 11M items, 6K customers, 37K orders, 18M revenue with YoY comparison",
                language: "Power BI",
                topics: ["data-analytics", "power-bi", "dashboard", "e-commerce", "data-visualization"],
            },
            "FUTURE_DS_02": {
                description: "Facebook Ads Analytics Dashboard built with Power BI — CTR analysis, profit by gender, conversion rates, ROI tracking across ad campaigns",
                language: "Power BI",
                topics: ["data-analytics", "power-bi", "dashboard", "facebook-ads", "marketing-analytics"],
            },
            "FUTURE_DS_03": {
                description: "NLP-powered student feedback analysis — sentiment classification, satisfaction scoring, and department performance dashboards using Python, NLTK, and Plotly",
                language: "Jupyter Notebook",
                topics: ["nlp", "sentiment-analysis", "python", "data-science", "plotly"],
            },
        }

        const mapped = repos.map((repo: any) => {
            const enrichment = REPO_ENRICHMENTS[repo.name]
            return {
                id: String(repo.id),
                name: repo.name,
                description: repo.description || (enrichment?.description ?? ""),
                html_url: repo.html_url,
                homepage: repo.homepage || "",
                language: repo.language || (enrichment?.language ?? ""),
                stars: repo.stargazers_count,
                topics: (repo.topics && repo.topics.length > 0) ? repo.topics : (enrichment?.topics ?? []),
                updated_at: repo.updated_at,
                isPrivate: repo.private,
                isFork: repo.fork,
            }
        })

        return NextResponse.json({ repos: mapped, authenticated: !!token })
    } catch (error) {
        console.error("Failed to fetch GitHub repos:", error)
        return NextResponse.json({ repos: [], error: String(error) }, { status: 500 })
    }
}
