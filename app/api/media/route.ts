import { NextResponse } from "next/server"
import { getMediaConfig as getRedisMediaConfig, saveMediaConfig } from "@/lib/upstash-storage"
import { isMediaConfig } from "@/lib/media"
import { DEFAULT_MEDIA_CONFIG } from "@/lib/media-config"

export async function GET() {
  // Try Redis first
  const redisConfig = await getRedisMediaConfig()
  if (redisConfig && isMediaConfig(redisConfig)) {
    return NextResponse.json(redisConfig, {
      headers: { "Cache-Control": "no-store" },
    })
  }

  // Fallback to defaults
  return NextResponse.json(DEFAULT_MEDIA_CONFIG, {
    headers: { "Cache-Control": "no-store" },
  })
}

export async function PUT(request: Request) {
  const adminToken = process.env.ADMIN_TOKEN
  const providedToken = request.headers.get("x-admin-token") || request.headers.get("authorization")?.replace("Bearer ", "")

  if (!adminToken || !providedToken || providedToken !== adminToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  if (!isMediaConfig(payload)) {
    return NextResponse.json({ message: "Payload does not match expected schema." }, { status: 400 })
  }

  // Save to Upstash Redis
  await saveMediaConfig(payload)

  return NextResponse.json({ success: true })
}
