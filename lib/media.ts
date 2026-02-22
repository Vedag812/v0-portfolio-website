import "server-only"

import path from "path"
import { promises as fs } from "fs"
import { DEFAULT_MEDIA_CONFIG, type MediaConfig, type MediaSectionKey } from "@/lib/media-config"
import { getMediaConfig as getRedisMediaConfig } from "@/lib/upstash-storage"

const MEDIA_FILE_PATH = path.join(process.cwd(), "data", "media.json")

export const MEDIA_SECTION_KEYS: MediaSectionKey[] = ["about", "skills", "projectsFeatured", "experience", "contact"]

export async function getMediaConfig(): Promise<MediaConfig> {
  // 1. Try Upstash Redis first (works on Vercel production)
  try {
    const redisConfig = await getRedisMediaConfig()
    if (redisConfig && isMediaConfig(redisConfig)) {
      return redisConfig
    }
  } catch (error) {
    console.warn("Redis read failed, falling back to local file:", error)
  }

  // 2. Try local file (development)
  try {
    const file = await fs.readFile(MEDIA_FILE_PATH, "utf-8")
    const parsed = JSON.parse(file) as unknown
    if (isMediaConfig(parsed)) {
      return parsed
    }
    console.warn("media.json did not match expected shape. Falling back to defaults.")
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Failed to read media configuration:", error)
    }
  }

  // 3. Return defaults
  return DEFAULT_MEDIA_CONFIG
}

export async function updateMediaConfig(config: MediaConfig): Promise<void> {
  // On Vercel (serverless), filesystem is read-only
  // This will silently fail in production but work in development
  try {
    await fs.writeFile(MEDIA_FILE_PATH, JSON.stringify(config, null, 2), "utf-8")
  } catch (error) {
    console.warn("Failed to write media config (filesystem may be read-only):", error)
  }
}

export function isMediaConfig(value: unknown): value is MediaConfig {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as MediaConfig
  if (typeof candidate.profileImage !== "string") {
    return false
  }

  if (!candidate.profiles || typeof candidate.profiles !== "object") {
    return false
  }

  const profileKeys = Object.keys(candidate.profiles) as Array<keyof typeof candidate.profiles>
  return profileKeys.every((profileKey) => {
    const profile = candidate.profiles[profileKey]
    if (!profile || typeof profile !== "object") return false
    if (typeof profile.image !== "string") return false
    if (typeof profile.backgroundGif !== "string") return false
    if (!profile.backgrounds || typeof profile.backgrounds !== "object") return false
    return MEDIA_SECTION_KEYS.every((sectionKey) => typeof profile.backgrounds[sectionKey] === "string")
  })
}
