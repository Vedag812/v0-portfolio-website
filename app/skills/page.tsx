import { Skills } from "@/components/skills"
import { LeetCodeStats } from "@/components/leetcode-stats"
import { NetflixLayout } from "@/components/netflix-layout"

export default function SkillsPage() {
  return (
    <NetflixLayout>
      <Skills />
      <LeetCodeStats />
    </NetflixLayout>
  )
}
