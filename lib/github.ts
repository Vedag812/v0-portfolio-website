const GITHUB_USERNAME = "Vedag812"
const GITHUB_API_URL = "https://api.github.com"

export interface GitHubProject {
  id: number
  name: string
  description: string | null
  url: string
  language: string | null
  stars: number
  topics: string[]
}

export async function fetchGitHubProjects(): Promise<GitHubProject[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub projects")
    }

    const repos = await response.json()

    return repos
      .filter((repo: any) => !repo.fork && repo.description) // Filter out forks and repos without description
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        topics: repo.topics || [],
      }))
      .slice(0, 6) // Limit to 6 projects
  } catch (error) {
    console.error("Error fetching GitHub projects:", error)
    return []
  }
}
