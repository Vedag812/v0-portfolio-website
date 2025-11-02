import { NextResponse } from "next/server"

// Types for content
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

// Mock data - In production, you'd fetch from real APIs
const generateMockContent = (): Article[] => {
  const aiArticles: Article[] = [
    {
      id: "ai-1",
      title: "GPT-5 Breakthrough: OpenAI's Next Generation Model",
      description: "OpenAI announces major advancements in their latest language model with improved reasoning capabilities.",
      url: "https://openai.com/blog",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      source: "OpenAI Blog",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: "ai",
    },
    {
      id: "ai-2",
      title: "Machine Learning in Healthcare: Predicting Patient Outcomes",
      description: "How AI models are revolutionizing early disease detection and treatment planning.",
      url: "https://nature.com/articles/ai",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      source: "Nature AI",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      category: "ai",
    },
    {
      id: "ai-3",
      title: "Computer Vision Advances in Autonomous Vehicles",
      description: "New neural network architectures improve object detection accuracy by 40%.",
      url: "https://arxiv.org/ai",
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
      source: "arXiv",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      category: "ai",
    },
    {
      id: "ai-4",
      title: "Transformers vs. Diffusion Models: Which is Better?",
      description: "A comprehensive comparison of modern generative AI architectures.",
      url: "https://towardsdatascience.com",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
      source: "Towards Data Science",
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      category: "ai",
    },
  ]

  const techBlogs: Article[] = [
    {
      id: "tech-1",
      title: "Next.js 15: The Future of React Development",
      description: "Exploring the new features and performance improvements in Next.js 15.",
      url: "https://nextjs.org/blog",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      source: "Vercel Blog",
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      category: "tech",
    },
    {
      id: "tech-2",
      title: "Rust in Production: Why Companies are Making the Switch",
      description: "Performance, safety, and developer experience driving Rust adoption.",
      url: "https://blog.rust-lang.org",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80",
      source: "Rust Blog",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      category: "tech",
    },
    {
      id: "tech-3",
      title: "WebAssembly: Running Native Code in the Browser",
      description: "How WASM is changing the landscape of web application development.",
      url: "https://webassembly.org/blog",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      source: "WebAssembly",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      category: "tech",
    },
    {
      id: "tech-4",
      title: "Quantum Computing: From Theory to Practice",
      description: "Latest breakthroughs in quantum algorithms and error correction.",
      url: "https://quantum-computing.ibm.com",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
      source: "IBM Quantum",
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      category: "tech",
    },
  ]

  const devNews: Article[] = [
    {
      id: "dev-1",
      title: "GitHub Copilot X: AI-Powered Coding Assistant Evolution",
      description: "New features including chat, voice commands, and pull request summaries.",
      url: "https://github.blog/copilot",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80",
      source: "GitHub Blog",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      category: "dev",
    },
    {
      id: "dev-2",
      title: "TypeScript 5.5 Released with Major Performance Improvements",
      description: "Faster type checking and new language features announced.",
      url: "https://devblogs.microsoft.com/typescript",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
      source: "Microsoft",
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      category: "dev",
    },
    {
      id: "dev-3",
      title: "Docker Desktop 5.0: Kubernetes Made Easy",
      description: "Simplified container orchestration with new GUI tools.",
      url: "https://docker.com/blog",
      image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
      source: "Docker",
      publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
      category: "dev",
    },
    {
      id: "dev-4",
      title: "Serverless Architecture: Best Practices in 2025",
      description: "Cost optimization and performance tuning for cloud functions.",
      url: "https://aws.amazon.com/blogs",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      source: "AWS Blog",
      publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
      category: "dev",
    },
  ]

  const linkedinPosts: Article[] = [
    {
      id: "linkedin-1",
      title: "Top 10 Skills Every Data Scientist Needs in 2025",
      description: "Industry leaders share insights on the most valuable skills for data science careers.",
      url: "https://linkedin.com/pulse",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      source: "LinkedIn",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: "linkedin",
    },
    {
      id: "linkedin-2",
      title: "Breaking Into Tech: A Complete Roadmap",
      description: "From bootcamps to FAANG: A comprehensive guide for career switchers.",
      url: "https://linkedin.com/pulse",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      source: "LinkedIn",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      category: "linkedin",
    },
    {
      id: "linkedin-3",
      title: "Remote Work: Productivity Tips from Top Developers",
      description: "Best practices for maintaining work-life balance while coding from home.",
      url: "https://linkedin.com/pulse",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      source: "LinkedIn",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      category: "linkedin",
    },
    {
      id: "linkedin-4",
      title: "Building a Personal Brand in Tech",
      description: "How to stand out on LinkedIn and attract recruiters.",
      url: "https://linkedin.com/pulse",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      source: "LinkedIn",
      publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
      category: "linkedin",
    },
  ]

  const movieRecommendations: Article[] = [
    {
      id: "movie-1",
      title: "The Social Network (2010)",
      description: "The story of Facebook's founding and the legal battles that followed. A must-watch for tech entrepreneurs.",
      url: "https://www.imdb.com/title/tt1285016/",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
      source: "Tech Drama",
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      category: "movies",
      rating: 7.8,
      genre: "Biography/Drama",
    },
    {
      id: "movie-2",
      title: "Ex Machina (2014)",
      description: "A thought-provoking exploration of artificial intelligence and consciousness.",
      url: "https://www.imdb.com/title/tt0470752/",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
      source: "Sci-Fi",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      category: "movies",
      rating: 7.7,
      genre: "Sci-Fi/Thriller",
    },
    {
      id: "movie-3",
      title: "The Imitation Game (2014)",
      description: "Alan Turing's groundbreaking work in cryptography during WWII. The father of computer science.",
      url: "https://www.imdb.com/title/tt2084970/",
      image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&q=80",
      source: "Historical",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      category: "movies",
      rating: 8.0,
      genre: "Biography/Drama",
    },
    {
      id: "movie-4",
      title: "Silicon Valley (TV Series)",
      description: "A hilarious and accurate portrayal of startup culture in the tech industry.",
      url: "https://www.imdb.com/title/tt2575988/",
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80",
      source: "Comedy",
      publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
      category: "movies",
      rating: 8.5,
      genre: "Comedy/Tech",
    },
    {
      id: "movie-5",
      title: "Her (2013)",
      description: "A lonely man develops a relationship with an AI operating system. Explores human-AI interaction.",
      url: "https://www.imdb.com/title/tt1798709/",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      source: "Sci-Fi Romance",
      publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
      category: "movies",
      rating: 8.0,
      genre: "Sci-Fi/Romance",
    },
    {
      id: "movie-6",
      title: "Steve Jobs (2015)",
      description: "Behind-the-scenes look at three iconic product launches that shaped Apple's history.",
      url: "https://www.imdb.com/title/tt2080374/",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
      source: "Biography",
      publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      category: "movies",
      rating: 7.2,
      genre: "Biography/Drama",
    },
  ]

  return [...aiArticles, ...techBlogs, ...devNews, ...linkedinPosts, ...movieRecommendations]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let content = generateMockContent()

    // Filter by category if specified
    if (category && category !== "all") {
      content = content.filter((article) => article.category === category)
    }

    // Sort by published date (newest first)
    content.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return NextResponse.json({
      success: true,
      data: content,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch content" }, { status: 500 })
  }
}
