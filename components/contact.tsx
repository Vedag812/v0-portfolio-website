"use client"

import type React from "react"

import { useMediaConfig } from "@/components/media-config-provider"
import { useSiteContent } from "@/hooks/use-site-content"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Github, Linkedin, Mail, MapPin, Send, CheckCircle, XCircle } from "lucide-react"

export function Contact() {
  const media = useMediaConfig()
  const { content } = useSiteContent()
  const ct = content?.contact
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", message: "" })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setSubmitStatus("error")
    } finally {
      setIsLoading(false)
      setTimeout(() => setSubmitStatus("idle"), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const socials = [
    {
      icon: Github,
      label: "GitHub",
      href: ct?.github ?? "https://github.com/Vedag812",
      username: "@Vedag812",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: ct?.linkedin ?? "https://www.linkedin.com/in/vedant-agarwal-36bb18142",
      username: "Vedant Agarwal",
    },
    {
      icon: Mail,
      label: "Email",
      href: `mailto:${ct?.email ?? "vedantagarwal039@gmail.com"}`,
      username: ct?.email ?? "vedantagarwal039@gmail.com",
    },
    {
      icon: MapPin,
      label: "Location",
      href: "#",
      username: ct?.location ?? "Chennai, India",
    },
  ]

  return (
    <section id="contact" className="py-16 sm:py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('${media.backgrounds.contact}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-netflix-black via-netflix-black/95 to-netflix-black" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold mb-3 gradient-text">Let's Connect</h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
              Have a project in mind or just want to say hi? Drop me a message!
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Contact form — takes 3 columns */}
            <div className="md:col-span-3 p-5 sm:p-6 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-xl shadow-black/20">
              <h3 className="text-white font-semibold text-lg mb-5">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-netflix-red/50 h-11"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-netflix-red/50 h-11"
                  />
                </div>
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-netflix-red/50 resize-none"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-netflix-red hover:bg-netflix-red/90 text-white h-11 font-medium transition-all"
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </Button>

                {submitStatus === "success" && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                    <p className="text-green-400 text-sm">Message sent! I'll get back to you soon.</p>
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <p className="text-red-400 text-sm">Failed to send. Please try again.</p>
                  </div>
                )}
              </form>
            </div>

            {/* Contact info — takes 2 columns */}
            <div className="md:col-span-2 space-y-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") || social.href.startsWith("mailto") || social.href.startsWith("tel") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-netflix-red/30 hover:bg-white/[0.06] transition-all duration-300 group shadow-lg shadow-black/10"
                >
                  <div className="p-2.5 rounded-lg bg-netflix-red/10 group-hover:bg-netflix-red/20 transition-colors">
                    <social.icon className="h-5 w-5 text-netflix-red" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{social.label}</p>
                    <p className="text-sm text-white truncate">{social.username}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
