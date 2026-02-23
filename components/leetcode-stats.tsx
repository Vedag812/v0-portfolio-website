"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Trophy, Flame, Code2, Target } from "lucide-react"

interface LeetCodeData {
    username: string
    ranking: number
    totalSolved: number
    easySolved: number
    mediumSolved: number
    hardSolved: number
    streak: number
    totalActiveDays: number
}

// Total problems on LeetCode (approximate)
const TOTAL_EASY = 830
const TOTAL_MEDIUM = 1730
const TOTAL_HARD = 760

export function LeetCodeStats() {
    const [stats, setStats] = useState<LeetCodeData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/leetcode")
            .then((r) => r.json())
            .then((d) => {
                if (d.success) setStats(d.stats)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="bg-[#1a1a1a] rounded-2xl p-6 sm:p-8 animate-pulse">
                <div className="h-6 bg-netflix-dark-gray rounded w-48 mb-6" />
                <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-netflix-dark-gray rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (!stats || stats.totalSolved === 0) return null

    const difficultyData = [
        {
            label: "Easy",
            solved: stats.easySolved,
            total: TOTAL_EASY,
            color: "from-emerald-500 to-emerald-400",
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-400",
            borderColor: "border-emerald-500/20",
        },
        {
            label: "Medium",
            solved: stats.mediumSolved,
            total: TOTAL_MEDIUM,
            color: "from-amber-500 to-yellow-400",
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-400",
            borderColor: "border-amber-500/20",
        },
        {
            label: "Hard",
            solved: stats.hardSolved,
            total: TOTAL_HARD,
            color: "from-red-500 to-rose-400",
            bgColor: "bg-red-500/10",
            textColor: "text-red-400",
            borderColor: "border-red-500/20",
        },
    ]

    return (
        <section className="py-10 sm:py-14">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Card */}
                    <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl border border-white/5 overflow-hidden gradient-border card-shimmer">
                        {/* Subtle glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />

                        <div className="relative p-6 sm:p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20">
                                        <Code2 className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg sm:text-xl">LeetCode Stats</h3>
                                        <p className="text-gray-500 text-xs">@{stats.username}</p>
                                    </div>
                                </div>
                                <a
                                    href={`https://leetcode.com/u/${stats.username}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    Profile
                                </a>
                            </div>

                            {/* Top stats row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 text-center">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <Target className="w-3.5 h-3.5 text-blue-400" />
                                        <span className="text-[11px] text-gray-500 uppercase tracking-wider">Solved</span>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalSolved}</p>
                                </div>

                                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 text-center">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-[11px] text-gray-500 uppercase tracking-wider">Ranking</span>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-white">
                                        {stats.ranking > 0 ? stats.ranking.toLocaleString() : "—"}
                                    </p>
                                </div>

                                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 text-center">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-[11px] text-gray-500 uppercase tracking-wider">Streak</span>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-white">{stats.streak}</p>
                                </div>

                                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 text-center">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <Code2 className="w-3.5 h-3.5 text-green-400" />
                                        <span className="text-[11px] text-gray-500 uppercase tracking-wider">Active Days</span>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalActiveDays}</p>
                                </div>
                            </div>

                            {/* Difficulty breakdown */}
                            <div className="space-y-4">
                                {difficultyData.map((d) => {
                                    const pct = d.total > 0 ? Math.round((d.solved / d.total) * 100) : 0
                                    return (
                                        <div key={d.label}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className={`text-sm font-semibold ${d.textColor}`}>{d.label}</span>
                                                <span className="text-xs text-gray-500">
                                                    <span className="text-white font-medium">{d.solved}</span> / {d.total}
                                                </span>
                                            </div>
                                            <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${d.color} transition-all duration-1000 ease-out`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
