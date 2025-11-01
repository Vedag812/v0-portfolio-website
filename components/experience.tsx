import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

export function Experience() {
  const experiences = [
    {
      title: "Indigo Squad Member",
      company: "Mood Indigo IIT Bombay",
      period: "August 2025 - Present",
      location: "Mumbai, India",
      description:
        "Contributing to India's largest college cultural festival, working on event coordination and technical initiatives.",
      type: "Leadership",
      backgroundImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/experience-B24f9rAK1SziWfvaTiWzsLN7Hi05M3.jpg",
    },
    {
      title: "Member",
      company: "Google Developers Group",
      period: "July 2025 - Present",
      location: "Chennai, Tamil Nadu",
      description:
        "Active member of the developer community, participating in workshops, hackathons, and knowledge sharing sessions.",
      type: "Community",
      backgroundImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/experience-B24f9rAK1SziWfvaTiWzsLN7Hi05M3.jpg",
    },
    {
      title: "Tech Volunteer",
      company: "Directorate Of Student Affairs, SRMIST",
      period: "October 2024 - Present",
      location: "Chennai, Tamil Nadu",
      description:
        "Enhanced event websites using React.js, attracting 10,000+ visitors across 5 events and improving page load time by 40%. Resolved 50+ technical issues during live events, ensuring zero downtime.",
      type: "Volunteer",
      backgroundImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/experience-B24f9rAK1SziWfvaTiWzsLN7Hi05M3.jpg",
    },
    {
      title: "Volunteer",
      company: "National Service Scheme",
      period: "September 2024 - December 2024",
      location: "Chennai, Tamil Nadu",
      description:
        "Participated in community service initiatives and social development programs, contributing to local community welfare projects.",
      type: "Service",
      backgroundImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/experience-B24f9rAK1SziWfvaTiWzsLN7Hi05M3.jpg",
    },
  ]

  const certifications = [
    "Smart India Hackathon — Ministry of Education",
    "British Airways — Data Science Job Simulation (Forage)",
    "Deloitte — Data Analytics Job Simulation (Forage)",
    "5-Day Google Generative AI Workshop (Kaggle)",
    "SQL Fundamentals (DataCamp)",
    "Core Java (Internshala)",
    "Excel for Business (Coursera)",
    "Ideathon Certificate (Alexa Club, SRM)",
    "Python Programming",
    "Modern Public Relations",
    "Introduction to SQL and Intermediate SQL",
  ]

  return (
    <section id="experience" className="py-20 bg-card/50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-12 rounded-lg overflow-hidden">
            <div
              className="h-48 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/experience-B24f9rAK1SziWfvaTiWzsLN7Hi05M3.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-white shadow-lg">
                  <img src="/vedant-profile.jpg" alt="Vedant Agarwal" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">Experience & Certifications</h2>
                  <p className="text-gray-200">
                    Building expertise through hands-on experience and continuous learning
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-semibold mb-6">Experience</h3>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <Card key={index} className="bg-card border-border relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-10"
                      style={{ backgroundImage: `url(${exp.backgroundImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                    <CardHeader className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="border-primary/50 text-primary bg-black/30">
                          {exp.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-white">{exp.title}</CardTitle>
                      <div className="text-primary font-medium">{exp.company}</div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {exp.period}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {exp.location}
                        </div>
                      </div>
                      <p className="text-gray-200 text-pretty">{exp.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">Certifications</h3>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1"></div>
                        <span className="text-sm text-card-foreground">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
