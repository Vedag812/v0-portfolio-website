import { fetchHuggingFaceProjects } from "@/lib/huggingface"

export async function GET() {
  try {
    const projects = await fetchHuggingFaceProjects()
    return Response.json(projects)
  } catch (error) {
    console.error("Error in Hugging Face projects API:", error)
    return Response.json([], { status: 500 })
  }
}
