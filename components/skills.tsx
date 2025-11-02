"use client"

import type React from "react"

import { useMediaConfig } from "@/components/media-config-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Code, Database, Globe, Zap } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import Image from "next/image"

export function Skills() {
  const media = useMediaConfig()
  const { ref, isInView } = useInView()

  const skillCategories = [
    {
      title: "Programming Languages",
      icon: <Code className="h-6 w-6" />,
      skills: [
        { name: "Python", level: 90, color: "from-blue-500 to-blue-600" },
        { name: "SQL", level: 85, color: "from-green-500 to-green-600" },
        { name: "JavaScript", level: 80, color: "from-yellow-500 to-yellow-600" },
        { name: "Java", level: 75, color: "from-red-500 to-red-600" },
        { name: "C/C++", level: 70, color: "from-purple-500 to-purple-600" },
      ],
    },
    {
      title: "AI & Machine Learning",
      icon: <Brain className="h-6 w-6" />,
      skills: [
        { name: "TensorFlow", level: 85, color: "from-orange-500 to-orange-600" },
        { name: "Keras", level: 85, color: "from-red-500 to-red-600" },
        { name: "Hugging Face", level: 80, color: "from-purple-500 to-purple-600" },
        { name: "Scikit-learn", level: 85, color: "from-blue-500 to-blue-600" },
        { name: "PyTorch", level: 75, color: "from-red-500 to-red-600" },
      ],
    },
    {
      title: "Data Science & Analytics",
      icon: <Database className="h-6 w-6" />,
      skills: [
        { name: "Pandas", level: 90, color: "from-green-500 to-green-600" },
        { name: "NumPy", level: 85, color: "from-blue-500 to-blue-600" },
        { name: "Matplotlib", level: 80, color: "from-purple-500 to-purple-600" },
        { name: "Seaborn", level: 80, color: "from-pink-500 to-pink-600" },
        { name: "Power BI", level: 75, color: "from-yellow-500 to-yellow-600" },
      ],
    },
    {
      title: "Web & Development",
      icon: <Globe className="h-6 w-6" />,
      skills: [
        { name: "React.js", level: 80, color: "from-cyan-500 to-cyan-600" },
        { name: "HTML/CSS", level: 85, color: "from-orange-500 to-orange-600" },
        { name: "GitHub", level: 85, color: "from-gray-500 to-gray-600" },
        { name: "Next.js", level: 75, color: "from-gray-500 to-gray-600" },
      ],
    },
  ]

  const tools = [
    "MySQL",
    "Supabase",
    "Google AI Studio",
    "Claude",
    "Grok",
    "ChatGPT",
    "Gradio",
    "Jupyter",
    "VS Code",
    "Git",
    "Excel",
    "Tableau",
  ]

  return (
    <section id="skills" className="py-20 relative overflow-hidden" ref={ref}>
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url('${media.backgrounds.skills}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-netflix-black/85 via-netflix-black/90 to-netflix-black" />

      {/* Matrix background effect */}
      <div className="matrix-bg">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="matrix-char"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          >
            {String.fromCharCode(0x30a0 + Math.random() * 96)}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isInView ? "fade-in-up" : "opacity-0"}`}>
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-netflix-red shadow-lg">
                  <Image
                    src={media.profileImage}
                    alt="Vedant Agarwal"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-netflix-red to-blue-500 opacity-20 blur-md"></div>
              </div>
              <h2 className="text-5xl font-bold gradient-text">Technical Arsenal</h2>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Mastering the tools and technologies that power modern AI, Machine Learning, and Data Science
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {skillCategories.map((category, index) => (
              <Card
                key={index}
                className={`netflix-card hover-lift transition-all duration-500 bg-gray-900/80 border-netflix-red/30 backdrop-blur ${
                  isInView ? "slide-in-left" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="p-2 rounded-lg bg-netflix-red/10 text-netflix-red pulse-glow">{category.icon}</div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-200">{skill.name}</span>
                        <span className="text-sm text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${skill.color} skill-bar rounded-full`}
                          style={
                            {
                              "--skill-width": `${skill.level}%`,
                              animationDelay: `${index * 0.2 + skillIndex * 0.1}s`,
                            } as React.CSSProperties
                          }
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tools & Technologies */}
          <Card
            className={`netflix-card hover-lift transition-all duration-700 bg-gray-900/80 border-netflix-red/30 backdrop-blur ${
              isInView ? "fade-in-up" : "opacity-0"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-white">
                <div className="p-2 rounded-lg bg-netflix-red/10 text-netflix-red pulse-glow">
                  <Zap className="h-6 w-6" />
                </div>
                Tools & Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {tools.map((tool, index) => (
                  <Badge
                    key={index}
                    className="px-4 py-2 text-sm hover-lift glass-effect border border-netflix-red/30 hover:border-netflix-red/70 transition-all duration-300 bg-netflix-red/10 text-netflix-red hover:bg-netflix-red/20"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
