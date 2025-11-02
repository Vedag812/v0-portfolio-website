import { NextResponse } from "next/server"
import { getMediaConfig, updateMediaConfig, isMediaConfig } from "@/lib/media"

export async function GET() {
  const config = await getMediaConfig()
  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "no-store",
    },
  })
}

export async function PUT(request: Request) {
  const adminToken = process.env.ADMIN_TOKEN
  const providedToken = request.headers.get("x-admin-token") || request.headers.get("authorization")?.replace("Bearer ", "")

  if (!adminToken) {
    return NextResponse.json({ message: "ADMIN_TOKEN is not configured on the server." }, { status: 500 })
  }

  if (!providedToken || providedToken !== adminToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  if (!isMediaConfig(payload)) {
    return NextResponse.json({ message: "Payload does not match expected schema." }, { status: 400 })
  }

  await updateMediaConfig(payload)

  return NextResponse.json({ success: true })
}
