"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { GitHubProject } from "@/lib/github"
import { useMediaConfig } from "@/components/media-config-provider"
import { scrollContainerBy, useHorizontalScroll } from "@/hooks/use-horizontal-scroll"
import { ProjectModal } from "@/components/project-modal"

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

// Helper functions to safely access properties
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

function getProjectImage(project: Project, defaultImage: string): string {
  if ("image" in project && project.image) return project.image
  return defaultImage
}

export function Projects() {
  const media = useMediaConfig()
  const [githubProjects, setGithubProjects] = useState<GitHubProject[]>([])
  const [huggingfaceProjects, setHuggingfaceProjects] = useState<HuggingFaceProject[]>([])
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Only fetch custom projects from admin dashboard
        const customRes = await fetch("/api/projects", { cache: "no-store" })
        const customData = await customRes.json()

        // Clear GitHub and HuggingFace projects - only show custom projects
        setGithubProjects([])
        setHuggingfaceProjects([])
        setCustomProjects((customData.projects || []).filter((p: CustomProject) => p.visible))
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    fetchProjects()
    
    // Auto-refresh every 5 seconds to sync with admin changes
    const interval = setInterval(fetchProjects, 5000)
    return () => clearInterval(interval)
  }, [])

  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  
  // Get unique categories from custom projects, GitHub topics, and HF tags
  const allCategories = useMemo(() => {
    const cats = new Set<string>(["All"])
    customProjects.forEach(p => cats.add(p.category))
    githubProjects.forEach(p => p.topics.forEach(t => cats.add(t)))
    huggingfaceProjects.forEach(p => p.tags.forEach(t => cats.add(t)))
    return Array.from(cats)
  }, [customProjects, githubProjects, huggingfaceProjects])

  // Combine featured custom projects with others
  const featuredCustomProjects = customProjects.filter(p => p.featured)
  const regularCustomProjects = customProjects.filter(p => !p.featured)
  
  const allProjects: Project[] = [
    ...featuredCustomProjects,
    ...regularCustomProjects,
    ...githubProjects,
    ...huggingfaceProjects,
  ]
  
  const filteredProjects = selectedCategory === "All" 
    ? allProjects 
    : allProjects.filter(project => {
        if ("category" in project && project.category) {
          return project.category === selectedCategory
        }
        if ("tags" in project && project.tags) {
          return project.tags.includes(selectedCategory)
        }
        if ("topics" in project && project.topics) {
          return project.topics.includes(selectedCategory)
        }
        return false
      });
  
  const displayProjects = filteredProjects.slice(0, 20)
  const { ref: scrollRef, scrollState } = useHorizontalScroll<HTMLDivElement>()

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-balance">Featured Projects</h2>
          <p className="text-center text-gray-400 mb-8">
            {githubProjects.length > 0 || huggingfaceProjects.length > 0
              ? `Live projects from GitHub & Hugging Face (${allProjects.length} total)`
              : "Highlighted projects from my portfolio"}
          </p>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-netflix-red text-white shadow-lg shadow-netflix-red/50"
                    : "bg-netflix-dark-gray text-gray-300 hover:bg-netflix-light-gray hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <div className={`scroll-gradient-left ${scrollState.canScrollLeft ? "opacity-100" : "opacity-0"}`} />
            <div className={`scroll-gradient-right ${scrollState.canScrollRight ? "opacity-100" : "opacity-0"}`} />
            <button
              type="button"
              className={`scroll-nav-button left-4 ${scrollState.canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              onClick={() => scrollContainerBy(scrollRef, -360)}
              aria-label="Scroll projects left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              className={`scroll-nav-button right-4 ${scrollState.canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              onClick={() => scrollContainerBy(scrollRef, 360)}
              aria-label="Scroll projects right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div
              ref={scrollRef}
              className="horizontal-scroll-container flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
            >
              {displayProjects.map((project, index) => {
                const title = getProjectTitle(project)
                const techs = getProjectTechnologies(project)
                const link = getProjectLink(project)
                const stars = getProjectStars(project)
                const image = getProjectImage(project, media.backgrounds.projectsFeatured)
                const demo = "demo" in project ? project.demo : "url" in project ? project.url : link
                const category = "category" in project ? project.category : ("source" in project ? (project.source === "huggingface" ? "🤗 Hugging Face" : "GitHub") : ("language" in project ? project.language : "Project"))
                const featured = "featured" in project ? project.featured : false

                return (
                <Card
                  key={project.id ?? `${title}-${index}`}
                  className={`netflix-card hover-lift group relative overflow-hidden flex-shrink-0 w-[280px] md:w-[340px] snap-start cursor-pointer ${featured ? 'ring-2 ring-yellow-500' : ''}`}
                  onClick={() => setSelectedProject(project)}
                >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{
                    backgroundImage: `url(${image})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-primary/50 text-primary bg-black/50">
                      {category}
                    </Badge>
                    {stars > 0 && (
                      <Badge variant="secondary" className="bg-black/50 text-yellow-400 border-yellow-600">
                        ⭐ {stars}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors gradient-text text-white">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-200 mb-4 text-pretty">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {techs.map((tech: string) => (
                      <Badge key={tech} variant="secondary" className="bg-black/50 text-white border-gray-600">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {link && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-black/50 text-white border-gray-600 hover:bg-white hover:text-black"
                      >
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          {"source" in project && project.source === "huggingface" ? (
                            <>🤗 Code</>
                          ) : (
                            <>
                              <Github className="h-4 w-4 mr-2" />
                              Code
                            </>
                          )}
                        </a>
                      </Button>
                    )}
                    {demo && demo !== link && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-black/50 text-white border-gray-600 hover:bg-white hover:text-black"
                      >
                        <a
                          href={demo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Project Detail Modal */}
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
