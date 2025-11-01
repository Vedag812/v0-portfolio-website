"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Github, Linkedin, Mail, MapPin } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = encodeURIComponent(`New message from ${formData.name}`)
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)
    const mailtoLink = `mailto:vedantagarwal039@gmail.com?subject=${subject}&body=${body}`

    // Open the mailto link
    window.location.href = mailtoLink

    setSubmitStatus("success")
    setFormData({ name: "", email: "", message: "" })
    setTimeout(() => {
      window.open("https://mail.google.com/mail/u/0/#inbox", "_blank")
      setSubmitStatus("idle")
    }, 500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('/contact-icons.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-netflix-black/80 via-netflix-black/90 to-netflix-black" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-balance gradient-text">Let's Connect</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="netflix-card bg-gray-900/80 border-netflix-red/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Button type="submit" className="w-full bg-netflix-red hover:bg-netflix-red/90 text-white">
                    Send Message
                  </Button>
                  {submitStatus === "success" && <p className="text-green-400 text-sm">Opening Gmail...</p>}
                  {submitStatus === "error" && <p className="text-red-400 text-sm">Failed to send message.</p>}
                </form>
              </CardContent>
            </Card>

            <Card className="netflix-card bg-gray-900/80 border-netflix-red/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-netflix-red mr-3" />
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <a
                      href="mailto:vedantagarwal039@gmail.com"
                      className="text-gray-300 hover:text-netflix-red transition-colors"
                    >
                      vedantagarwal039@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-netflix-red mr-3" />
                  <div>
                    <p className="font-medium text-white">Location</p>
                    <p className="text-gray-300">Kolkata, West Bengal, India</p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="font-medium mb-3 text-white">Connect with me</p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="border-netflix-red/50 hover:bg-netflix-red/10 bg-transparent"
                    >
                      <a href="https://github.com/Vedag812" target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 text-netflix-red" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="border-netflix-red/50 hover:bg-netflix-red/10 bg-transparent"
                    >
                      <a
                        href="https://www.linkedin.com/in/vedant-agarwal-36bb18142"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4 text-netflix-red" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="border-netflix-red/50 hover:bg-netflix-red/10 bg-transparent"
                    >
                      <a href="mailto:vedantagarwal039@gmail.com">
                        <Mail className="h-4 w-4 text-netflix-red" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
