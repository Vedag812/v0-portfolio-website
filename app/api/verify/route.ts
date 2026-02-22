import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const token = request.headers.get("authorization")?.replace("Bearer ", "")
            || request.headers.get("x-admin-token")
        const adminToken = process.env.ADMIN_TOKEN

        if (!adminToken || token !== adminToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        return NextResponse.json({ success: true, message: "Token valid" })
    } catch {
        return NextResponse.json({ error: "Verification failed" }, { status: 500 })
    }
}
