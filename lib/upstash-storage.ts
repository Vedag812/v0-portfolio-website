import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client
// User needs to set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in env
function getRedis(): Redis | null {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) return null
    return new Redis({ url, token })
}

// Keys
const PROJECTS_KEY = 'portfolio:projects'
const MEDIA_KEY = 'portfolio:media'

// ── Projects ──────────────────────────────────────────

export async function saveProjects(projects: any[]) {
    const redis = getRedis()
    if (!redis) {
        throw new Error('Upstash Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.')
    }
    await redis.set(PROJECTS_KEY, JSON.stringify({ projects }))
}

export async function getProjects(): Promise<{ projects: any[] } | null> {
    const redis = getRedis()
    if (!redis) return null

    try {
        const data = await redis.get<string>(PROJECTS_KEY)
        if (!data) return null
        // Upstash may return parsed object or string depending on what was stored
        if (typeof data === 'string') {
            return JSON.parse(data)
        }
        return data as any
    } catch (error) {
        console.warn('Failed to read projects from Redis:', error)
        return null
    }
}

// ── Media Config ──────────────────────────────────────

export async function saveMediaConfig(mediaConfig: any) {
    const redis = getRedis()
    if (!redis) {
        throw new Error('Upstash Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.')
    }
    await redis.set(MEDIA_KEY, JSON.stringify(mediaConfig))
}

export async function getMediaConfig(): Promise<any | null> {
    const redis = getRedis()
    if (!redis) return null

    try {
        const data = await redis.get<string>(MEDIA_KEY)
        if (!data) return null
        if (typeof data === 'string') {
            return JSON.parse(data)
        }
        return data
    } catch (error) {
        console.warn('Failed to read media config from Redis:', error)
        return null
    }
}
