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
  Activity, TrendingUp, Users, Code2, Mail, Settings
} from "lucide-react"

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

export default function AdminDashboard() {
  const [storedToken, setStoredToken] = useState<string | null>(null)
  const [loginToken, setLoginToken] = useState("")
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "media" | "settings">("overview")
  
  // Projects State
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [isSavingProjects, setIsSavingProjects] = useState(false)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Project | null>(null)
  const [newTech, setNewTech] = useState("")
  
  // GitHub/HuggingFace Stats
  const [githubProjects, setGithubProjects] = useState<any[]>([])
  const [hfProjects, setHfProjects] = useState<any[]>([])
  
  // Status
  const [status, setStatus] = useState<StatusMessage | null>(null)

  useEffect(() => {
    const savedToken = window.localStorage.getItem("adminToken")
    if (savedToken) {
      setStoredToken(savedToken)
    }
  }, [])

  useEffect(() => {
    if (storedToken) {
      void fetchAllData()
    }
  }, [storedToken])

  const fetchAllData = async () => {
    setIsLoadingProjects(true)
    try {
      const [projectsRes, githubRes, hfRes] = await Promise.all([
        fetch("/api/projects", { cache: "no-store" }),
        fetch("/api/github-projects", { cache: "no-store" }),
        fetch("/api/huggingface-projects", { cache: "no-store" })
      ])

      const projectsData = await projectsRes.json()
      const githubData = await githubRes.json()
      const hfData = await hfRes.json()

      setProjects(projectsData.projects || [])
      setGithubProjects(githubData || [])
      setHfProjects(hfData || [])
    } catch (error) {
      console.error(error)
      setStatus({ type: "error", text: "Failed to load data" })
    } finally {
      setIsLoadingProjects(false)
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
    if (!storedToken) {
      setStatus({ type: "error", text: "You must be logged in to save projects." })
      return
    }

    setIsSavingProjects(true)
    setStatus(null)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ projects }),
      })

      if (response.status === 401) {
        window.localStorage.removeItem("adminToken")
        setStoredToken(null)
        setStatus({ type: "error", text: "Unauthorized. Please log in again." })
        return
      }

      if (!response.ok) {
        throw new Error("Failed to save projects")
      }

      setStatus({ type: "success", text: "✅ Projects saved successfully!" })
      setTimeout(() => setStatus(null), 3000)
    } catch (error) {
      console.error(error)
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
    setProjects([...projects, newProject])
    setEditingProject(newProject.id)
    setEditForm(newProject)
  }

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(p => p.id !== id))
      setStatus({ type: "info", text: "Project deleted. Remember to save changes." })
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
      setStatus({ type: "info", text: "Project updated. Remember to save all changes." })
      setTimeout(() => setStatus(null), 3000)
    }
  }

  const handleCancelEdit = () => {
    setEditingProject(null)
    setEditForm(null)
  }

  const handleAddTechnology = () => {
    if (editForm && newTech.trim()) {
      setEditForm({
        ...editForm,
        technologies: [...editForm.technologies, newTech.trim()]
      })
      setNewTech("")
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        technologies: editForm.technologies.filter(t => t !== tech)
      })
    }
  }

  // Stats calculations
  const totalProjects = projects.length
  const visibleProjects = projects.filter(p => p.visible).length
  const featuredProjects = projects.filter(p => p.featured).length
  const totalGithubStars = githubProjects.reduce((acc, p) => acc + (p.stars || 0), 0)
  const totalHfLikes = hfProjects.reduce((acc, p) => acc + (p.likes || 0), 0)

  // Login Screen
  if (!storedToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-netflix-black via-netflix-dark-gray to-netflix-black px-6">
        <Card className="w-full max-w-md border-netflix-red/20 shadow-2xl shadow-netflix-red/10">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-bold text-center gradient-text">
              Admin Dashboard
            </CardTitle>
            <CardDescription className="text-center">
              Enter your secret token to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                value={loginToken}
                onChange={(e) => setLoginToken(e.target.value)}
                placeholder="Enter admin token"
                className="border-netflix-red/30 focus:border-netflix-red"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full bg-netflix-red hover:bg-netflix-red/90"
            >
              Unlock Dashboard
            </Button>
            {status && (
              <p className={`text-sm text-center ${
                status.type === "error" ? "text-red-400" : "text-green-400"
              }`}>
                {status.text}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-netflix-black via-netflix-dark-gray to-netflix-black">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-netflix-black/80 border-b border-netflix-red/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">Manage your portfolio content</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-netflix-red/30 hover:bg-netflix-red/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "projects", label: "Projects", icon: Code2 },
              { id: "media", label: "Media", icon: ImageIcon },
              { id: "settings", label: "Settings", icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-netflix-red text-white shadow-lg shadow-netflix-red/30"
                    : "bg-netflix-light-gray/30 text-gray-300 hover:bg-netflix-light-gray/50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {status && (
        <div className="container mx-auto px-6 pt-6">
          <div
            className={`rounded-lg border p-4 text-sm flex items-center gap-2 ${
              status.type === "error"
                ? "border-red-500/40 bg-red-500/10 text-red-400"
                : status.type === "success"
                ? "border-green-500/40 bg-green-500/10 text-green-400"
                : "border-blue-500/40 bg-blue-500/10 text-blue-400"
            }`}
          >
            {status.text}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-netflix-red/20 bg-netflix-light-gray/30 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardDescription className="text-gray-400">Total Projects</CardDescription>
                  <CardTitle className="text-4xl font-bold gradient-text">
                    {totalProjects}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Code2 className="h-4 w-4" />
                    <span>{visibleProjects} visible</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-500/20 bg-netflix-light-gray/30 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardDescription className="text-gray-400">Featured Projects</CardDescription>
                  <CardTitle className="text-4xl font-bold text-yellow-400">
                    {featuredProjects}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>Highlighted</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-500/20 bg-netflix-light-gray/30 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardDescription className="text-gray-400">GitHub Stars</CardDescription>
                  <CardTitle className="text-4xl font-bold text-purple-400">
                    {totalGithubStars}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Github className="h-4 w-4" />
                    <span>{githubProjects.length} repos</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20 bg-netflix-light-gray/30 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardDescription className="text-gray-400">HuggingFace Likes</CardDescription>
                  <CardTitle className="text-4xl font-bold text-green-400">
                    {totalHfLikes}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>{hfProjects.length} spaces</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card className="border-netflix-red/20 bg-netflix-light-gray/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Recent Projects
                </CardTitle>
                <CardDescription>Latest additions to your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-netflix-black/50 border border-netflix-light-gray/30 hover:border-netflix-red/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-white">{project.title}</h4>
                          <p className="text-sm text-gray-400">{project.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.featured && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Featured
                          </Badge>
                        )}
                        <Badge variant={project.visible ? "default" : "secondary"}>
                          {project.visible ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-netflix-red/20 bg-netflix-light-gray/30 backdrop-blur">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab("projects")}
                    className="h-auto flex-col gap-2 py-6 bg-netflix-red/20 hover:bg-netflix-red/30 border border-netflix-red/30"
                    variant="outline"
                  >
                    <Plus className="h-6 w-6" />
                    <span>Add New Project</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("media")}
                    className="h-auto flex-col gap-2 py-6 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
                    variant="outline"
                  >
                    <ImageIcon className="h-6 w-6" />
                    <span>Update Media</span>
                  </Button>
                  <Button
                    onClick={fetchAllData}
                    className="h-auto flex-col gap-2 py-6 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30"
                    variant="outline"
                  >
                    <Activity className="h-6 w-6" />
                    <span>Refresh Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <Card className="border-netflix-red/20 bg-netflix-light-gray/30 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5" />
                      Project Management
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Create, edit, and manage your portfolio projects
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddProject}
                      size="sm"
                      className="bg-netflix-red hover:bg-netflix-red/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                    <Button
                      onClick={handleSaveProjects}
                      disabled={isSavingProjects}
                      size="sm"
                      variant="outline"
                      className="border-green-500/30 hover:bg-green-500/10"
                    >
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
                    <p>No projects yet. Click "Add Project" to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <Card
                        key={project.id}
                        className={`border-l-4 ${
                          project.featured
                            ? "border-l-yellow-500 bg-yellow-500/5"
                            : "border-l-gray-500 bg-netflix-black/30"
                        }`}
                      >
                        {editingProject === project.id && editForm ? (
                          // Edit Mode
                          <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold gradient-text">Editing Project</h3>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600">
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Project Title</label>
                                <Input
                                  value={editForm.title}
                                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                  placeholder="Project name"
                                  className="bg-netflix-black/50 border-netflix-light-gray/30"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Category</label>
                                <Input
                                  value={editForm.category}
                                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                  placeholder="e.g. Web Development, AI/ML"
                                  className="bg-netflix-black/50 border-netflix-light-gray/30"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">Description</label>
                              <Textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                placeholder="Describe your project..."
                                rows={3}
                                className="bg-netflix-black/50 border-netflix-light-gray/30"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">Image URL</label>
                              <Input
                                value={editForm.image}
                                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                placeholder="https://example.com/project-image.jpg"
                                className="bg-netflix-black/50 border-netflix-light-gray/30"
                              />
                              {editForm.image && (
                                <div className="mt-2">
                                  <img
                                    src={editForm.image}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded border border-netflix-light-gray/30"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                  <Github className="h-4 w-4" />
                                  GitHub Repository
                                </label>
                                <Input
                                  value={editForm.github}
                                  onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                                  placeholder="https://github.com/username/repo"
                                  className="bg-netflix-black/50 border-netflix-light-gray/30"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                  <ExternalLink className="h-4 w-4" />
                                  Live Demo URL
                                </label>
                                <Input
                                  value={editForm.demo}
                                  onChange={(e) => setEditForm({ ...editForm, demo: e.target.value })}
                                  placeholder="https://demo-site.com"
                                  className="bg-netflix-black/50 border-netflix-light-gray/30"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">Technologies</label>
                              <div className="flex gap-2">
                                <Input
                                  value={newTech}
                                  onChange={(e) => setNewTech(e.target.value)}
                                  placeholder="Add technology (e.g. React, Python)"
                                  onKeyPress={(e) => e.key === "Enter" && handleAddTechnology()}
                                  className="bg-netflix-black/50 border-netflix-light-gray/30"
                                />
                                <Button onClick={handleAddTechnology} size="sm" type="button">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {editForm.technologies.map((tech) => (
                                  <Badge
                                    key={tech}
                                    variant="secondary"
                                    className="flex items-center gap-1 bg-netflix-red/20 text-white border-netflix-red/30"
                                  >
                                    {tech}
                                    <button
                                      onClick={() => handleRemoveTechnology(tech)}
                                      className="ml-1 hover:text-red-400"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-4 p-4 bg-netflix-black/50 rounded-lg border border-netflix-light-gray/30">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editForm.visible}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, visible: e.target.checked })
                                  }
                                  className="w-4 h-4 rounded border-netflix-light-gray/30"
                                />
                                <span className="text-sm font-medium text-gray-300">
                                  Visible on site
                                </span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editForm.featured}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, featured: e.target.checked })
                                  }
                                  className="w-4 h-4 rounded border-netflix-light-gray/30"
                                />
                                <span className="text-sm font-medium text-gray-300 flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  Featured
                                </span>
                              </label>
                            </div>
                          </CardContent>
                        ) : (
                          // View Mode
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1 flex gap-4">
                                {project.image && (
                                  <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-24 h-24 object-cover rounded border border-netflix-light-gray/30"
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-white">
                                      {project.title}
                                    </h3>
                                    {project.featured && (
                                      <Badge
                                        variant="outline"
                                        className="text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                                      >
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        Featured
                                      </Badge>
                                    )}
                                    <Badge variant={project.visible ? "default" : "secondary"}>
                                      {project.visible ? "Visible" : "Hidden"}
                                    </Badge>
                                    <Badge variant="outline">{project.category}</Badge>
                                  </div>
                                  <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {project.technologies.map((tech) => (
                                      <Badge
                                        key={tech}
                                        variant="secondary"
                                        className="bg-netflix-light-gray/30"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex gap-4 text-sm">
                                    {project.github && (
                                      <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-400 hover:underline"
                                      >
                                        <Github className="h-4 w-4" />
                                        GitHub
                                      </a>
                                    )}
                                    {project.demo && (
                                      <a
                                        href={project.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-green-400 hover:underline"
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        Live Demo
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 flex-wrap pt-4 border-t border-netflix-light-gray/30">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditProject(project)}
                                className="border-netflix-light-gray/30 hover:bg-netflix-light-gray/20"
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleVisible(project.id)}
                                className="border-netflix-light-gray/30 hover:bg-netflix-light-gray/20"
                              >
                                {project.visible ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    Hide
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Show
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleFeatured(project.id)}
                                className="border-netflix-light-gray/30 hover:bg-netflix-light-gray/20"
                              >
                                {project.featured ? (
                                  <>
                                    <StarOff className="h-4 w-4 mr-2" />
                                    Unfeature
                                  </>
                                ) : (
                                  <>
                                    <Star className="h-4 w-4 mr-2" />
                                    Feature
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteProject(project.id)}
                                className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
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
          <Card className="border-netflix-red/20 bg-netflix-light-gray/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Media Management
              </CardTitle>
              <CardDescription>Coming soon - Manage images and backgrounds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Media management interface will be available here</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <Card className="border-netflix-red/20 bg-netflix-light-gray/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
              <CardDescription>Configure your admin panel preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-netflix-black/50 border border-netflix-light-gray/30">
                  <h4 className="font-semibold text-white mb-2">Email Configuration</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    To enable email functionality, install the resend package:
                  </p>
                  <code className="block p-3 rounded bg-netflix-black text-green-400 text-sm">
                    npm install resend
                  </code>
                  <p className="text-sm text-gray-400 mt-3">
                    Then add your RESEND_API_KEY to .env.local file
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-netflix-black/50 border border-netflix-light-gray/30">
                  <h4 className="font-semibold text-white mb-2">API Endpoints</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Projects API:</span>
                      <code className="text-green-400">/api/projects</code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">GitHub Projects:</span>
                      <code className="text-green-400">/api/github-projects</code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">HuggingFace Projects:</span>
                      <code className="text-green-400">/api/huggingface-projects</code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Send Email:</span>
                      <code className="text-green-400">/api/send-email</code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
