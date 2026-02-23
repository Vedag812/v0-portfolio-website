"use client"

import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Star } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { GitHubProject } from "@/lib/github"
import { useMediaConfig } from "@/components/media-config-provider"
import { ProjectModal } from "@/components/project-modal"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import Image from "next/image"

interface HuggingFaceProject {
  id: string
  name: string
  description: string | null
  url: string
  likes: number
  tags: string[]
  source: "huggingface"
}

interface CustomProject {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  github: string
  demo: string
  featured: boolean
  visible: boolean
  category: string
}

type Project = GitHubProject | HuggingFaceProject | CustomProject

function getProjectTitle(project: Project): string {
  if ("title" in project) return project.title
  if ("name" in project) return project.name
  return "Untitled Project"
}

function getProjectTechnologies(project: Project): string[] {
  if ("technologies" in project) return project.technologies
  if ("topics" in project) return project.topics
  if ("tags" in project) return project.tags
  return []
}

function getProjectLink(project: Project): string {
  if ("url" in project) return project.url
  if ("github" in project) return project.github
  return ""
}

function getProjectStars(project: Project): number {
  if ("likes" in project) return project.likes
  if ("stars" in project) return project.stars
  return 0
}

// Determine category from language/topics/tags
function inferCategory(project: Project): string {
  if ("category" in project && project.category) {
    const cat = project.category.toLowerCase()
    if (cat.includes("ai") || cat.includes("ml") || cat.includes("machine") || cat.includes("tensorflow") || cat.includes("deep")) return "AI/ML"
    if (cat.includes("nlp") || cat.includes("text") || cat.includes("language") || cat.includes("sentiment") || cat.includes("nltk")) return "NLP"
    if (cat.includes("data") || cat.includes("analytics") || cat.includes("pandas") || cat.includes("jupyter") || cat.includes("notebook") || cat.includes("power bi") || cat.includes("sql")) return "Data Science"
    if (cat.includes("web") || cat.includes("react") || cat.includes("next") || cat.includes("typescript") || cat.includes("full") || cat.includes("node")) return "Full Stack"
    if (cat.includes("python")) return "Python"
  }

  const techs = getProjectTechnologies(project).map(t => t.toLowerCase()).join(" ")
  const title = getProjectTitle(project).toLowerCase()
  const desc = (project.description || "").toLowerCase()
  const all = `${techs} ${title} ${desc}`

  if (all.includes("nlp") || all.includes("nltk") || all.includes("text class") || all.includes("sentiment") || all.includes("spam") || all.includes("language processing")) return "NLP"
  if (all.includes("tensorflow") || all.includes("keras") || all.includes("pytorch") || all.includes("neural") || all.includes("deep learn") || all.includes("cnn") || all.includes("machine learn") || all.includes("model train")) return "AI/ML"
  if (all.includes("data analy") || all.includes("pandas") || all.includes("power bi") || all.includes("tableau") || all.includes("visualization") || all.includes("eda") || all.includes("dashboard") || all.includes("jupyter notebook")) return "Data Science"
  if (all.includes("react") || all.includes("next.js") || all.includes("typescript") || all.includes("node") || all.includes("full stack") || all.includes("web app") || all.includes("frontend") || all.includes("tailwind")) return "Full Stack"

  if ("language" in project) {
    const lang = ((project as any).language || "").toLowerCase()
    if (lang === "jupyter notebook" || lang === "r") return "Data Science"
    if (lang === "python") return "Python"
    if (lang === "typescript" || lang === "javascript") return "Full Stack"
  }

  return "Other"
}

// Category-specific fallback images
const CATEGORY_IMAGES: Record<string, string> = {
  "AI/ML": "/images/projects/aiml.png",
  "NLP": "/images/projects/nlp.png",
  "Data Science": "/images/projects/data.png",
  "Full Stack": "/images/projects/fullstack.png",
  "Python": "/images/projects/data.png",
  "Other": "/images/projects/data.png",
}

function getProjectImage(project: Project, category: string): string {
  if ("image" in project && project.image && !project.image.includes("opengraph.githubassets.com")) {
    return project.image
  }
  return CATEGORY_IMAGES[category] || CATEGORY_IMAGES["Other"]
}

const DISPLAY_CATEGORIES = ["All", "AI/ML", "NLP", "Data Science", "Full Stack", "Python"]

export function Projects() {
  const media = useMediaConfig()
  const [githubProjects, setGithubProjects] = useState<GitHubProject[]>([])
  const [huggingfaceProjects, setHuggingfaceProjects] = useState<HuggingFaceProject[]>([])
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const revealRef = useScrollReveal()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const customRes = await fetch("/api/projects", { cache: "no-store" })
        const customData = await customRes.json()
        setGithubProjects([])
        setHuggingfaceProjects([])
        setCustomProjects((customData.projects || []).filter((p: CustomProject) => p.visible))
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }
    fetchProjects()
    const interval = setInterval(fetchProjects, 60000)
    return () => clearInterval(interval)
  }, [])

  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const featuredCustomProjects = customProjects.filter(p => p.featured)
  const regularCustomProjects = customProjects.filter(p => !p.featured)

  const allProjects: Project[] = [
    ...featuredCustomProjects,
    ...regularCustomProjects,
    ...githubProjects,
    ...huggingfaceProjects,
  ]

  // Assign categories to all projects
  const projectsWithCategories = useMemo(() =>
    allProjects.map(p => ({ project: p, category: inferCategory(p) })),
    [allProjects]
  )

  const filteredProjects = selectedCategory === "All"
    ? projectsWithCategories
    : projectsWithCategories.filter(({ category }) => category === selectedCategory)

  // Category colors for badges
  const categoryColors: Record<string, string> = {
    "AI/ML": "bg-red-500/20 text-red-300 border-red-500/30",
    "NLP": "bg-green-500/20 text-green-300 border-green-500/30",
    "Data Science": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "Full Stack": "bg-orange-500/20 text-orange-300 border-orange-500/30",
    "Python": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    "Other": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  }

  return (
    <section id="projects" className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 reveal">
            <h2 className="text-3xl sm:text-5xl font-bold mb-3 gradient-text">
              Featured Projects
            </h2>
            <p className="text-gray-400 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto">
              Highlighted projects from my portfolio
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-4xl mx-auto">
            {DISPLAY_CATEGORIES.map((category) => {
              const count = category === "All"
                ? projectsWithCategories.length
                : projectsWithCategories.filter(p => p.category === category).length
              if (count === 0 && category !== "All") return null
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${selectedCategory === category
                    ? "bg-netflix-red text-white shadow-lg shadow-netflix-red/30"
                    : "bg-white/5 dark:bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {category}
                  <span className="ml-1.5 opacity-60">({count})</span>
                </button>
              )
            })}
          </div>

          {/* Projects Grid */}
          <div ref={revealRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 stagger-children">
            {filteredProjects.map(({ project, category }, index) => {
              const title = getProjectTitle(project)
              const techs = getProjectTechnologies(project)
              const link = getProjectLink(project)
              const stars = getProjectStars(project)
              const image = getProjectImage(project, category)
              const demo = "demo" in project ? project.demo : "url" in project ? project.url : link
              const featured = "featured" in project ? project.featured : false

              return (
                <div
                  key={project.id ?? `${title}-${index}`}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-netflix-red/10 card-shimmer hover-lift ${featured ? "ring-1 ring-yellow-500/40" : ""
                    }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Card image */}
                  <div className="relative h-[180px] sm:h-[200px] overflow-hidden bg-netflix-dark-gray">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

                    {/* Category + featured badges */}
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      <Badge className={`text-[10px] border backdrop-blur-sm ${categoryColors[category] || categoryColors["Other"]}`}>
                        {category}
                      </Badge>
                      {featured && (
                        <Badge className="bg-yellow-500/80 text-black text-[10px] border-0">
                          ★ Featured
                        </Badge>
                      )}
                    </div>
                    {stars > 0 && (
                      <div className="absolute top-2.5 right-2.5">
                        <Badge className="bg-black/60 text-yellow-400 text-[10px] border-0 backdrop-blur-sm">
                          <Star className="h-2.5 w-2.5 fill-current mr-0.5" />
                          {stars}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Card content */}
                  <div className="bg-[#1a1a1a] dark:bg-[#1a1a1a] p-4 sm:p-5 space-y-2.5">
                    <h3 className="text-white font-semibold text-sm sm:text-base leading-tight line-clamp-1 group-hover:text-netflix-red transition-colors">
                      {title}
                    </h3>

                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
                      {project.description || "No description available"}
                    </p>

                    {/* Tech tags */}
                    {techs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {techs.slice(0, 4).map((tech: string) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-[10px] sm:text-[11px] rounded-md bg-white/5 text-gray-300 border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                        {techs.length > 4 && (
                          <span className="px-2 py-0.5 text-[10px] sm:text-[11px] rounded-md bg-white/5 text-gray-500">
                            +{techs.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      {link && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg bg-white/5 text-gray-300 hover:bg-white/15 hover:text-white border border-white/10 transition-all"
                        >
                          <Github className="h-3.5 w-3.5" />
                          Code
                        </a>
                      )}
                      {demo && demo !== link && (
                        <a
                          href={demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg bg-netflix-red/10 text-netflix-red hover:bg-netflix-red hover:text-white border border-netflix-red/30 transition-all"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No projects found in this category.</p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="mt-3 text-netflix-red hover:text-netflix-red/80 text-sm font-medium transition-colors"
              >
                Show all projects →
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}
