import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const LEETCODE_API = "https://leetcode.com/graphql"
const USERNAME = "Vedag812"

const USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
        reputation
        starRating
      }
      submitStatsGlobal: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userCalendar {
        streak
        totalActiveDays
      }
    }
  }
`

export async function GET() {
    try {
        const response = await fetch(LEETCODE_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com",
                "Origin": "https://leetcode.com",
            },
            body: JSON.stringify({
                query: USER_PROFILE_QUERY,
                variables: { username: USERNAME },
            }),
            next: { revalidate: 3600 },
        })

        if (!response.ok) {
            throw new Error(`LeetCode API responded with ${response.status}`)
        }

        const data = await response.json()
        const user = data?.data?.matchedUser

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
        }

        // Parse submission stats
        const submissions = user.submitStatsGlobal?.acSubmissionNum || []
        const stats = {
            username: user.username,
            ranking: user.profile?.ranking || 0,
            reputation: user.profile?.reputation || 0,
            totalSolved: 0,
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            streak: user.userCalendar?.streak || 0,
            totalActiveDays: user.userCalendar?.totalActiveDays || 0,
        }

        for (const s of submissions) {
            if (s.difficulty === "All") stats.totalSolved = s.count
            if (s.difficulty === "Easy") stats.easySolved = s.count
            if (s.difficulty === "Medium") stats.mediumSolved = s.count
            if (s.difficulty === "Hard") stats.hardSolved = s.count
        }

        return NextResponse.json({ success: true, stats })
    } catch (error) {
        console.error("LeetCode API error:", error)

        // Return fallback data so the component never appears broken
        return NextResponse.json({
            success: true,
            stats: {
                username: USERNAME,
                ranking: 0,
                reputation: 0,
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0,
                streak: 0,
                totalActiveDays: 0,
            },
            fallback: true,
        })
    }
}
