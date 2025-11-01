"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"

const profiles = [
  {
    name: "recruiter",
    image: "/professional-recruiter-avatar-blue.jpg",
    backgroundGif:
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTZ5eWwwbjRpdWM1amxyd3VueHhteTVzajVjeGZtZGJ1dDc4MXMyNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/16u7Ifl2T4zYfQ932F/giphy.gif",
  },
  {
    name: "student",
    image: "/computer-science-student-avatar-red.jpg",
    backgroundGif:
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExc28yMjMyZmJ6eWtxbmNwdDV6cXk4dWZmcjFhZms2cXBjN2h5ZDJjeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QjZXUBUr89CkiWLPjL/giphy.gif",
  },
  {
    name: "explorer",
    image: "/tech-explorer-avatar-yellow.jpg",
    backgroundGif:
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmxib24ycWo2cjlmazh0NGV5NTZ2Mzd2YWY0M2tvam9oYXBwYW1ocCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ERKMnDK6tkzJe8YVa3/giphy-downsized-large.gif",
  },
]

export function Browse() {
  const router = useRouter()

  const handleProfileClick = (profile: (typeof profiles)[0]) => {
    router.push(`/profile/${profile.name}?bg=${encodeURIComponent(profile.backgroundGif)}`)
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-netflix-black">
      <h1 className="text-white text-3xl md:text-5xl font-normal mb-16 text-center">Who's Watching?</h1>
      <div className="flex gap-6 flex-wrap justify-center mb-32">
        {profiles.map((profile, index) => (
          <div
            key={index}
            className="netflix-profile-card cursor-pointer text-center"
            onClick={() => handleProfileClick(profile)}
          >
            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-2 rounded-lg overflow-hidden border-2 border-transparent hover:border-white transition-all">
              <Image
                src={profile.image || "/placeholder.svg"}
                alt={`${profile.name} profile`}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-white text-sm md:text-lg capitalize font-normal">{profile.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
