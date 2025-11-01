"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface LinkedInPost {
  id: string
  author: string
  handle: string
  avatar: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
  category: string
}

const linkedInPosts: LinkedInPost[] = [
  {
    id: "1",
    author: "Andrew Ng",
    handle: "@andrewng",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content:
      "The future of AI is not about building bigger models, but smarter ones. Efficiency and interpretability are the new frontiers. What are your thoughts on the direction of AI research?",
    image: "https://images.unsplash.com/photo-1677442d019cecf8d5a594b4e1d0b5c5?w=500&h=300&fit=crop",
    likes: 12500,
    comments: 2300,
    shares: 1800,
    timestamp: "2 hours ago",
    category: "AI & LLMs",
  },
  {
    id: "2",
    author: "Yann LeCun",
    handle: "@ylecun",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    content:
      "Self-supervised learning is revolutionizing how we train AI systems. By learning from unlabeled data, we can build more robust and generalizable models. The implications are profound.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=300&fit=crop",
    likes: 9800,
    comments: 1900,
    shares: 1400,
    timestamp: "4 hours ago",
    category: "Machine Learning",
  },
  {
    id: "3",
    author: "Vercel Team",
    handle: "@vercel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content:
      "Next.js 15 is here with incredible performance improvements. Server Components, Edge Functions, and streaming are now more powerful than ever. Ready to build the future of web?",
    image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
    likes: 15200,
    comments: 3100,
    shares: 2200,
    timestamp: "6 hours ago",
    category: "Web Development",
  },
  {
    id: "4",
    author: "Jeremy Howard",
    handle: "@jeremyphoward",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content:
      "Deep learning is becoming more accessible every day. With tools like fastai, anyone can build state-of-the-art models. The democratization of AI is here.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    likes: 8900,
    comments: 1700,
    shares: 1200,
    timestamp: "8 hours ago",
    category: "Data Science",
  },
  {
    id: "5",
    author: "Hugging Face",
    handle: "@huggingface",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content:
      "Transformers have changed everything. From NLP to computer vision, the transformer architecture is the foundation of modern AI. Check out our latest models and datasets.",
    image: "https://images.unsplash.com/photo-1677442d019cecf8d5a594b4e1d0b5c5?w=500&h=300&fit=crop",
    likes: 11300,
    comments: 2100,
    shares: 1600,
    timestamp: "10 hours ago",
    category: "AI & LLMs",
  },
  {
    id: "6",
    author: "Kaggle",
    handle: "@kaggle",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content:
      "Our latest competition is live! Compete with thousands of data scientists and machine learning engineers. Win prizes and showcase your skills to top companies.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    likes: 7600,
    comments: 1400,
    shares: 900,
    timestamp: "12 hours ago",
    category: "Data Science",
  },
  {
    id: "7",
    author: "TensorFlow",
    handle: "@tensorflow",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content:
      "TensorFlow 2.15 brings significant performance improvements and new features for production ML. Learn how to optimize your models for deployment.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=300&fit=crop",
    likes: 6800,
    comments: 1200,
    shares: 800,
    timestamp: "14 hours ago",
    category: "Machine Learning",
  },
  {
    id: "8",
    author: "Anthropic",
    handle: "@anthropic",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content:
      "Claude 3 is pushing the boundaries of what AI can do. With improved reasoning and safety, we're building AI that's more helpful and aligned with human values.",
    image: "https://images.unsplash.com/photo-1677442d019cecf8d5a594b4e1d0b5c5?w=500&h=300&fit=crop",
    likes: 13400,
    comments: 2500,
    shares: 1900,
    timestamp: "16 hours ago",
    category: "AI & LLMs",
  },
]

const categories = ["All", "AI & LLMs", "Machine Learning", "Web Development", "Data Science"]

export default function ExplorerPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const router = useRouter()

  const filteredPosts =
    selectedCategory === "All" ? linkedInPosts : linkedInPosts.filter((post) => post.category === selectedCategory)

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="bg-gradient-to-b from-netflix-red/20 to-netflix-black px-4 sm:px-6 py-6 sm:py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-netflix-red hover:text-netflix-red/80 transition-colors mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-semibold">Back</span>
        </button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 text-balance">
          Tech Insights & Articles
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl">
          Discover the latest insights and posts from top tech creators. Stay updated with trending topics in AI,
          Machine Learning, Web Development, and Data Science.
        </p>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-700 overflow-x-auto">
        <div className="flex gap-2 sm:gap-3 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-semibold whitespace-nowrap text-xs sm:text-sm md:text-base transition-all ${
                selectedCategory === category
                  ? "bg-netflix-red text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:shadow-2xl hover:shadow-netflix-red/20 flex flex-col h-full border border-gray-800"
            >
              <div className="p-3 sm:p-4 flex items-center gap-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                  <Image
                    src={post.avatar || "/placeholder.svg"}
                    alt={post.author}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">{post.author}</h3>
                  <p className="text-xs text-gray-400">{post.handle}</p>
                </div>
                <span className="bg-netflix-red text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0">
                  {post.category}
                </span>
              </div>

              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <p className="text-gray-300 text-xs sm:text-sm line-clamp-3">{post.content}</p>
              </div>

              {post.image && (
                <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-800 mx-3 sm:mx-4 mb-3 sm:mb-4 rounded">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt="Post"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-700 text-xs text-gray-400 space-y-1">
                <p>
                  {post.likes.toLocaleString()} likes • {post.comments.toLocaleString()} comments
                </p>
                <p className="text-gray-500">{post.timestamp}</p>
              </div>

              <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-700 flex gap-2 sm:gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 text-gray-400 hover:text-netflix-red transition-colors text-xs sm:text-sm">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Like</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 text-gray-400 hover:text-netflix-red transition-colors text-xs sm:text-sm">
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Comment</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 text-gray-400 hover:text-netflix-red transition-colors text-xs sm:text-sm">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
