import { fetchGitHubProjects } from "@/lib/github"

export async function GET() {
  try {
    const projects = await fetchGitHubProjects()
    return Response.json(projects)
  } catch (error) {
    console.error("Error in GitHub projects API:", error)
    return Response.json([], { status: 500 })
  }
}
