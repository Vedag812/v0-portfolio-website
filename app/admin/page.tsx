"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  LogOut, Save, Plus, Trash2, Edit2, Eye, EyeOff, Star, StarOff,
  Github, ExternalLink, X, Image as ImageIcon, FolderOpen,
  Activity, TrendingUp, Code2, Copy, RefreshCw, Upload, Download,
  Sun, Moon, Check, Circle, FileText, Briefcase, GraduationCap,
  Mail, MapPin, Award
} from "lucide-react"
import type { MediaConfig, MediaSectionKey, ProfileType } from "@/lib/media-config"
import { DEFAULT_MEDIA_CONFIG, MEDIA_SECTION_LABELS, PROFILE_LABELS } from "@/lib/media-config"

interface Project {
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

interface StatusMessage {
  type: "success" | "error" | "info"
  text: string
}

const SECTION_KEYS = Object.keys(MEDIA_SECTION_LABELS) as MediaSectionKey[]
const PROFILE_KEYS = Object.keys(PROFILE_LABELS) as ProfileType[]

export default function AdminDashboard() {
  const [storedToken, setStoredToken] = useState<string | null>(null)
  const [loginToken, setLoginToken] = useState("")
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "github" | "content" | "media">("overview")
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  // Projects State
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [isSavingProjects, setIsSavingProjects] = useState(false)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Project | null>(null)
  const [newTech, setNewTech] = useState("")

  // Media State
  const [mediaConfig, setMediaConfig] = useState<MediaConfig>(DEFAULT_MEDIA_CONFIG)
  const [isLoadingMedia, setIsLoadingMedia] = useState(false)
  const [isSavingMedia, setIsSavingMedia] = useState(false)
  const [expandedProfile, setExpandedProfile] = useState<ProfileType | null>("recruiter")
  const [showPreviews, setShowPreviews] = useState(true)

  // GitHub Import
  const [githubRepos, setGithubRepos] = useState<any[]>([])
  const [isLoadingGithub, setIsLoadingGithub] = useState(false)
  const [githubSearch, setGithubSearch] = useState("")

  // Status
  const [status, setStatus] = useState<StatusMessage | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    const savedToken = window.localStorage.getItem("adminToken")
    const savedTheme = window.localStorage.getItem("theme") as "dark" | "light"
    if (savedToken) setStoredToken(savedToken)
    if (savedTheme) setTheme(savedTheme)
  }, [])

  useEffect(() => {
    if (storedToken) {
      void fetchAllData()
    }
  }, [storedToken])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem("theme", theme)
  }, [theme])

  const fetchAllData = async () => {
    setIsLoadingProjects(true)
    setIsLoadingMedia(true)
    try {
      // Only fetch custom projects and media - no GitHub/HuggingFace
      const [projectsRes, mediaRes] = await Promise.all([
        fetch("/api/projects", { cache: "no-store" }),
        fetch("/api/media", { cache: "no-store" })
      ])

      const projectsData = await projectsRes.json()
      const mediaData = await mediaRes.json()

      setProjects(projectsData.projects || [])
      setMediaConfig(mediaData)
    } catch (error) {
      console.error(error)
      setStatus({ type: "error", text: "Failed to load data" })
    } finally {
      setIsLoadingProjects(false)
      setIsLoadingMedia(false)
    }
  }

  const handleLogin = async () => {
    if (!loginToken.trim()) {
      setStatus({ type: "error", text: "Please enter your admin token." })
      return
    }

    setIsLoggingIn(true)
    setStatus({ type: "info", text: "Verifying password..." })

    // Verify token via safe endpoint (does NOT modify data)
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginToken.trim()}`
        },
      })

      if (response.status === 401) {
        setStatus({ type: "error", text: "❌ Wrong password! Access denied." })
        setLoginToken("")
        setIsLoggingIn(false)
        return
      }

      if (!response.ok) {
        throw new Error("Verification failed")
      }

      // Token is valid, store it
      window.localStorage.setItem("adminToken", loginToken.trim())
      setStoredToken(loginToken.trim())
      setLoginToken("")
      setStatus({ type: "success", text: "✅ Login successful!" })
      setTimeout(() => setStatus(null), 2000)
    } catch (error) {
      setStatus({ type: "error", text: "Failed to verify token. Try again." })
      setLoginToken("")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("adminToken")
    setStoredToken(null)
    setStatus({ type: "success", text: "Logged out successfully." })
    setActiveTab("overview")
  }

  // Project Management Functions
  const handleSaveProjects = async () => {
    if (!storedToken) return
    setIsSavingProjects(true)

    console.log("💾 Saving projects:", projects.length, "total projects")
    console.log("Visible projects:", projects.filter(p => p.visible).length)
    console.log("Hidden projects:", projects.filter(p => !p.visible).length)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${storedToken}` },
        body: JSON.stringify({ projects }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to save")
      }

      console.log("✅ Save response:", result)

      // Force refresh the projects data
      await fetch("/api/projects", { cache: "no-store" })

      setStatus({ type: "success", text: `✅ Saved ${result.projectCount} projects! Refresh /projects page to see changes.` })
      setTimeout(() => setStatus(null), 5000)
    } catch (error) {
      console.error("❌ Save error:", error)
      setStatus({ type: "error", text: "Failed to save projects: " + String(error) })
    } finally {
      setIsSavingProjects(false)
    }
  }

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "New Project",
      description: "Project description",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
      technologies: [],
      github: "",
      demo: "",
      featured: false,
      visible: true,
      category: "Web Development"
    }
    setProjects([newProject, ...projects])
    setEditingProject(newProject.id)
    setEditForm(newProject)
  }

  const handleDeleteProject = (id: string) => {
    if (confirm("Delete this project?")) {
      setProjects(projects.filter(p => p.id !== id))
      setStatus({ type: "info", text: "Project deleted. Remember to save." })
      setTimeout(() => setStatus(null), 3000)
    }
  }

  const handleToggleFeatured = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, featured: !p.featured } : p))
    setStatus({ type: "info", text: "Featured status changed. Click Save to apply." })
    setTimeout(() => setStatus(null), 3000)
  }

  const handleToggleVisible = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, visible: !p.visible } : p))
    setStatus({ type: "info", text: "Visibility changed. Click Save to apply." })
    setTimeout(() => setStatus(null), 3000)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project.id)
    setEditForm({ ...project })
  }

  const handleSaveEdit = () => {
    if (editForm) {
      setProjects(projects.map(p => p.id === editForm.id ? editForm : p))
      setEditingProject(null)
      setEditForm(null)
      setStatus({ type: "info", text: "Project updated. Save to apply changes." })
      setTimeout(() => setStatus(null), 3000)
    }
  }

  const handleCancelEdit = () => {
    setEditingProject(null)
    setEditForm(null)
  }

  const handleAddTechnology = () => {
    if (editForm && newTech.trim()) {
      setEditForm({ ...editForm, technologies: [...editForm.technologies, newTech.trim()] })
      setNewTech("")
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    if (editForm) {
      setEditForm({ ...editForm, technologies: editForm.technologies.filter(t => t !== tech) })
    }
  }

  // Media Management Functions
  const handleSaveMedia = async () => {
    if (!storedToken) return
    setIsSavingMedia(true)
    try {
      const response = await fetch("/api/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": storedToken },
        body: JSON.stringify(mediaConfig),
      })
      if (response.status === 401) {
        window.localStorage.removeItem("adminToken")
        setStoredToken(null)
        setStatus({ type: "error", text: "Unauthorized. Please log in again." })
        return
      }
      if (!response.ok) throw new Error("Failed to save")
      setStatus({ type: "success", text: "✅ Media saved! Changes live in 3 seconds." })
      setTimeout(() => setStatus(null), 3000)
    } catch (error) {
      setStatus({ type: "error", text: "Failed to save media." })
    } finally {
      setIsSavingMedia(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setStatus({ type: "success", text: "📋 Copied to clipboard!" })
    setTimeout(() => setStatus(null), 2000)
  }

  const handleExportMedia = () => {
    const dataStr = JSON.stringify(mediaConfig, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `media-config-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    setStatus({ type: "success", text: "Configuration exported!" })
    setTimeout(() => setStatus(null), 2000)
  }

  const handleImportMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string)
        setMediaConfig(config)
        setStatus({ type: "success", text: "Configuration imported!" })
        setTimeout(() => setStatus(null), 2000)
      } catch {
        setStatus({ type: "error", text: "Invalid JSON file" })
      }
    }
    reader.readAsText(file)
  }

  // Stats
  const totalProjects = projects.length
  const visibleProjects = projects.filter(p => p.visible).length
  const featuredProjects = projects.filter(p => p.featured).length
  const hiddenProjects = projects.filter(p => !p.visible).length
  const totalCategories = new Set(projects.map(p => p.category)).size

  // Login Screen
  if (!storedToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-netflix-black via-netflix-dark-gray to-netflix-black px-6">
        <Card className="w-full max-w-md border-netflix-red/20 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-bold text-center gradient-text">Admin Dashboard</CardTitle>
            <CardDescription className="text-center">Enter your secret token</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              value={loginToken}
              onChange={(e) => setLoginToken(e.target.value)}
              placeholder="Enter admin token"
              className="border-netflix-red/30"
              onKeyPress={(e) => e.key === 'Enter' && !isLoggingIn && handleLogin()}
              disabled={isLoggingIn}
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-netflix-red hover:bg-netflix-red/90"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Verifying..." : "Unlock Dashboard"}
            </Button>
            {status && <p className={`text-sm text-center ${status.type === "error" ? "text-red-400" : "text-green-400"}`}>{status.text}</p>}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-netflix-black via-netflix-dark-gray to-netflix-black" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-xl ${theme === "dark" ? "bg-netflix-black/80 border-netflix-red/20" : "bg-white/80 border-gray-200"} border-b`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
              <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Manage your portfolio</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={theme === "dark" ? "border-netflix-red/30" : "border-gray-300"}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className={theme === "dark" ? "border-netflix-red/30" : "border-gray-300"}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "projects", label: "Projects", icon: Code2 },
              { id: "github", label: "GitHub Import", icon: Github },
              { id: "content", label: "Content CMS", icon: FileText },
              { id: "media", label: "Media & Images", icon: ImageIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                  ? "bg-netflix-red text-white shadow-lg shadow-netflix-red/30"
                  : theme === "dark"
                    ? "bg-netflix-light-gray/30 text-gray-300 hover:bg-netflix-light-gray/50"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status */}
      {status && (
        <div className="container mx-auto px-6 pt-6">
          <div className={`rounded-lg border p-4 text-sm ${status.type === "error" ? "border-red-500/40 bg-red-500/10 text-red-400" :
            status.type === "success" ? "border-green-500/40 bg-green-500/10 text-green-400" :
              "border-blue-500/40 bg-blue-500/10 text-blue-400"
            }`}>{status.text}</div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className={`${theme === "dark" ? "border-netflix-red/20 bg-netflix-light-gray/30" : "border-gray-200 bg-white"} backdrop-blur`}>
                <CardHeader className="pb-3">
                  <CardDescription className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Total Projects</CardDescription>
                  <CardTitle className="text-4xl font-bold gradient-text">{totalProjects}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`flex items-center gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    <Code2 className="h-4 w-4" />
                    <span>{visibleProjects} visible</span>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${theme === "dark" ? "border-yellow-500/20 bg-netflix-light-gray/30" : "border-yellow-200 bg-yellow-50"} backdrop-blur`}>
                <CardHeader className="pb-3">
                  <CardDescription className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Featured</CardDescription>
                  <CardTitle className="text-4xl font-bold text-yellow-400">{featuredProjects}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`flex items-center gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>Highlighted</span>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${theme === "dark" ? "border-purple-500/20 bg-netflix-light-gray/30" : "border-purple-200 bg-purple-50"} backdrop-blur`}>
                <CardHeader className="pb-3">
                  <CardDescription className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Hidden</CardDescription>
                  <CardTitle className="text-4xl font-bold text-purple-400">{hiddenProjects}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`flex items-center gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    <EyeOff className="h-4 w-4" />
                    <span>Not visible</span>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${theme === "dark" ? "border-green-500/20 bg-netflix-light-gray/30" : "border-green-200 bg-green-50"} backdrop-blur`}>
                <CardHeader className="pb-3">
                  <CardDescription className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Categories</CardDescription>
                  <CardTitle className="text-4xl font-bold text-green-400">{totalCategories}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`flex items-center gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    <FolderOpen className="h-4 w-4" />
                    <span>Unique</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme === "dark" ? "border-netflix-red/20 bg-netflix-light-gray/30" : "border-gray-200 bg-white"} backdrop-blur`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${theme === "dark"
                        ? "bg-netflix-black/50 border border-netflix-light-gray/30 hover:border-netflix-red/30"
                        : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                        } transition-colors`}
                    >
                      <div className="flex items-center gap-4">
                        {project.image && <img src={project.image} alt={project.title} className="w-12 h-12 rounded object-cover" />}
                        <div>
                          <h4 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{project.title}</h4>
                          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{project.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.featured && <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Featured</Badge>}
                        <Badge variant={project.visible ? "default" : "secondary"}>{project.visible ? "Visible" : "Hidden"}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <Card className={`${theme === "dark" ? "border-netflix-red/20 bg-netflix-light-gray/30" : "border-gray-200 bg-white"} backdrop-blur`}>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5" />
                      Project Management
                    </CardTitle>
                    <CardDescription className="mt-1">Create, edit, and manage portfolio projects</CardDescription>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={handleAddProject} size="sm" className="bg-netflix-red hover:bg-netflix-red/90 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                    <Button onClick={handleSaveProjects} disabled={isSavingProjects} size="sm" variant="outline" className="border-green-500/30 hover:bg-green-500/10">
                      <Save className="h-4 w-4 mr-2" />
                      {isSavingProjects ? "Saving..." : "Save All"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingProjects ? (
                  <div className="text-center py-12 text-gray-400">
                    <Activity className="h-8 w-8 mx-auto mb-4 animate-spin" />
                    <p>Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No projects. Click "Add Project"!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <Card key={project.id} className={`border-l-4 ${project.featured ? "border-l-yellow-500 bg-yellow-500/5" : theme === "dark" ? "border-l-gray-500 bg-netflix-black/30" : "border-l-gray-300 bg-gray-50"}`}>
                        {editingProject === project.id && editForm ? (
                          <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold gradient-text">Editing Project</h3>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600">
                                  <Save className="h-4 w-4 mr-2" />Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                  <X className="h-4 w-4 mr-2" />Cancel
                                </Button>
                              </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Title</label>
                                <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className={theme === "dark" ? "bg-netflix-black/50 border-netflix-light-gray/30" : "bg-white border-gray-300"} />
                              </div>
                              <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Category</label>
                                <select
                                  value={editForm.category}
                                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                  className={`w-full h-10 px-3 rounded-md border text-sm ${theme === "dark" ? "bg-netflix-black/50 border-netflix-light-gray/30 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                                >
                                  <option value="AI/ML">AI/ML</option>
                                  <option value="NLP">NLP</option>
                                  <option value="Data Science">Data Science</option>
                                  <option value="Full Stack">Full Stack</option>
                                  <option value="Python">Python</option>
                                  <option value="Generative AI">Generative AI</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Description</label>
                              <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className={theme === "dark" ? "bg-netflix-black/50 border-netflix-light-gray/30" : "bg-white border-gray-300"} />
                            </div>
                            <div className="space-y-2">
                              <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Image URL</label>
                              <Input value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} placeholder="https://... or /images/projects/..." className={theme === "dark" ? "bg-netflix-black/50 border-netflix-light-gray/30" : "bg-white border-gray-300"} />
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Quick:</span>
                                {[
                                  { label: "AI/ML", src: "/images/projects/aiml.png" },
                                  { label: "Data", src: "/images/projects/data.png" },
                                  { label: "NLP", src: "/images/projects/nlp.png" },
                                  { label: "Full Stack", src: "/images/projects/fullstack.png" },
                                ].map(preset => (
                                  <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => setEditForm({ ...editForm, image: preset.src })}
                                    className={`px-2 py-0.5 text-[10px] rounded border transition-all ${editForm.image === preset.src
                                      ? "bg-netflix-red text-white border-netflix-red"
                                      : theme === "dark" ? "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10" : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                                      }`}
                                  >
                                    {preset.label}
                                  </button>
                                ))}
                              </div>
                              {editForm.image && (
                                <div className={`mt-2 p-2 rounded-lg border ${theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
                                  <img src={editForm.image} alt="Preview" className="w-48 aspect-video object-cover rounded" />
                                </div>
                              )}
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
                                  <Github className="h-4 w-4" />GitHub
                                </label>
                                <Input value={editForm.github} onChange={(e) => setEditForm({ ...editForm, github: e.target.value })} placeholder="https://github.com/..." className={theme === "dark" ? "bg-netflix-black/50 border-netflix-light-gray/30" : "bg-white border-gray-300"} />
                              </div>
                              <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
                                  <ExternalLink className="h-4 w-4" />Demo
                                </label>
                                <Input value={editForm.demo} onChange={(e) => setEditForm({ ...editForm, demo: e.target.value })} placeholder="https://demo.com" className={theme === "dark" ? "bg-netflix-black/50 border-netflix-light-gray/30" : "bg-white border-gray-300"} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Technologies</label>
                              <div className="flex gap-2">
                                <Input value={newTech} onChange={(e) => setNewTech(e.target.value)} placeholder="Add tech" onKeyPress={(e) => e.key === "Enter" && handleAddTechnology()} className={theme === "dark" ? "bg-netflix-black/50 border-netflix-light-gray/30" : "bg-white border-gray-300"} />
                                <Button onClick={handleAddTechnology} size="sm" type="button"><Plus className="h-4 w-4" /></Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {editForm.technologies.map((tech) => (
                                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                                    {tech}
                                    <button onClick={() => handleRemoveTechnology(tech)} className="ml-1 hover:text-red-400"><X className="h-3 w-3" /></button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className={`flex gap-4 p-4 rounded-lg ${theme === "dark" ? "bg-netflix-black/50 border border-netflix-light-gray/30" : "bg-gray-100 border border-gray-200"}`}>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={editForm.visible} onChange={(e) => setEditForm({ ...editForm, visible: e.target.checked })} className="w-4 h-4" />
                                <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Visible</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={editForm.featured} onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} className="w-4 h-4" />
                                <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex items-center gap-1`}>
                                  <Star className="h-4 w-4 text-yellow-500" />Featured
                                </span>
                              </label>
                            </div>
                          </CardContent>
                        ) : (
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1 flex gap-4">
                                {project.image && <img src={project.image} alt={project.title} className="w-24 h-24 object-cover rounded border" />}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{project.title}</h3>
                                    {project.featured && <Badge className="text-yellow-400 border-yellow-500/30 bg-yellow-500/10"><Star className="h-3 w-3 mr-1 fill-current" />Featured</Badge>}
                                    <Badge variant={project.visible ? "default" : "secondary"}>{project.visible ? "Visible" : "Hidden"}</Badge>
                                    <Badge variant="outline">{project.category}</Badge>
                                  </div>
                                  <p className={`text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{project.description}</p>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {project.technologies.map((tech) => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                                  </div>
                                  <div className="flex gap-4 text-sm">
                                    {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline"><Github className="h-4 w-4" />GitHub</a>}
                                    {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-400 hover:underline"><ExternalLink className="h-4 w-4" />Demo</a>}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={`flex gap-2 pt-4 border-t ${theme === "dark" ? "border-netflix-light-gray/30" : "border-gray-200"}`}>
                              <Button size="sm" variant="outline" onClick={() => handleEditProject(project)}><Edit2 className="h-4 w-4 mr-2" />Edit</Button>
                              <Button size="sm" variant="outline" onClick={() => handleToggleVisible(project.id)}>{project.visible ? <><EyeOff className="h-4 w-4 mr-2" />Hide</> : <><Eye className="h-4 w-4 mr-2" />Show</>}</Button>
                              <Button size="sm" variant="outline" onClick={() => handleToggleFeatured(project.id)}>{project.featured ? <><StarOff className="h-4 w-4 mr-2" />Unfeature</> : <><Star className="h-4 w-4 mr-2" />Feature</>}</Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteProject(project.id)} className="border-red-500/30 hover:bg-red-500/10 text-red-400"><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* GitHub Import Tab */}
        {activeTab === "github" && (
          <GitHubImportTab
            theme={theme}
            projects={projects}
            setProjects={setProjects}
            githubRepos={githubRepos}
            setGithubRepos={setGithubRepos}
            isLoadingGithub={isLoadingGithub}
            setIsLoadingGithub={setIsLoadingGithub}
            githubSearch={githubSearch}
            setGithubSearch={setGithubSearch}
            setStatus={setStatus}
          />
        )}

        {/* Content CMS Tab */}
        {activeTab === "content" && (
          <ContentCMSTab theme={theme} storedToken={storedToken} setStatus={setStatus} />
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <Card className={`${theme === "dark" ? "border-netflix-red/20 bg-netflix-light-gray/30" : "border-gray-200 bg-white"} backdrop-blur`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Media & Image Management
                    </CardTitle>
                    <CardDescription className="mt-1">Update profile images and section backgrounds</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowPreviews(!showPreviews)}>
                      {showPreviews ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showPreviews ? "Hide" : "Show"} Previews
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportMedia}>
                      <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <label>
                      <Button variant="outline" size="sm" asChild>
                        <span><Upload className="h-4 w-4 mr-2" />Import</span>
                      </Button>
                      <input type="file" accept=".json" onChange={handleImportMedia} className="hidden" />
                    </label>
                    <Button size="sm" onClick={handleSaveMedia} disabled={isSavingMedia} className="bg-green-500 hover:bg-green-600">
                      <Save className="h-4 w-4 mr-2" />
                      {isSavingMedia ? "Saving..." : "Save All"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Profile Image */}
                <Card className={`${theme === "dark" ? "border-netflix-red/20" : "border-gray-200"}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      👤 Main Profile Image
                      <Badge variant="outline">Global</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex-1 space-y-2">
                        <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Image URL</label>
                        <div className="flex gap-2">
                          <Input value={mediaConfig.profileImage} onChange={(e) => setMediaConfig({ ...mediaConfig, profileImage: e.target.value })} className={theme === "dark" ? "bg-netflix-black/50" : "bg-white"} />
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(mediaConfig.profileImage)}><Copy className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      {showPreviews && mediaConfig.profileImage && (
                        <img src={mediaConfig.profileImage} alt="Profile" className="h-32 w-32 rounded-full object-cover border-2 border-netflix-red shadow-lg" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Profile-specific Images */}
                {PROFILE_KEYS.map((profileKey) => (
                  <Card key={profileKey} className={`${theme === "dark" ? "border-l-4 border-l-netflix-red" : "border-l-4 border-l-blue-500"}`}>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setExpandedProfile(expandedProfile === profileKey ? null : profileKey)}>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{profileKey === "recruiter" ? "💼" : profileKey === "student" ? "🎓" : "🚀"}</span>
                          <span className="capitalize">{PROFILE_LABELS[profileKey]}</span>
                          <Badge variant="secondary">{Object.keys(mediaConfig.profiles[profileKey].backgrounds).length + 2} images</Badge>
                        </div>
                        <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{expandedProfile === profileKey ? "▼" : "▶"}</span>
                      </CardTitle>
                    </CardHeader>
                    {expandedProfile === profileKey && (
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>Avatar Image<Badge variant="outline" className="text-xs">Profile Selection</Badge></label>
                          <div className="flex gap-2">
                            <Input value={mediaConfig.profiles[profileKey].image} onChange={(e) => setMediaConfig({ ...mediaConfig, profiles: { ...mediaConfig.profiles, [profileKey]: { ...mediaConfig.profiles[profileKey], image: e.target.value } } })} className={theme === "dark" ? "bg-netflix-black/50" : "bg-white"} />
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(mediaConfig.profiles[profileKey].image)}><Copy className="h-4 w-4" /></Button>
                          </div>
                          {showPreviews && mediaConfig.profiles[profileKey].image && (
                            <div className={`flex items-center gap-4 p-3 rounded-lg ${theme === "dark" ? "bg-muted/30" : "bg-gray-100"}`}>
                              <img src={mediaConfig.profiles[profileKey].image} alt={`${profileKey} avatar`} className="h-20 w-20 rounded-lg object-cover border-2 shadow" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>Background GIF<Badge variant="outline" className="text-xs">Profile Background</Badge></label>
                          <div className="flex gap-2">
                            <Input value={mediaConfig.profiles[profileKey].backgroundGif} onChange={(e) => setMediaConfig({ ...mediaConfig, profiles: { ...mediaConfig.profiles, [profileKey]: { ...mediaConfig.profiles[profileKey], backgroundGif: e.target.value } } })} className={theme === "dark" ? "bg-netflix-black/50" : "bg-white"} />
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(mediaConfig.profiles[profileKey].backgroundGif)}><Copy className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        <div className={`mt-6 space-y-4 border-t pt-4 ${theme === "dark" ? "border-netflix-light-gray/30" : "border-gray-200"}`}>
                          <h4 className={`text-md font-semibold flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>📄 Section Backgrounds<Badge variant="secondary" className="text-xs">{SECTION_KEYS.length} sections</Badge></h4>
                          {SECTION_KEYS.map((sectionKey) => (
                            <div key={sectionKey} className="space-y-2">
                              <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{MEDIA_SECTION_LABELS[sectionKey]}</label>
                              <div className="flex gap-2">
                                <Input value={mediaConfig.profiles[profileKey].backgrounds[sectionKey]} onChange={(e) => setMediaConfig({ ...mediaConfig, profiles: { ...mediaConfig.profiles, [profileKey]: { ...mediaConfig.profiles[profileKey], backgrounds: { ...mediaConfig.profiles[profileKey].backgrounds, [sectionKey]: e.target.value } } } })} className={theme === "dark" ? "bg-netflix-black/50" : "bg-white"} />
                                <Button variant="outline" size="sm" onClick={() => copyToClipboard(mediaConfig.profiles[profileKey].backgrounds[sectionKey])}><Copy className="h-4 w-4" /></Button>
                              </div>
                              {showPreviews && mediaConfig.profiles[profileKey].backgrounds[sectionKey] && (
                                <div className={`p-2 rounded ${theme === "dark" ? "bg-muted/30" : "bg-gray-100"}`}>
                                  <img src={mediaConfig.profiles[profileKey].backgrounds[sectionKey]} alt={`${sectionKey} preview`} className="w-full h-24 object-cover rounded border" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   GitHub Import Tab — separate component
   ──────────────────────────────────────────── */

interface GitHubImportTabProps {
  theme: "dark" | "light"
  projects: Project[]
  setProjects: (p: Project[]) => void
  githubRepos: any[]
  setGithubRepos: (r: any[]) => void
  isLoadingGithub: boolean
  setIsLoadingGithub: (v: boolean) => void
  githubSearch: string
  setGithubSearch: (v: string) => void
  setStatus: (s: StatusMessage | null) => void
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "Jupyter Notebook": "#DA5B0B",
  Shell: "#89e051",
}

function GitHubImportTab({
  theme,
  projects,
  setProjects,
  githubRepos,
  setGithubRepos,
  isLoadingGithub,
  setIsLoadingGithub,
  githubSearch,
  setGithubSearch,
  setStatus,
}: GitHubImportTabProps) {

  const fetchGithubRepos = async () => {
    setIsLoadingGithub(true)
    try {
      const res = await fetch("/api/github-repos")
      const data = await res.json()
      setGithubRepos(data.repos || [])
      setStatus({ type: "success", text: `✅ Fetched ${(data.repos || []).length} GitHub repos!` })
      setTimeout(() => setStatus(null), 3000)
    } catch (error) {
      setStatus({ type: "error", text: "Failed to fetch GitHub repos." })
    } finally {
      setIsLoadingGithub(false)
    }
  }

  const isImported = (repoId: string) =>
    projects.some((p) => p.github?.includes(repoId) || p.id === `gh-${repoId}`)

  const isImportedByUrl = (htmlUrl: string) =>
    projects.some((p) => p.github === htmlUrl)

  const handleToggleRepo = (repo: any) => {
    const alreadyImported = isImportedByUrl(repo.html_url)

    if (alreadyImported) {
      // Remove from projects
      setProjects(projects.filter((p) => p.github !== repo.html_url))
      setStatus({ type: "info", text: `Removed "${repo.name}". Click Save in Projects tab to apply.` })
    } else {
      // Add as new project with auto-populated fields
      const newProject: Project = {
        id: `gh-${repo.id}`,
        title: repo.name
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase()), // kebab-case → Title Case
        description: repo.description || `A ${repo.language || "software"} project.`,
        image: `https://opengraph.githubassets.com/1/${repo.html_url.replace("https://github.com/", "")}`,
        technologies: [repo.language, ...repo.topics.slice(0, 4)].filter(Boolean),
        github: repo.html_url,
        demo: repo.homepage || "",
        featured: false,
        visible: true,
        category: repo.language || "Other",
      }
      setProjects([newProject, ...projects])
      setStatus({ type: "success", text: `Added "${newProject.title}". Click Save in Projects tab to persist.` })
    }
    setTimeout(() => setStatus(null), 3000)
  }

  const filteredRepos = githubRepos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(githubSearch.toLowerCase()) ||
      (repo.description || "").toLowerCase().includes(githubSearch.toLowerCase()) ||
      (repo.language || "").toLowerCase().includes(githubSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Card className={`${theme === "dark" ? "border-netflix-red/20 bg-netflix-light-gray/30" : "border-gray-200 bg-white"} backdrop-blur`}>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                Import from GitHub
              </CardTitle>
              <CardDescription className="mt-1">
                Select repos to add to your portfolio. GitHub link, demo, and description are auto-filled.
              </CardDescription>
            </div>
            <Button
              onClick={fetchGithubRepos}
              disabled={isLoadingGithub}
              size="sm"
              className="bg-netflix-red hover:bg-netflix-red/90 text-white"
            >
              {isLoadingGithub ? (
                <><Activity className="h-4 w-4 mr-2 animate-spin" /> Fetching...</>
              ) : githubRepos.length > 0 ? (
                <><RefreshCw className="h-4 w-4 mr-2" /> Refresh</>
              ) : (
                <><Github className="h-4 w-4 mr-2" /> Fetch My Repos</>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {githubRepos.length === 0 && !isLoadingGithub ? (
            <div className="text-center py-16 text-gray-400">
              <Github className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg mb-2">No repos loaded yet</p>
              <p className="text-sm">Click &quot;Fetch My Repos&quot; to load your GitHub repos</p>
            </div>
          ) : isLoadingGithub ? (
            <div className="text-center py-16 text-gray-400">
              <Activity className="h-10 w-10 mx-auto mb-4 animate-spin" />
              <p>Fetching repos from GitHub...</p>
            </div>
          ) : (
            <>
              {/* Search + stats bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Input
                  placeholder="Search repos by name, description, or language..."
                  value={githubSearch}
                  onChange={(e) => setGithubSearch(e.target.value)}
                  className={`flex-1 ${theme === "dark" ? "bg-netflix-black/50 border-netflix-light-gray/30" : "bg-white border-gray-300"}`}
                />
                <div className="flex gap-2 items-center text-sm text-gray-400 shrink-0">
                  <Badge variant="outline">{filteredRepos.length} repos</Badge>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {projects.filter((p) => p.id.startsWith("gh-")).length} imported
                  </Badge>
                </div>
              </div>

              {/* Repo grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRepos.map((repo) => {
                  const imported = isImportedByUrl(repo.html_url)
                  return (
                    <div
                      key={repo.id}
                      onClick={() => handleToggleRepo(repo)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${imported
                        ? "border-green-500/60 bg-green-500/10 shadow-lg shadow-green-500/10"
                        : theme === "dark"
                          ? "border-netflix-light-gray/30 bg-netflix-black/30 hover:border-netflix-red/40"
                          : "border-gray-200 bg-white hover:border-blue-400/60"
                        }`}
                    >
                      {/* Selection indicator */}
                      <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all ${imported
                        ? "bg-green-500 text-white"
                        : theme === "dark" ? "bg-netflix-light-gray/50 text-gray-500" : "bg-gray-200 text-gray-400"
                        }`}>
                        {imported ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                      </div>

                      {/* Repo name */}
                      <h3 className={`font-semibold text-base mb-1 pr-8 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {repo.name}
                      </h3>

                      {/* Description */}
                      <p className={`text-xs mb-3 line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        {repo.description || "No description"}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 text-xs">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block"
                              style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || "#888" }}
                            />
                            <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>{repo.language}</span>
                          </span>
                        )}
                        {repo.stars > 0 && (
                          <span className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            {repo.stars}
                          </span>
                        )}
                        {repo.homepage && (
                          <span className="flex items-center gap-1 text-blue-400">
                            <ExternalLink className="h-3 w-3" />
                            Live
                          </span>
                        )}
                      </div>

                      {/* Topics */}
                      {repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {repo.topics.slice(0, 3).map((topic: string) => (
                            <Badge key={topic} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ────────────────────────────────────────────
   Content CMS Tab — full site content editor
   ──────────────────────────────────────────── */

interface ContentCMSTabProps {
  theme: "dark" | "light"
  storedToken: string | null
  setStatus: (s: StatusMessage | null) => void
}

function ContentCMSTab({ theme, storedToken, setStatus }: ContentCMSTabProps) {
  const [content, setContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("about")

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/content")
      const data = await res.json()
      setContent(data)
    } catch {
      setStatus({ type: "error", text: "Failed to load site content" })
    } finally {
      setIsLoading(false)
    }
  }

  const saveContent = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": storedToken || "",
          "Authorization": `Bearer ${storedToken || ""}`,
        },
        body: JSON.stringify(content),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus({ type: "success", text: "✅ All content saved!" })
      } else if (res.status === 401) {
        setStatus({ type: "error", text: "Unauthorized — please log in again" })
      } else {
        setStatus({ type: "error", text: `Save failed: ${data.error || res.statusText}` })
      }
    } catch (err: any) {
      console.error("Content save error:", err)
      setStatus({ type: "error", text: `Network error: ${err.message}` })
    } finally {
      setIsSaving(false)
      setTimeout(() => setStatus(null), 3000)
    }
  }

  if (isLoading || !content) {
    return (
      <div className="text-center py-16 text-gray-400">
        <Activity className="h-10 w-10 mx-auto mb-4 animate-spin" />
        <p>Loading site content...</p>
      </div>
    )
  }

  const sections = [
    { id: "about", label: "About / Bio", icon: "👤" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "achievements", label: "Achievements", icon: "🏆" },
    { id: "certifications", label: "Certifications", icon: "📜" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "contact", label: "Contact", icon: "📬" },
  ]

  const cardClass = theme === "dark"
    ? "border-netflix-red/20 bg-netflix-light-gray/30"
    : "border-gray-200 bg-white"
  const inputClass = theme === "dark"
    ? "bg-netflix-black/50 border-netflix-light-gray/30 text-white"
    : "bg-white border-gray-300 text-gray-900"

  return (
    <div className="space-y-4">
      {/* Save bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeSection === s.id
                ? "bg-netflix-red text-white"
                : theme === "dark" ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
        <Button onClick={saveContent} disabled={isSaving} className="bg-netflix-red hover:bg-netflix-red/90 text-white shrink-0 ml-2">
          {isSaving ? <><Activity className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save All</>}
        </Button>
      </div>

      {/* About Section */}
      {activeSection === "about" && (
        <Card className={cardClass}>
          <CardHeader><CardTitle className="flex items-center gap-2">👤 About / Bio</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                <Input className={inputClass} value={content.about?.name || ""} onChange={e => setContent({ ...content, about: { ...content.about, name: e.target.value } })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Tagline</label>
                <Input className={inputClass} value={content.about?.tagline || ""} onChange={e => setContent({ ...content, about: { ...content.about, tagline: e.target.value } })} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Bio / Summary</label>
              <Textarea className={inputClass} rows={3} value={content.about?.bio || ""} onChange={e => setContent({ ...content, about: { ...content.about, bio: e.target.value } })} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">CGPA</label>
                <Input className={inputClass} value={content.about?.cgpa || ""} onChange={e => setContent({ ...content, about: { ...content.about, cgpa: e.target.value } })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">College</label>
                <Input className={inputClass} value={content.about?.college || ""} onChange={e => setContent({ ...content, about: { ...content.about, college: e.target.value } })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Degree</label>
                <Input className={inputClass} value={content.about?.degree || ""} onChange={e => setContent({ ...content, about: { ...content.about, degree: e.target.value } })} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Period</label>
                <Input className={inputClass} value={content.about?.period || ""} onChange={e => setContent({ ...content, about: { ...content.about, period: e.target.value } })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Coursework</label>
                <Input className={inputClass} value={content.about?.coursework || ""} onChange={e => setContent({ ...content, about: { ...content.about, coursework: e.target.value } })} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Expertise</label>
              <Textarea className={inputClass} rows={3} value={content.about?.expertise || ""} onChange={e => setContent({ ...content, about: { ...content.about, expertise: e.target.value } })} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Skills (comma-separated)</label>
              <Input className={inputClass} value={(content.about?.skills || []).join(", ")} onChange={e => setContent({ ...content, about: { ...content.about, skills: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) } })} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Languages (comma-separated)</label>
              <Input className={inputClass} value={(content.about?.languages || []).join(", ")} onChange={e => setContent({ ...content, about: { ...content.about, languages: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) } })} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experience Section */}
      {activeSection === "experience" && (
        <Card className={cardClass}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">💼 Experience</CardTitle>
              <Button size="sm" onClick={() => setContent({ ...content, experiences: [...(content.experiences || []), { title: "", company: "", period: "", location: "", description: [""], type: "Internship" }] })}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {(content.experiences || []).map((exp: any, i: number) => (
              <div key={i} className={`p-4 rounded-lg ${theme === "dark" ? "bg-netflix-black/30 border border-white/10" : "bg-gray-50 border border-gray-200"}`}>
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-400">Experience #{i + 1}</span>
                  <Button size="sm" variant="ghost" onClick={() => {
                    const exps = [...content.experiences]; exps.splice(i, 1);
                    setContent({ ...content, experiences: exps })
                  }}><Trash2 className="h-3 w-3 text-red-400" /></Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input className={inputClass} placeholder="Title" value={exp.title} onChange={e => { const exps = [...content.experiences]; exps[i] = { ...exp, title: e.target.value }; setContent({ ...content, experiences: exps }) }} />
                  <Input className={inputClass} placeholder="Company" value={exp.company} onChange={e => { const exps = [...content.experiences]; exps[i] = { ...exp, company: e.target.value }; setContent({ ...content, experiences: exps }) }} />
                  <Input className={inputClass} placeholder="Period" value={exp.period} onChange={e => { const exps = [...content.experiences]; exps[i] = { ...exp, period: e.target.value }; setContent({ ...content, experiences: exps }) }} />
                  <Input className={inputClass} placeholder="Location" value={exp.location} onChange={e => { const exps = [...content.experiences]; exps[i] = { ...exp, location: e.target.value }; setContent({ ...content, experiences: exps }) }} />
                  <Input className={inputClass} placeholder="Type (Internship, Club Activity...)" value={exp.type} onChange={e => { const exps = [...content.experiences]; exps[i] = { ...exp, type: e.target.value }; setContent({ ...content, experiences: exps }) }} />
                </div>
                <div className="mt-3 space-y-2">
                  <label className="text-xs text-gray-400">Bullet Points</label>
                  {(exp.description || []).map((bullet: string, j: number) => (
                    <div key={j} className="flex gap-2">
                      <Input className={`flex-1 ${inputClass}`} value={bullet} onChange={e => {
                        const exps = [...content.experiences]; const desc = [...exp.description]; desc[j] = e.target.value; exps[i] = { ...exp, description: desc }; setContent({ ...content, experiences: exps })
                      }} />
                      <Button size="sm" variant="ghost" onClick={() => {
                        const exps = [...content.experiences]; const desc = [...exp.description]; desc.splice(j, 1); exps[i] = { ...exp, description: desc }; setContent({ ...content, experiences: exps })
                      }}><X className="h-3 w-3" /></Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => {
                    const exps = [...content.experiences]; exps[i] = { ...exp, description: [...(exp.description || []), ""] }; setContent({ ...content, experiences: exps })
                  }}><Plus className="h-3 w-3 mr-1" /> Add Bullet</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      {activeSection === "achievements" && (
        <Card className={cardClass}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">🏆 Achievements</CardTitle>
              <Button size="sm" onClick={() => setContent({ ...content, achievements: [...(content.achievements || []), { title: "", detail: "" }] })}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(content.achievements || []).map((a: any, i: number) => (
              <div key={i} className={`p-4 rounded-lg flex gap-3 items-start ${theme === "dark" ? "bg-netflix-black/30 border border-white/10" : "bg-gray-50 border border-gray-200"}`}>
                <div className="flex-1 space-y-2">
                  <Input className={inputClass} placeholder="Title" value={a.title} onChange={e => { const ach = [...content.achievements]; ach[i] = { ...a, title: e.target.value }; setContent({ ...content, achievements: ach }) }} />
                  <Textarea className={inputClass} rows={2} placeholder="Detail" value={a.detail} onChange={e => { const ach = [...content.achievements]; ach[i] = { ...a, detail: e.target.value }; setContent({ ...content, achievements: ach }) }} />
                </div>
                <Button size="sm" variant="ghost" onClick={() => { const ach = [...content.achievements]; ach.splice(i, 1); setContent({ ...content, achievements: ach }) }}><Trash2 className="h-3 w-3 text-red-400" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {activeSection === "certifications" && (
        <Card className={cardClass}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">📜 Certifications</CardTitle>
              <Button size="sm" onClick={() => setContent({ ...content, certifications: [...(content.certifications || []), ""] })}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(content.certifications || []).map((cert: string, i: number) => (
              <div key={i} className="flex gap-2">
                <Input className={`flex-1 ${inputClass}`} value={cert} onChange={e => { const certs = [...content.certifications]; certs[i] = e.target.value; setContent({ ...content, certifications: certs }) }} />
                <Button size="sm" variant="ghost" onClick={() => { const certs = [...content.certifications]; certs.splice(i, 1); setContent({ ...content, certifications: certs }) }}><Trash2 className="h-3 w-3 text-red-400" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {activeSection === "skills" && (
        <Card className={cardClass}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">⚡ Skill Categories</CardTitle>
              <Button size="sm" onClick={() => setContent({ ...content, skills: [...(content.skills || []), { title: "", icon: "Code", color: "text-blue-400", skills: [] }] })}>
                <Plus className="h-4 w-4 mr-1" /> Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {(content.skills || []).map((cat: any, ci: number) => (
              <div key={ci} className={`p-4 rounded-lg ${theme === "dark" ? "bg-netflix-black/30 border border-white/10" : "bg-gray-50 border border-gray-200"}`}>
                <div className="flex justify-between mb-3">
                  <Input className={`w-64 ${inputClass}`} placeholder="Category Title" value={cat.title} onChange={e => { const sk = [...content.skills]; sk[ci] = { ...cat, title: e.target.value }; setContent({ ...content, skills: sk }) }} />
                  <Button size="sm" variant="ghost" onClick={() => { const sk = [...content.skills]; sk.splice(ci, 1); setContent({ ...content, skills: sk }) }}><Trash2 className="h-3 w-3 text-red-400" /></Button>
                </div>
                <div className="space-y-2">
                  {(cat.skills || []).map((skill: any, si: number) => (
                    <div key={si} className="flex gap-2 items-center">
                      <Input className={`flex-1 ${inputClass}`} placeholder="Skill name" value={skill.name} onChange={e => { const sk = [...content.skills]; const skills = [...cat.skills]; skills[si] = { ...skill, name: e.target.value }; sk[ci] = { ...cat, skills }; setContent({ ...content, skills: sk }) }} />
                      <Input className={`w-20 ${inputClass}`} type="number" min={0} max={100} placeholder="%" value={skill.level} onChange={e => { const sk = [...content.skills]; const skills = [...cat.skills]; skills[si] = { ...skill, level: parseInt(e.target.value) || 0 }; sk[ci] = { ...cat, skills }; setContent({ ...content, skills: sk }) }} />
                      <Button size="sm" variant="ghost" onClick={() => { const sk = [...content.skills]; const skills = [...cat.skills]; skills.splice(si, 1); sk[ci] = { ...cat, skills }; setContent({ ...content, skills: sk }) }}><X className="h-3 w-3" /></Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => { const sk = [...content.skills]; sk[ci] = { ...cat, skills: [...(cat.skills || []), { name: "", level: 70 }] }; setContent({ ...content, skills: sk }) }}>
                    <Plus className="h-3 w-3 mr-1" /> Add Skill
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Contact */}
      {activeSection === "contact" && (
        <Card className={cardClass}>
          <CardHeader><CardTitle className="flex items-center gap-2">📬 Contact Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Email</label>
                <Input className={inputClass} value={content.contact?.email || ""} onChange={e => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">LinkedIn URL</label>
                <Input className={inputClass} value={content.contact?.linkedin || ""} onChange={e => setContent({ ...content, contact: { ...content.contact, linkedin: e.target.value } })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">GitHub URL</label>
                <Input className={inputClass} value={content.contact?.github || ""} onChange={e => setContent({ ...content, contact: { ...content.contact, github: e.target.value } })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Hugging Face URL</label>
                <Input className={inputClass} value={content.contact?.huggingface || ""} onChange={e => setContent({ ...content, contact: { ...content.contact, huggingface: e.target.value } })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Location</label>
                <Input className={inputClass} value={content.contact?.location || ""} onChange={e => setContent({ ...content, contact: { ...content.contact, location: e.target.value } })} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
