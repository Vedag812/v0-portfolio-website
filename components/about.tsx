"use client"

import { useMediaConfig } from "@/components/media-config-provider"
import { useSiteContent } from "@/hooks/use-site-content"
import { Badge } from "@/components/ui/badge"
import { Brain, Code, Database, Globe, GraduationCap, MapPin } from "lucide-react"
import Image from "next/image"

export function About() {
  const media = useMediaConfig()
  const { content } = useSiteContent()
  const a = content?.about
  const c = content?.contact

  const skills = a?.skills ?? [
    "Python", "SQL", "TensorFlow", "Scikit-learn",
    "Pandas", "NumPy", "Power BI", "Tableau",
    "React.js", "NLP", "Machine Learning", "Data Science",
    "Generative AI", "Deep Learning", "ETL Pipelines",
  ]

  const languages = a?.languages ?? ["English", "Hindi", "Bengali", "Japanese"]

  const highlights = [
    { icon: Brain, label: "Focus", value: "Data Science & AI/ML" },
    { icon: GraduationCap, label: "CGPA", value: a?.cgpa ?? "9.2 / 10.0" },
    { icon: Code, label: "Open Source", value: "Contributor" },
    { icon: MapPin, label: "Based in", value: c?.location ?? "Chennai, India" },
  ]

  return (
    <section id="about" className="py-16 sm:py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('${media.backgrounds.about}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-netflix-black via-netflix-black/95 to-netflix-black" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold text-center mb-12 gradient-text">About Me</h2>

          {/* Profile section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="relative shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-[3px] border-white/20 shadow-2xl">
                <Image
                  src={media.profileImage}
                  alt="Vedant Agarwal"
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-netflix-red/20 to-blue-500/20 blur-xl -z-10" />
            </div>
            <div className="text-center md:text-left space-y-3">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Hi, I'm {a?.name ?? "Vedant Agarwal"}!</h3>
              <p className="text-gray-300 leading-relaxed max-w-xl text-sm sm:text-base">
                {a?.bio ?? "Data Science undergraduate with hands-on experience in end-to-end analytics — from SQL-based data engineering and Python-driven ETL pipelines to machine learning model development and Power BI / Tableau dashboards. Keen interest in digital and data-driven transformation within financial services, banking, and capital markets sectors."}
              </p>
              {/* Quick stats */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                  >
                    <h.icon className="h-4 w-4 text-netflix-red" />
                    <div className="text-xs">
                      <span className="text-gray-400">{h.label}: </span>
                      <span className="text-white font-semibold">{h.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            <div className="p-5 sm:p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-red-500/10">
                  <Brain className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Education</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-white">{a?.degree ?? "B.Tech in Computer Science (Data Science)"}</strong> — {a?.college ?? "SRMIST"}, Chennai
                <br />
                CGPA: <strong className="text-white">{a?.cgpa ?? "9.2 / 10.0"}</strong> | {a?.period ?? "Aug 2024 – May 2028"}
                <br /><br />
                Relevant Coursework: {a?.coursework ?? "Data Structures & Algorithms, Machine Learning, Database Management Systems, Probability & Statistics, Statistical Analysis, Quantitative Methods"}
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-blue-500/10">
                  <Code className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Expertise</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {a?.expertise ?? "Strong analytical and problem-solving skills developed through consulting-style simulations (Deloitte, British Airways) and cross-functional team projects. Proven ability to work with large, structured datasets, apply advanced statistical methods (hypothesis testing, regression, classification), and translate findings into clear stakeholder reports and slide decks."}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-5 sm:p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-emerald-500/10">
                  <Database className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Technical Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} className="bg-netflix-red/10 text-netflix-red border border-netflix-red/30 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-purple-500/10">
                  <Globe className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Languages</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <Badge key={language} className="bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
