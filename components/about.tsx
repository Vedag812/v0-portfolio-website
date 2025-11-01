"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Code, Database, Globe } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function About() {
  const [bgImage, setBgImage] = useState(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about%20me-xjVJydBNu0KiSV3aXomDkHptDnLSRq.png",
  )
  const [isEditingBg, setIsEditingBg] = useState(false)
  const [bgInput, setBgInput] = useState(bgImage)

  const handleBgChange = () => {
    if (bgInput.trim()) {
      setBgImage(bgInput)
      setIsEditingBg(false)
    }
  }

  const skills = [
    "Machine Learning",
    "Python",
    "TensorFlow",
    "Hugging Face",
    "SQL",
    "Data Science",
    "Generative AI",
    "Deep Learning",
    "React.js",
    "Data Analysis",
  ]

  const languages = ["English", "Hindi", "Bengali", "Japanese"]

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {isEditingBg && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-white font-bold mb-4">Edit Background Image URL</h3>
            <input
              type="text"
              value={bgInput}
              onChange={(e) => setBgInput(e.target.value)}
              placeholder="Enter image URL"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleBgChange} className="flex-1 bg-netflix-red hover:bg-netflix-red/90 text-white">
                Save
              </Button>
              <Button onClick={() => setIsEditingBg(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-netflix-black/80 via-netflix-black/90 to-netflix-black" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl float-animation"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-red-500/10 rounded-full blur-xl float-animation"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl float-animation"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-center flex-1 text-balance gradient-text">About Me</h2>
            <Button
              onClick={() => setIsEditingBg(true)}
              variant="outline"
              size="sm"
              className="border-netflix-red text-netflix-red hover:bg-netflix-red/10"
            >
              Edit BG
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-3 border-netflix-red shadow-xl">
                <Image
                  src="/vedant-profile.jpg"
                  alt="Vedant Agarwal"
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-netflix-red to-blue-500 opacity-20 blur-lg"></div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-4 text-white">Hi, I'm Vedant Agarwal!</h3>
              <p className="text-gray-300 text-pretty leading-relaxed">
                A passionate second-year Computer Science & Data Science student at SRMIST, specializing in building
                machine learning models, analytics solutions, and generative AI applications. I'm driven by solving
                real-world problems through data-driven approaches and innovative technology.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="netflix-card hover-lift bg-gray-900/80 border-netflix-red/30 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Brain className="h-6 w-6 text-netflix-red mr-2" />
                  <h3 className="text-xl font-semibold text-white">Background</h3>
                </div>
                <p className="text-gray-300 text-pretty">
                  Currently pursuing B.Tech in Computer Science (Data Science) at SRMIST with a CGPA of 8.95. I've
                  actively explored how tech solves real-world problems through end-to-end analytics projects, AI
                  applications, and industry simulations like Deloitte Data Analytics and British Airways Data Science
                  Job Simulations.
                </p>
              </CardContent>
            </Card>
            <Card className="netflix-card hover-lift bg-gray-900/80 border-netflix-red/30 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Code className="h-6 w-6 text-netflix-red mr-2" />
                  <h3 className="text-xl font-semibold text-white">Passion & Expertise</h3>
                </div>
                <p className="text-gray-300 text-pretty">
                  I specialize in Machine Learning, Generative AI, and Data Science. My projects span CNN-based image
                  classification, NLP text classification, and AI-powered room design systems. I'm passionate about
                  applying critical thinking and creative problem-solving to build fast, scalable solutions.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="netflix-card hover-lift bg-gray-900/80 border-netflix-red/30 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Database className="h-6 w-6 text-netflix-red mr-2" />
                  <h3 className="text-xl font-semibold text-white">Technical Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} className="bg-netflix-red/20 text-netflix-red border border-netflix-red/50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="netflix-card hover-lift bg-gray-900/80 border-netflix-red/30 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Globe className="h-6 w-6 text-netflix-red mr-2" />
                  <h3 className="text-xl font-semibold text-white">Languages</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <Badge key={language} className="bg-blue-500/20 text-blue-300 border border-blue-500/50">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
