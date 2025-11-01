const HUGGINGFACE_USERNAME = "Vedag812"
const HUGGINGFACE_API_URL = "https://huggingface.co/api"

export interface HuggingFaceProject {
  id: string
  name: string
  description: string | null
  url: string
  demoUrl?: string
  likes: number
  tags: string[]
  source: "huggingface"
}

export async function fetchHuggingFaceProjects(): Promise<HuggingFaceProject[]> {
  try {
    // Fetch user's spaces specifically
    const spacesResponse = await fetch(`${HUGGINGFACE_API_URL}/spaces?author=${HUGGINGFACE_USERNAME}&limit=50`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!spacesResponse.ok) {
      throw new Error("Failed to fetch Hugging Face spaces")
    }

    const spaces = await spacesResponse.json()

    return (Array.isArray(spaces) ? spaces : [])
      .map((space: any) => ({
        id: space.id || space.name,
        name: space.name || space.id,
        description: space.description || space.private_description || null,
        url: `https://huggingface.co/spaces/${HUGGINGFACE_USERNAME}/${space.name}`,
        demoUrl: `https://huggingface.co/spaces/${HUGGINGFACE_USERNAME}/${space.name}`,
        likes: space.likes || 0,
        tags: space.tags || [],
        source: "huggingface",
      }))
      .filter((project) => project.description) // Filter out projects without description
      .slice(0, 10) // Limit to 10 projects
  } catch (error) {
    console.error("Error fetching Hugging Face projects:", error)
    return []
  }
}
