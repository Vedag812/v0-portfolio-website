import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { put, list, del } from '@vercel/blob'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

export async function GET() {
  try {
    // Try Vercel Blob first (production)
    if (BLOB_TOKEN && process.env.VERCEL) {
      try {
        const { blobs } = await list({ token: BLOB_TOKEN, prefix: 'portfolio-projects' })
        if (blobs.length > 0) {
          const latestBlob = blobs.sort((a, b) => 
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          )[0]
          const response = await fetch(latestBlob.url, { cache: 'no-store' })
          if (response.ok) {
            const data = await response.json()
            return NextResponse.json(data, {
              headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
              }
            })
          }
        }
      } catch (blobError) {
        console.warn("Blob read failed, falling back to local file:", blobError)
      }
    }
    
    // Fallback to local file (development or if blob fails)
    const filePath = path.join(process.cwd(), "data", "projects.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(fileContents)
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
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
    const adminToken = process.env.ADMIN_TOKEN || "vedant123"

    if (token !== adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const projects = data.projects || data
    
    let savedToBlob = false
    
    // Try Vercel Blob (production)
    if (BLOB_TOKEN && process.env.VERCEL) {
      try {
        // Delete old blobs
        const { blobs } = await list({ token: BLOB_TOKEN, prefix: 'portfolio-projects' })
        for (const blob of blobs) {
          await del(blob.url, { token: BLOB_TOKEN })
        }
        
        // Save new blob
        const timestamp = Date.now()
        await put(`portfolio-projects-${timestamp}.json`, JSON.stringify({ projects }, null, 2), {
          access: 'public',
          contentType: 'application/json',
          token: BLOB_TOKEN,
        })
        
        savedToBlob = true
        console.log("✅ Projects saved to Vercel Blob")
      } catch (blobError) {
        console.warn("Blob save failed:", blobError)
      }
    }
    
    // Always try local file save (for development or backup)
    if (!savedToBlob) {
      try {
        const filePath = path.join(process.cwd(), "data", "projects.json")
        fs.writeFileSync(filePath, JSON.stringify({ projects }, null, 2))
        console.log("✅ Projects saved to local file:", filePath)
      } catch (fsError) {
        if (process.env.VERCEL && !savedToBlob) {
          // In production without blob storage
          return NextResponse.json({ 
            error: "Production save failed. Please set up Vercel Blob storage.",
            details: "Filesystem is read-only on Vercel"
          }, { status: 500 })
        }
        throw fsError
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: savedToBlob ? "Saved to cloud storage" : "Saved locally",
      projectCount: projects.length,
      storage: savedToBlob ? "vercel-blob" : "local-file"
    })
  } catch (error) {
    console.error("Error updating projects:", error)
    return NextResponse.json({ 
      error: "Failed to update projects",
      details: String(error)
    }, { status: 500 })
  }
}
