import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import fs from "fs"
import path from "path"

const redis = Redis.fromEnv()
const CONTENT_KEY = "site-content"

export interface SiteContent {
  about: {
    name: string
    tagline: string
    bio: string
    cgpa: string
    college: string
    degree: string
    period: string
    coursework: string
    expertise: string
    skills: string[]
    languages: string[]
  }
  experiences: {
    title: string
    company: string
    period: string
    location: string
    description: string[]
    type: string
  }[]
  achievements: {
    title: string
    detail: string
  }[]
  certifications: string[]
  skills: {
    title: string
    icon: string
    color: string
    skills: { name: string; level: number }[]
  }[]
  contact: {
    email: string
    linkedin: string
    github: string
    location: string
    huggingface?: string
  }
}

// Disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Try Redis first
    const content = await redis.get<SiteContent>(CONTENT_KEY)
    if (content) return NextResponse.json(content)
  } catch (error) {
    console.warn("Redis fetch failed for content:", error)
  }

  // Fallback: try local file
  try {
    const filePath = path.join(process.cwd(), "data", "content.json")
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"))
      return NextResponse.json(data)
    }
  } catch { }

  // Final fallback: defaults
  return NextResponse.json(getDefaultContent())
}

export async function POST(request: Request) {
  try {
    // Accept both auth modes for compatibility
    const xToken = request.headers.get("x-admin-token")
    const bearerToken = request.headers.get("authorization")?.replace("Bearer ", "")
    const token = xToken || bearerToken

    if (!token || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const content: SiteContent = await request.json()

    // Save to Redis
    let savedToRedis = false
    try {
      await redis.set(CONTENT_KEY, content)
      savedToRedis = true
    } catch (redisError) {
      console.warn("Redis save failed for content:", redisError)
    }

    // Also save locally as backup
    try {
      const filePath = path.join(process.cwd(), "data", "content.json")
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2))
    } catch { }

    return NextResponse.json({ success: true, storage: savedToRedis ? "redis" : "local" })
  } catch (error) {
    console.error("Failed to save site content:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}

function getDefaultContent(): SiteContent {
  return {
    about: {
      name: "Vedant Agarwal",
      tagline: "Data Science & AI/ML • Full Stack Developer • B.Tech CSE (DS) @ SRMIST",
      bio: "Data Science undergraduate with hands-on experience in end-to-end analytics — from SQL-based data engineering and Python-driven ETL pipelines to machine learning model development and Power BI / Tableau dashboards. Keen interest in digital and data-driven transformation within financial services, banking, and capital markets sectors.",
      cgpa: "9.2 / 10.0",
      college: "SRM Institute of Science and Technology",
      degree: "B.Tech in Computer Science (Data Science)",
      period: "Aug 2024 – May 2028",
      coursework: "Data Structures & Algorithms, Machine Learning, Database Management Systems, Probability & Statistics, Statistical Analysis, Quantitative Methods",
      expertise: "Strong analytical and problem-solving skills developed through consulting-style simulations (Deloitte, British Airways) and cross-functional team projects. Proven ability to work with large, structured datasets, apply advanced statistical methods (hypothesis testing, regression, classification), and translate findings into clear stakeholder reports and slide decks.",
      skills: ["Python", "SQL", "TensorFlow", "Scikit-learn", "Pandas", "NumPy", "Power BI", "Tableau", "React.js", "NLP", "Machine Learning", "Data Science", "Generative AI", "Deep Learning", "ETL Pipelines"],
      languages: ["English", "Hindi", "Bengali", "Japanese"],
    },
    experiences: [
      {
        title: "Data Science and Analytics Intern",
        company: "Future Interns",
        period: "Dec 2025 – Jan 2026",
        location: "Remote",
        description: [
          "Engineered interactive Power BI dashboards consolidating 50,000+ e-commerce transactions, uncovering 3 revenue gaps adopted into Q1 2026 strategy — contributing to a 12% improvement in campaign ROI",
          "Automated a daily ETL pipeline in Python (Pandas, NumPy) merging data from 3 heterogeneous sources (CSV, REST APIs, MySQL), cutting reporting time from 4 hours to 15 minutes",
          "Performed NLP sentiment analysis on 1,000+ customer reviews using NLTK, TextBlob, and TF-IDF, achieving 92% accuracy",
          "Applied hypothesis testing and EDA to identify statistically significant trends; presented graphs and reports to non-technical stakeholders",
        ],
        type: "Internship",
      },
      {
        title: "Full-Stack Development Volunteer",
        company: "Directorate of Student Affairs, SRMIST",
        period: "Dec 2024 – Apr 2025",
        location: "Chennai, India",
        description: [
          "Collaborated within an 8-member cross-functional team to build the Milan college fest web platform (React.js, Node.js, Supabase), supporting 10,000+ student registrations across 50+ events",
          "Optimised platform performance via code splitting and lazy loading, reducing page load time by 36% (4.2s → 2.7s)",
        ],
        type: "Club Activity",
      },
    ],
    achievements: [
      {
        title: "Harvard HPAIR Delegate",
        detail: "Selected among participants from 70+ countries for the Harvard Project for Asian and International Relations conference",
      },
      {
        title: "Smart India Hackathon 2024",
        detail: "Qualified for national-level government hackathon run by India's Ministry of Education, competing among 100,000+ student teams",
      },
    ],
    certifications: [
      "Data Analyst Associate — DataCamp",
      "British Airways — Data Science Simulation (Forage)",
      "Deloitte — Data Analytics Simulation (Forage)",
      "Google Generative AI Workshop & Hackathon (Kaggle)",
      "SQL for Data Science (DataCamp)",
    ],
    skills: [
      {
        title: "Programming Languages",
        icon: "Code",
        color: "text-blue-400",
        skills: [
          { name: "Python", level: 92 },
          { name: "SQL (PostgreSQL, MySQL)", level: 88 },
          { name: "JavaScript", level: 80 },
          { name: "C / C++", level: 70 },
          { name: "Java", level: 65 },
        ],
      },
      {
        title: "Data Analysis & Statistics",
        icon: "BarChart3",
        color: "text-emerald-400",
        skills: [
          { name: "Pandas / NumPy", level: 92 },
          { name: "EDA & Data Wrangling", level: 90 },
          { name: "Hypothesis Testing / A/B Testing", level: 85 },
          { name: "Statistical & Quantitative Analysis", level: 85 },
          { name: "Data Mining & Modelling", level: 80 },
        ],
      },
      {
        title: "Machine Learning & NLP",
        icon: "Brain",
        color: "text-red-400",
        skills: [
          { name: "Scikit-learn / XGBoost", level: 88 },
          { name: "TensorFlow / Keras", level: 82 },
          { name: "NLTK / TF-IDF / TextBlob", level: 85 },
          { name: "Feature Engineering", level: 80 },
          { name: "Transformers & Sentiment Analysis", level: 75 },
        ],
      },
      {
        title: "Visualization & Reporting",
        icon: "Database",
        color: "text-amber-400",
        skills: [
          { name: "Power BI", level: 88 },
          { name: "Tableau", level: 82 },
          { name: "Matplotlib / Seaborn / Plotly", level: 85 },
          { name: "Dashboard Design", level: 80 },
          { name: "Stakeholder Presentations", level: 85 },
        ],
      },
      {
        title: "Cloud & Tools",
        icon: "Globe",
        color: "text-purple-400",
        skills: [
          { name: "GCP (Google Cloud)", level: 70 },
          { name: "Git / GitHub", level: 90 },
          { name: "Jupyter / Google Colab", level: 92 },
          { name: "ETL Pipelines / REST APIs", level: 80 },
          { name: "Supabase / Gradio", level: 75 },
        ],
      },
      {
        title: "Web Development",
        icon: "Code",
        color: "text-cyan-400",
        skills: [
          { name: "React.js / Next.js", level: 82 },
          { name: "Node.js", level: 72 },
          { name: "HTML / CSS / Tailwind", level: 88 },
          { name: "TypeScript", level: 75 },
        ],
      },
    ],
    contact: {
      email: "vedantagarwal039@gmail.com",
      linkedin: "https://www.linkedin.com/in/vedant-agarwal-36bb18142",
      github: "https://github.com/Vedag812",
      location: "Chennai, India",
      huggingface: "https://huggingface.co/Vedag812",
    },
  }
}
