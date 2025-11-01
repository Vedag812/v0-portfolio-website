import { ProfilePage } from "@/components/profile-page"

interface ProfilePageProps {
  params: {
    profileName: string
  }
}

export default function Profile({ params }: ProfilePageProps) {
  return (
    <main className="min-h-screen bg-netflix-black">
      <ProfilePage profileName={params.profileName} />
    </main>
  )
}
