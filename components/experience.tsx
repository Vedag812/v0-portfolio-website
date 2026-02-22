"use client"

import { useMediaConfig } from "@/components/media-config-provider"
import { useSiteContent } from "@/hooks/use-site-content"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Award, Briefcase } from "lucide-react"

export function Experience() {
  const media = useMediaConfig()
  const { content } = useSiteContent()

  const experiences = content?.experiences ?? [
    {
      title: "Data Science and Analytics Intern",
      company: "Future Interns",
      period: "Dec 2025 – Jan 2026",
      location: "Remote",
      description: [
        "Engineered interactive Power BI dashboards consolidating 50,000+ e-commerce transactions, uncovering 3 revenue gaps adopted into Q1 2026 strategy — contributing to a 12% improvement in campaign ROI",
        "Automated a daily ETL pipeline in Python (Pandas, NumPy) merging data from 3 heterogeneous sources (CSV, REST APIs, MySQL), cutting reporting time from 4 hours to 15 minutes",
        "Performed NLP sentiment analysis on 1,000+ customer reviews using NLTK, TextBlob, and TF-IDF, achieving 92% accuracy; translated findings into a 5-point stakeholder report",
        "Applied hypothesis testing and EDA to identify statistically significant trends; presented graphs, charts, and written reports to non-technical stakeholders",
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
  ]

  const achievements = content?.achievements ?? [
    {
      title: "Harvard HPAIR Delegate",
      detail: "Selected among participants from 70+ countries for the Harvard Project for Asian and International Relations conference",
    },
    {
      title: "Smart India Hackathon 2024",
      detail: "Qualified for national-level government hackathon run by India's Ministry of Education, competing among 100,000+ student teams",
    },
  ]

  const certifications = content?.certifications ?? [
    "Data Analyst Associate — DataCamp",
    "British Airways — Data Science Simulation (Forage)",
    "Deloitte — Data Analytics Simulation (Forage)",
    "Google Generative AI Workshop & Hackathon (Kaggle)",
    "SQL for Data Science (DataCamp)",
  ]

  const typeColors: Record<string, string> = {
    Internship: "bg-netflix-red/15 text-netflix-red border-netflix-red/30",
    Leadership: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Community: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    Volunteer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    "Club Activity": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    Service: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  }

  return (
    <section id="experience" className="py-16 sm:py-20 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header banner */}
          <div className="relative mb-12 rounded-2xl overflow-hidden">
            <div
              className="h-44 sm:h-52 bg-cover bg-center"
              style={{ backgroundImage: `url('${media.backgrounds.experience}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center px-6 sm:px-10">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[3px] border-white/30 shadow-xl shrink-0">
                  <img src={media.profileImage} alt="Vedant Agarwal" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white mb-1 drop-shadow-lg">
                    Experience & Achievements
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base drop-shadow">
                    Building expertise through real-world data science and engineering
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Work experience */}
            <div className="lg:col-span-2">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-netflix-red" />
                Work Experience
              </h3>
              <div className="relative space-y-0">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-netflix-red/50 via-white/10 to-transparent hidden sm:block" />

                {experiences.map((exp, index) => (
                  <div key={index} className="relative pl-0 sm:pl-10 pb-6 last:pb-0">
                    <div className="hidden sm:block absolute left-[10px] top-2 w-[11px] h-[11px] rounded-full bg-netflix-red ring-4 ring-netflix-black" />

                    <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="text-white font-semibold text-base">{exp.title}</h4>
                          <p className="text-netflix-red font-medium text-sm">{exp.company}</p>
                        </div>
                        <Badge className={`shrink-0 text-xs border ${typeColors[exp.type] || "bg-white/10 text-white"}`}>
                          {exp.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {exp.location}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {exp.description.map((bullet, i) => (
                          <li key={i} className="text-gray-300 text-sm leading-relaxed flex gap-2">
                            <span className="text-netflix-red mt-1 shrink-0">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: Achievements + Certifications */}
            <div className="space-y-6">
              {/* Achievements */}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  {achievements.map((a, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-white font-semibold text-sm mb-1">{a.title}</p>
                      <p className="text-gray-400 text-xs leading-relaxed">{a.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Certifications</h3>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="w-1.5 h-1.5 bg-netflix-red rounded-full mt-1.5 shrink-0" />
                      <span className="text-sm text-gray-300 leading-relaxed">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
