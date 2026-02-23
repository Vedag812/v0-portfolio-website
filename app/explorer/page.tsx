"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ArrowLeft, ExternalLink, Sparkles, Film, BookOpen, Briefcase, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

// ── Curated content kept as static (movies + linkedin) ──
// Articles are now fetched live from /api/explorer

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

// ── Tech Movies & Shows ───────────────────────────────
const MOVIES: Article[] = [
  {
    id: "m1",
    title: "The Social Network (2010)",
    description: "David Fincher's razor-sharp drama about the founding of Facebook. Aaron Sorkin's script crackles with ambition, betrayal, and the explosive birth of social media that changed the world.",
    url: "https://www.imdb.com/title/tt1285016/",
    image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80",
    source: "Drama",
    publishedAt: "2010-10-01T00:00:00Z",
    category: "movies",
    rating: 7.8,
    genre: "Drama / Biography",
  },
  {
    id: "m2",
    title: "Ex Machina (2014)",
    description: "A programmer evaluates an AI's consciousness during an intense Turing test in a remote research facility. Raises profound questions about intelligence, consciousness, and manipulation.",
    url: "https://www.imdb.com/title/tt0470752/",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    source: "Sci-Fi",
    publishedAt: "2014-01-21T00:00:00Z",
    category: "movies",
    rating: 7.7,
    genre: "Sci-Fi / Thriller",
  },
  {
    id: "m3",
    title: "The Imitation Game (2014)",
    description: "Benedict Cumberbatch as Alan Turing, the father of computer science, who cracked the Enigma code in WWII. A moving portrait of genius, secrecy, and the birth of the digital age.",
    url: "https://www.imdb.com/title/tt2084970/",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    source: "Biography",
    publishedAt: "2014-11-28T00:00:00Z",
    category: "movies",
    rating: 8.0,
    genre: "Biography / Drama",
  },
  {
    id: "m4",
    title: "Silicon Valley (2014–2019)",
    description: "Mike Judge's hilarious HBO series following a group of programmers navigating the absurd world of Silicon Valley startups. Eerily accurate satire of tech culture, compression algorithms, and VC chaos.",
    url: "https://www.imdb.com/title/tt2575988/",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    source: "HBO",
    publishedAt: "2014-04-06T00:00:00Z",
    category: "movies",
    rating: 8.5,
    genre: "Comedy / Drama",
  },
  {
    id: "m5",
    title: "Moneyball (2011)",
    description: "Brad Pitt stars as Billy Beane, the Oakland A's GM who used data analytics and sabermetrics to build a winning baseball team on a shoestring budget. The movie that made data science cool.",
    url: "https://www.imdb.com/title/tt1210166/",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
    source: "Drama",
    publishedAt: "2011-09-23T00:00:00Z",
    category: "movies",
    rating: 7.6,
    genre: "Drama / Sport",
  },
  {
    id: "m6",
    title: "Her (2013)",
    description: "Spike Jonze's Oscar-winning exploration of a man falling in love with an AI operating system. A poetic, prescient film about loneliness, connection, and artificially intelligent companionship.",
    url: "https://www.imdb.com/title/tt1798709/",
    image: "https://images.unsplash.com/photo-1531746790095-e5f8a9f0e82f?w=800&q=80",
    source: "Romance / Sci-Fi",
    publishedAt: "2013-12-18T00:00:00Z",
    category: "movies",
    rating: 8.0,
    genre: "Romance / Sci-Fi",
  },
]

// ── LinkedIn-style Posts ──────────────────────────────
const LINKEDIN_POSTS: Article[] = [
  {
    id: "l1",
    title: "Why Your Data Science Portfolio Matters More Than Your Degree",
    description: "Hiring managers spend an average of 6 seconds on a resume, but 3+ minutes exploring a well-built portfolio. Show your end-to-end project work — data cleaning, EDA, modelling, and deployment.",
    url: "https://www.linkedin.com/pulse/why-your-data-science-portfolio-matters-more-than-degree/",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    source: "Career Insights",
    publishedAt: "2025-01-15T00:00:00Z",
    category: "linkedin",
  },
  {
    id: "l2",
    title: "The T-Shaped Data Scientist — Deep in ML, Wide in Engineering",
    description: "The most hireable data scientists aren't just good at modelling. They understand SQL, cloud infra, version control, and stakeholder communication. Build depth in ML but breadth across the stack.",
    url: "https://www.linkedin.com/pulse/t-shaped-data-scientist/",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    source: "Professional Growth",
    publishedAt: "2025-01-08T00:00:00Z",
    category: "linkedin",
  },
  {
    id: "l3",
    title: "Open Source Contributions > Certifications for Landing Interviews",
    description: "A merged PR on a popular open-source project demonstrates real engineering skills better than any certificate. Start with 'good first issues' and build genuine expertise through contribution.",
    url: "https://www.linkedin.com/pulse/open-source-contributions-certifications/",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    source: "Tech Careers",
    publishedAt: "2024-12-20T00:00:00Z",
    category: "linkedin",
  },
  {
    id: "l4",
    title: "How I Used Power BI Dashboards to Land My First Data Analyst Role",
    description: "Sharing my journey from university projects to a full-time data analyst position. The key? Building 5 real-world dashboards with messy datasets and telling compelling data stories in interviews.",
    url: "https://www.linkedin.com/pulse/how-i-used-power-bi-dashboards/",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    source: "Success Stories",
    publishedAt: "2024-11-30T00:00:00Z",
    category: "linkedin",
  },
]

export default function ExplorerPage() {
  const router = useRouter()
  const [showArticles, setShowArticles] = useState(true)
  const [showMovies, setShowMovies] = useState(true)

  // Live articles from API
  const [liveArticles, setLiveArticles] = useState<Article[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [fetchedAt, setFetchedAt] = useState<string | null>(null)

  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true)
    try {
      const res = await fetch("/api/explorer", { cache: "no-store" })
      const data = await res.json()
      if (data.success && data.articles?.length) {
        setLiveArticles(data.articles)
        setFetchedAt(data.fetchedAt)
      }
    } catch (err) {
      console.error("Failed to fetch live articles:", err)
    } finally {
      setArticlesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
    const interval = setInterval(fetchArticles, 3600000) // refresh every hour
    return () => clearInterval(interval)
  }, [fetchArticles])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 30) return `${diffInDays} days ago`
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths === 1) return "1 month ago"
    return `${diffInMonths} months ago`
  }

  const categoryBadgeColors: Record<string, string> = {
    ai: "bg-netflix-red",
    tech: "bg-purple-600",
    dev: "bg-emerald-600",
    linkedin: "bg-blue-600",
    movies: "bg-yellow-600",
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-netflix-red/20 to-netflix-black px-4 sm:px-6 py-6 sm:py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-netflix-red hover:text-netflix-red/80 transition-colors mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-semibold">Back</span>
        </button>
        <div className="flex items-center gap-3 mb-2 sm:mb-4">
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-netflix-red" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Tech Explorer & Insights
          </h1>
        </div>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl">
          Live feed of the latest AI, data science, and tech articles — refreshed every hour.
        </p>
        <div className="flex items-center gap-4 text-xs text-white/40 mt-2">
          <div className="flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3" />
            <span>Auto-refreshes hourly</span>
          </div>
          {fetchedAt && (
            <>
              <span>•</span>
              <span>Updated: {new Date(fetchedAt).toLocaleTimeString()}</span>
            </>
          )}
        </div>
      </div>

      {/* AI/Tech Articles */}
      {showArticles && (
        <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-800 bg-netflix-dark-gray/50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-netflix-red" />
              Latest AI & Tech Articles
            </h2>
            <button
              onClick={() => setShowArticles(false)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Hide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {articlesLoading ? (
              // Skeleton loader
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded-xl overflow-hidden animate-pulse">
                  <div className="h-40 sm:h-44 bg-netflix-dark-gray" />
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="h-4 bg-netflix-dark-gray rounded w-3/4" />
                    <div className="h-3 bg-netflix-dark-gray rounded" />
                    <div className="h-3 bg-netflix-dark-gray rounded w-5/6" />
                  </div>
                </div>
              ))
            ) : (
              liveArticles.map((article, index) => (
                <article
                  key={article.id}
                  className="bg-[#1a1a1a] rounded-xl overflow-hidden group hover:scale-[1.03] transition-all duration-300 hover:shadow-xl hover:shadow-netflix-red/15 cursor-pointer"
                  style={{ animationDelay: `${index * 0.08}s` }}
                  onClick={() => window.open(article.url, "_blank")}
                >
                  <div className="relative h-40 sm:h-44 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
                    <div className={`absolute top-2.5 right-2.5 ${categoryBadgeColors[article.category]} px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wide`}>
                      {article.category}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-netflix-red font-semibold">{article.source}</span>
                      <span className="text-[11px] text-white/40">{formatTimeAgo(article.publishedAt)}</span>
                    </div>

                    <h3 className="text-white font-bold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-netflix-red transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-white/60 text-xs sm:text-sm line-clamp-2 mb-3 leading-relaxed">
                      {article.description}
                    </p>

                    <div className="flex items-center text-netflix-red text-xs font-semibold group-hover:gap-2 transition-all">
                      Read More
                      <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
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

      {/* Tech Movies & Shows */}
      {showMovies && (
        <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-800 bg-netflix-black">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Film className="h-5 w-5 text-yellow-500" />
              Tech Movies & Shows You'll Love
            </h2>
            <button
              onClick={() => setShowMovies(false)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Hide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {MOVIES.map((movie, index) => (
              <article
                key={movie.id}
                className="bg-[#1a1a1a] rounded-xl overflow-hidden group hover:scale-[1.03] transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 cursor-pointer"
                style={{ animationDelay: `${index * 0.08}s` }}
                onClick={() => window.open(movie.url, "_blank")}
              >
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
                  <div className="absolute top-2.5 right-2.5 bg-yellow-500 px-2.5 py-1 rounded-full text-[10px] font-bold text-black flex items-center gap-1">
                    ⭐ {movie.rating}/10
                  </div>
                  <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white">
                    {movie.genre}
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-netflix-red font-semibold">{movie.source}</span>
                    <span className="text-[11px] text-white/40">IMDb</span>
                  </div>

                  <h3 className="text-white font-bold text-sm sm:text-base mb-2 group-hover:text-yellow-400 transition-colors leading-snug">
                    {movie.title}
                  </h3>

                  <p className="text-white/60 text-xs sm:text-sm line-clamp-3 mb-3 leading-relaxed">
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

      {/* LinkedIn Posts */}
      <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-800 bg-netflix-dark-gray/30">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-400" />
            Career Insights & LinkedIn Posts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {LINKEDIN_POSTS.map((post, index) => (
            <article
              key={post.id}
              className="bg-[#1a1a1a] rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer"
              style={{ animationDelay: `${index * 0.08}s` }}
              onClick={() => window.open(post.url, "_blank")}
            >
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
                <div className="absolute top-2.5 right-2.5 bg-blue-600 px-2.5 py-1 rounded-full text-[10px] font-bold text-white">
                  💼 LINKEDIN
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-netflix-red font-semibold">{post.source}</span>
                  <span className="text-[11px] text-white/40">{formatTimeAgo(post.publishedAt)}</span>
                </div>

                <h3 className="text-white font-bold text-base mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-white/60 text-sm line-clamp-3 mb-3 leading-relaxed">
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
      </div>
    </div>
  )
}
