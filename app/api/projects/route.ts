import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const projectsFilePath = path.join(process.cwd(), "data", "projects.json")

export async function GET() {
  try {
    const fileContents = fs.readFileSync(projectsFilePath, "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading projects:", error)
    return NextResponse.json({ projects: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    fs.writeFileSync(projectsFilePath, JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true, message: "Projects updated successfully" })
  } catch (error) {
    console.error("Error updating projects:", error)
    return NextResponse.json({ error: "Failed to update projects" }, { status: 500 })
  }
}
