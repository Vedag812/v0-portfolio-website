"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ArrowLeft, ExternalLink, Sparkles, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface Article {
  id: string
  title: string
  description: string
  url: string
  image: string
  source: string
  publishedAt: string
  category: "ai" | "tech" | "dev" | "linkedin" | "movies"
  rating?: number
  genre?: string
}

// All content now loaded from API

export default function ExplorerPage() {
  const router = useRouter()
  const [lastUpdated, setLastUpdated] = useState(new Date())
  
  // New state for AI/Tech articles
  const [articles, setArticles] = useState<Article[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [showArticles, setShowArticles] = useState(true)
  
  // State for movie recommendations
  const [movies, setMovies] = useState<Article[]>([])
  const [moviesLoading, setMoviesLoading] = useState(true)
  const [showMovies, setShowMovies] = useState(true)
  
  // Fetch AI/Tech articles
  const fetchArticles = useCallback(async () => {
    try {
      const response = await fetch("/api/content?category=all", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      })
      const data = await response.json()
      if (data.success) {
        const allContent = data.data
        // Separate movies from articles
        const articleData = allContent.filter((item: Article) => item.category !== "movies")
        const movieData = allContent.filter((item: Article) => item.category === "movies")
        
        setArticles(articleData.slice(0, 6)) // Show top 6 articles
        setMovies(movieData.slice(0, 6)) // Show top 6 movies
        console.log("✅ Content fetched successfully")
      }
    } catch (error) {
      console.error("Failed to fetch content:", error)
    } finally {
      setArticlesLoading(false)
      setMoviesLoading(false)
    }
  }, [])
  
  useEffect(() => {
    fetchArticles()
    
    // Auto-refresh articles every hour
    const articleRefresh = setInterval(() => {
      console.log("🔄 Auto-refreshing articles...")
      fetchArticles()
    }, 3600000) // 1 hour
    
    return () => clearInterval(articleRefresh)
  }, [fetchArticles])



  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 1) return "Just now"
    if (diffInHours === 1) return "1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1 day ago"
    return `${diffInDays} days ago`
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-b from-netflix-red/20 to-netflix-black px-4 sm:px-6 py-6 sm:py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-netflix-red hover:text-netflix-red/80 transition-colors mb-4 sm:mb-6 animate-slide-in-left"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-semibold">Back</span>
        </button>
        <div className="flex items-center gap-3 mb-2 sm:mb-4 animate-slide-up">
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-netflix-red animate-float" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance">
            Tech Explorer & Insights
          </h1>
        </div>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl animate-slide-up stagger-1">
          Discover the latest in AI, technology, and insights from top creators. Auto-updates every hour with fresh content.
        </p>
        <div className="flex items-center gap-4 text-xs text-white/50 mt-3 animate-slide-up stagger-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3 w-3" />
            <span>Auto-updates hourly</span>
          </div>
          <span>•</span>
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* AI/Tech Articles Section */}
      {showArticles && (
        <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-800 bg-netflix-dark-gray/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white animate-slide-in-left">
              🚀 Latest AI & Tech Articles
            </h2>
            <button
              onClick={() => setShowArticles(false)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Hide
            </button>
          </div>
          
          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-netflix-light-gray rounded-lg overflow-hidden animate-pulse">
                  <div className="h-40 bg-netflix-dark-gray" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-netflix-dark-gray rounded w-3/4" />
                    <div className="h-3 bg-netflix-dark-gray rounded" />
                    <div className="h-3 bg-netflix-dark-gray rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article, index) => (
                <article
                  key={article.id}
                  className="bg-netflix-light-gray rounded-lg overflow-hidden group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-netflix-red/20 cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => window.open(article.url, "_blank")}
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-netflix-red px-2 py-1 rounded-full text-xs font-semibold text-white">
                      {article.category.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-netflix-red font-semibold">{article.source}</span>
                      <span className="text-xs text-white/50">{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                    
                    <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-netflix-red transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-white/70 text-xs line-clamp-2 mb-3">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center text-netflix-red text-xs font-semibold group-hover:gap-2 transition-all">
                      Read More
                      <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
      
      {!showArticles && (
        <div className="px-4 sm:px-6 py-3 border-b border-gray-800 bg-netflix-dark-gray/30">
          <button
            onClick={() => setShowArticles(true)}
            className="text-sm text-netflix-red hover:text-netflix-red/80 transition-colors font-semibold"
          >
            ⬆️ Show AI & Tech Articles
          </button>
        </div>
      )}

      {/* Movie Recommendations Section */}
      {showMovies && (
        <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-800 bg-netflix-black">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white animate-slide-in-left">
              🎬 Tech Movies & Shows You'll Love
            </h2>
            <button
              onClick={() => setShowMovies(false)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Hide
            </button>
          </div>
          
          {moviesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-netflix-light-gray rounded-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-netflix-dark-gray" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-netflix-dark-gray rounded w-3/4" />
                    <div className="h-3 bg-netflix-dark-gray rounded" />
                    <div className="h-3 bg-netflix-dark-gray rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {movies.map((movie, index) => (
                <article
                  key={movie.id}
                  className="bg-netflix-light-gray rounded-lg overflow-hidden group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-netflix-red/20 cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => window.open(movie.url, "_blank")}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={movie.image}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded-full text-xs font-bold text-black flex items-center gap-1">
                      ⭐ {movie.rating}/10
                    </div>
                    <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-xs font-semibold text-white">
                      {movie.genre}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-netflix-red font-semibold">{movie.source}</span>
                      <span className="text-xs text-white/50">IMDb</span>
                    </div>
                    
                    <h3 className="text-white font-bold text-sm mb-2 group-hover:text-netflix-red transition-colors">
                      {movie.title}
                    </h3>
                    
                    <p className="text-white/70 text-xs line-clamp-3 mb-3">
                      {movie.description}
                    </p>
                    
                    <div className="flex items-center text-netflix-red text-xs font-semibold group-hover:gap-2 transition-all">
                      Watch on IMDb
                      <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
      
      {!showMovies && (
        <div className="px-4 sm:px-6 py-3 border-b border-gray-800 bg-netflix-black">
          <button
            onClick={() => setShowMovies(true)}
            className="text-sm text-netflix-red hover:text-netflix-red/80 transition-colors font-semibold"
          >
            ⬆️ Show Movie Recommendations
          </button>
        </div>
      )}

      {/* LinkedIn Posts Section from API */}
      <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-800 bg-netflix-dark-gray/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white animate-slide-in-left">
            💼 Trending LinkedIn Posts
          </h2>
        </div>
        
        {articlesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-netflix-light-gray rounded-lg overflow-hidden animate-pulse">
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-netflix-dark-gray rounded w-3/4" />
                  <div className="h-3 bg-netflix-dark-gray rounded" />
                  <div className="h-3 bg-netflix-dark-gray rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.filter(article => article.category === "linkedin").slice(0, 4).map((post, index) => (
              <article
                key={post.id}
                className="bg-netflix-light-gray rounded-lg overflow-hidden group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-netflix-red/20 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => window.open(post.url, "_blank")}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded-full text-xs font-semibold text-white">
                    💼 LINKEDIN
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-netflix-red font-semibold">{post.source}</span>
                    <span className="text-xs text-white/50">{formatTimeAgo(post.publishedAt)}</span>
                  </div>
                  
                  <h3 className="text-white font-bold text-base mb-2 line-clamp-2 group-hover:text-netflix-red transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm line-clamp-3 mb-3">
                    {post.description}
                  </p>
                  
                  <div className="flex items-center text-netflix-red text-sm font-semibold group-hover:gap-2 transition-all">
                    Read More
                    <ExternalLink className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
