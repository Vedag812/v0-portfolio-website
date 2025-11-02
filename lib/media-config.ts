export type MediaSectionKey = "about" | "skills" | "projectsFeatured" | "experience" | "contact"

export type ProfileType = "recruiter" | "student" | "explorer"

export interface ProfileConfig {
  image: string
  backgroundGif: string
  backgrounds: Record<MediaSectionKey, string>
}

export interface MediaConfig {
  profileImage: string
  profiles: Record<ProfileType, ProfileConfig>
}

const defaultBackgrounds: Record<MediaSectionKey, string> = {
  about: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about%20me-xjVJydBNu0KiSV3aXomDkHptDnLSRq.png",
  skills: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/skills-kjqaN7GQDjzEFWT7pZ8abRQS6DfTXb.png",
  projectsFeatured: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/projeects-aPhGSpss7UFqCD3Vm1nXWndTKJaqhM.jpg",
  experience: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/experience-B24f9rAK1SziWfvaTiWzsLN7Hi05M3.jpg",
  contact: "/contact-icons.jpg",
}

export const DEFAULT_MEDIA_CONFIG: MediaConfig = {
  profileImage: "/vedant-profile.jpg",
  profiles: {
    recruiter: {
      image: "/professional-recruiter-avatar-blue.jpg",
      backgroundGif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTZ5eWwwbjRpdWM1amxyd3VueHhteTVzajVjeGZtZGJ1dDc4MXMyNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/16u7Ifl2T4zYfQ932F/giphy.gif",
      backgrounds: { ...defaultBackgrounds },
    },
    student: {
      image: "/computer-science-student-avatar-red.jpg",
      backgroundGif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExc28yMjMyZmJ6eWtxbmNwdDV6cXk4dWZmcjFhZms2cXBjN2h5ZDJjeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QjZXUBUr89CkiWLPjL/giphy.gif",
      backgrounds: { ...defaultBackgrounds },
    },
    explorer: {
      image: "/tech-explorer-avatar-yellow.jpg",
      backgroundGif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmxib24ycWo2cjlmazh0NGV5NTZ2Mzd2YWY0M2tvam9oYXBwYW1ocCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ERKMnDK6tkzJe8YVa3/giphy-downsized-large.gif",
      backgrounds: { ...defaultBackgrounds },
    },
  },
}

export const MEDIA_SECTION_LABELS: Record<MediaSectionKey, string> = {
  about: "About section background",
  skills: "Skills section background",
  projectsFeatured: "Featured projects background",
  experience: "Experience section background",
  contact: "Contact section background",
}

export const PROFILE_LABELS: Record<ProfileType, string> = {
  recruiter: "Recruiter Profile",
  student: "Student Profile",
  explorer: "Explorer Profile",
}
