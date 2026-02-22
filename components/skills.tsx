"use client"

import { useMediaConfig } from "@/components/media-config-provider"
import { useSiteContent } from "@/hooks/use-site-content"
import { Badge } from "@/components/ui/badge"
import { Brain, Code, Database, Globe, Zap, BarChart3 } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const ICON_MAP: Record<string, any> = { Code, Brain, Database, Globe, Zap, BarChart3 }

export function Skills() {
  const media = useMediaConfig()
  const { ref, isInView: inView } = useInView({ threshold: 0.1 })
  const { content } = useSiteContent()

  const fallbackCategories = [
    {
      title: "Programming Languages",
      icon: Code,
      color: "text-blue-400",
      skills: [
        { name: "Python", level: 92 },
        { name: "SQL (PostgreSQL, MySQL)", level: 88 },
        { name: "JavaScript", level: 80 },
        { name: "C / C++", level: 70 },
        { name: "Java", level: 65 },
        { name: "R (learning)", level: 30 },
      ],
    },
    {
      title: "Data Analysis & Statistics",
      icon: BarChart3,
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
      icon: Brain,
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
      icon: Database,
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
      icon: Globe,
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
      icon: Code,
      color: "text-cyan-400",
      skills: [
        { name: "React.js / Next.js", level: 82 },
        { name: "Node.js", level: 72 },
        { name: "HTML / CSS / Tailwind", level: 88 },
        { name: "TypeScript", level: 75 },
      ],
    },
  ]

  // Map API data (icon strings) to components, or use fallbacks
  const skillCategories = content?.skills?.length
    ? content.skills.map(cat => ({
      ...cat,
      icon: ICON_MAP[cat.icon] || Code,
    }))
    : fallbackCategories

  return (
    <section id="skills" className="py-16 sm:py-20 relative overflow-hidden" ref={ref}>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('${media.backgrounds.skills}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-netflix-black via-netflix-black/95 to-netflix-black" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-300 font-medium">Technical Proficiency</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold gradient-text mb-3">Skills & Expertise</h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
              End-to-end analytics — from data engineering to ML models & dashboards
            </p>
          </div>

          {/* Skills grid — 2 cols on md, 3 on lg */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillCategories.map((category, catIndex) => (
              <div
                key={category.title}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`p-2 rounded-lg bg-white/5 ${category.color}`}>
                    <category.icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-white font-semibold text-sm">{category.title}</h3>
                </div>

                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-300">{skill.name}</span>
                        <span className="text-[10px] text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: inView ? `${skill.level}%` : "0%",
                            background: `linear-gradient(90deg, var(--netflix-red) 0%, #3b82f6 100%)`,
                            transitionDelay: `${catIndex * 0.1}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
