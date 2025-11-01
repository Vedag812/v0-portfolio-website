"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { useEffect, useState } from "react"
import type { GitHubProject } from "@/types/github-project" // Assuming GitHubProject is declared in a separate file

interface HuggingFaceProject {
  id: string
  name: string
  description: string | null
  url: string
  likes: number
  tags: string[]
  source: "huggingface"
}

type Project = GitHubProject | HuggingFaceProject

const FEATURED_PROJECTS = [
  {
    title: "X-Ray Classification System",
    description:
      "Classifies X-ray images into pneumonia and normal categories using CNN. Built with TensorFlow/Keras on 5,000+ images, achieving 78% accuracy with 82% precision and 75% recall.",
    technologies: ["TensorFlow", "Keras", "Python", "Deep Learning", "CNN"],
    category: "AI/ML",
    backgroundImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/projeects-aPhGSpss7UFqCD3Vm1nXWndTKJaqhM.jpg",
    link: "https://github.com/Vedag812",
    demoLink: "https://huggingface.co/spaces/Vedag812/Image_Xray_Classification",
  },
  {
    title: "Email Spam Classifier",
    description:
      "Detects and classifies emails as spam or non-spam using ML and NLP. Implemented TF-IDF vectorization and Naive Bayes, achieving 96% accuracy with interactive Gradio interface on Hugging Face Spaces.",
    technologies: ["Python", "Scikit-learn", "NLTK", "Gradio", "Machine Learning"],
    category: "NLP",
    backgroundImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/projeects-aPhGSpss7UFqCD3Vm1nXWndTKJaqhM.jpg",
    link: "https://huggingface.co/spaces/Vedag812/email_spam/tree/main",
    demoLink: "https://huggingface.co/spaces/Vedag812/email_spam",
  },
  {
    title: "Virtual Room Enhancer",
    description:
      "Improves room visuals and layout suggestions using generative AI. Enhanced AI-based room layouts with Google Gemini Studio, processing 100+ configurations with 95% real-time preview satisfaction.",
    technologies: ["Google Gemini", "Generative AI", "HTML/CSS", "JavaScript"],
    category: "Generative AI",
    backgroundImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/projeects-aPhGSpss7UFqCD3Vm1nXWndTKJaqhM.jpg",
    link: "https://github.com/Vedag812",
  },
]

export function Projects() {
  const [githubProjects, setGithubProjects] = useState<GitHubProject[]>([])
  const [huggingfaceProjects, setHuggingfaceProjects] = useState<HuggingFaceProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [githubRes, hfRes] = await Promise.all([
          fetch("/api/github-projects"),
          fetch("/api/huggingface-projects"),
        ])

        const githubData = await githubRes.json()
        const hfData = await hfRes.json()

        setGithubProjects(githubData)
        setHuggingfaceProjects(hfData)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const allProjects = [
    ...FEATURED_PROJECTS,
    ...githubProjects.filter((gp) => !FEATURED_PROJECTS.some((fp) => fp.title.toLowerCase() === gp.name.toLowerCase())),
    ...huggingfaceProjects.filter(
      (hf) => !FEATURED_PROJECTS.some((fp) => fp.title.toLowerCase() === hf.name.toLowerCase()),
    ),
  ]
  const displayProjects = allProjects.slice(0, 6)

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-balance">Featured Projects</h2>
          <p className="text-center text-gray-400 mb-12">
            {githubProjects.length > 0 || huggingfaceProjects.length > 0
              ? `Live projects from GitHub & Hugging Face (${allProjects.length} total)`
              : "Highlighted projects from my portfolio"}
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {displayProjects.map((project, index) => (
              <Card key={project.id || index} className="netflix-card hover-lift group relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{
                    backgroundImage: `url(${
                      "backgroundImage" in project
                        ? project.backgroundImage
                        : "/machine-learning-algorithms-code-visualization.jpg"
                    })`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-primary/50 text-primary bg-black/50">
                      {"source" in project
                        ? project.source === "huggingface"
                          ? "🤗 Hugging Face"
                          : "GitHub"
                        : "category" in project
                          ? project.category
                          : project.language || "Project"}
                    </Badge>
                    {("likes" in project ? project.likes : project.stars) > 0 && (
                      <Badge variant="secondary" className="bg-black/50 text-yellow-400 border-yellow-600">
                        ⭐ {"likes" in project ? project.likes : project.stars}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors gradient-text text-white">
                    {project.name || project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-200 mb-4 text-pretty">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(project.tags || project.topics || project.technologies || []).map((tech: string) => (
                      <Badge key={tech} variant="secondary" className="bg-black/50 text-white border-gray-600">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-black/50 text-white border-gray-600 hover:bg-white hover:text-black"
                    >
                      <a href={project.url || project.link} target="_blank" rel="noopener noreferrer">
                        {"source" in project && project.source === "huggingface" ? (
                          <>🤗 Code</>
                        ) : "link" in project && project.link?.includes("huggingface") ? (
                          <>🤗 Code</>
                        ) : (
                          <>
                            <Github className="h-4 w-4 mr-2" />
                            Code
                          </>
                        )}
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-black/50 text-white border-gray-600 hover:bg-white hover:text-black"
                    >
                      <a
                        href={
                          "demoLink" in project
                            ? project.demoLink
                            : "demoUrl" in project
                              ? project.demoUrl
                              : project.url || project.link
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
