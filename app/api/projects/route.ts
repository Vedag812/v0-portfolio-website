import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { saveProjects, getProjects } from '@/lib/upstash-storage'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Try Upstash Redis first (production)
    const redisData = await getProjects()
    if (redisData) {
      return NextResponse.json(redisData, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        }
      })
    }

    // Fallback to local file (development or if Redis not configured)
    const filePath = path.join(process.cwd(), "data", "projects.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(fileContents)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      }
    })
  } catch (error) {
    console.error("Error reading projects:", error)
    return NextResponse.json({ projects: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const adminToken = process.env.ADMIN_TOKEN

    if (!adminToken || token !== adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const projects = data.projects || data

    let savedToRedis = false

    // Try Upstash Redis (production)
    try {
      await saveProjects(projects)
      savedToRedis = true
      console.log("✅ Projects saved to Upstash Redis")
    } catch (redisError) {
      console.warn("Redis save failed, trying local file:", redisError)
    }

    // Fallback to local file (development)
    if (!savedToRedis) {
      try {
        const filePath = path.join(process.cwd(), "data", "projects.json")
        fs.writeFileSync(filePath, JSON.stringify({ projects }, null, 2))
        console.log("✅ Projects saved to local file:", filePath)
      } catch (fsError) {
        if (process.env.VERCEL) {
          return NextResponse.json({
            error: "Save failed. Please configure Upstash Redis.",
            details: "Filesystem is read-only on Vercel and Redis is not configured."
          }, { status: 500 })
        }
        throw fsError
      }
    }

    return NextResponse.json({
      success: true,
      message: savedToRedis ? "Saved to Redis" : "Saved locally",
      projectCount: projects.length,
      storage: savedToRedis ? "upstash-redis" : "local-file"
    })
  } catch (error) {
    console.error("Error updating projects:", error)
    return NextResponse.json({
      error: "Failed to update projects",
      details: String(error)
    }, { status: 500 })
  }
}
