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
  Sun, Moon
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
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "media">("overview")
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
  
  // GitHub/HuggingFace Stats
  const [githubProjects, setGithubProjects] = useState<any[]>([])
  const [hfProjects, setHfProjects] = useState<any[]>([])
  
  // Status
  const [status, setStatus] = useState<StatusMessage | null>(null)

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
      setGithubProjects([]) // No longer fetching GitHub projects
      setHfProjects([]) // No longer fetching HuggingFace projects
      setMediaConfig(mediaData)
    } catch (error) {
      console.error(error)
      setStatus({ type: "error", text: "Failed to load data" })
    } finally {
      setIsLoadingProjects(false)
      setIsLoadingMedia(false)
    }
  }

  const handleLogin = () => {
    if (!loginToken.trim()) {
      setStatus({ type: "error", text: "Please enter your admin token." })
      return
    }
    window.localStorage.setItem("adminToken", loginToken.trim())
    setStoredToken(loginToken.trim())
    setLoginToken("")
    setStatus(null)
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
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${storedToken}` },
        body: JSON.stringify({ projects }),
      })
      if (!response.ok) throw new Error("Failed to save")
      setStatus({ type: "success", text: "✅ Projects saved! Changes live on website." })
      setTimeout(() => setStatus(null), 3000)
    } catch (error) {
      setStatus({ type: "error", text: "Failed to save projects." })
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
  }

  const handleToggleVisible = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, visible: !p.visible } : p))
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
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full bg-netflix-red hover:bg-netflix-red/90">
              Unlock Dashboard
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
              { id: "media", label: "Media & Images", icon: ImageIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
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
          <div className={`rounded-lg border p-4 text-sm ${
            status.type === "error" ? "border-red-500/40 bg-red-500/10 text-red-400" :
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
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        theme === "dark" 
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
                                <Input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className={theme === "dark" ? "bg-netflix-black/50 border-netflix-light-gray/30" : "bg-white border-gray-300"} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Description</label>
                              <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className={theme === "dark" ? "bg-netflix-black/50 border-netflix-light-gray/30" : "bg-white border-gray-300"} />
                            </div>
                            <div className="space-y-2">
                              <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Image URL</label>
                              <Input value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} className={theme === "dark" ? "bg-netflix-black/50 border-netflix-light-gray/30" : "bg-white border-gray-300"} />
                              {editForm.image && <img src={editForm.image} alt="Preview" className="w-32 h-32 object-cover rounded border" />}
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
