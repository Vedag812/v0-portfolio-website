"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

interface ProjectModalProps {
  project: {
    title?: string;
    name?: string;
    description: string | null;
    technologies?: string[];
    tags?: string[];
    topics?: string[];
    link?: string;
    url?: string;
    github?: string;
    demo?: string;
    demoLink?: string;
    category?: string;
    backgroundImage?: string;
    image?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const title = project.title || project.name || "Project";
  const tech = project.technologies || project.topics || project.tags || [];
  const repoLink = project.github || project.link || project.url;
  const demoLink = project.demo || project.demoLink;
  const bgImage = project.image || project.backgroundImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-netflix-black border border-netflix-red/30 rounded-lg shadow-2xl">
        {/* Header with Background */}
        <div
          className="relative h-64 bg-cover bg-center"
          style={{
            backgroundImage: bgImage
              ? `url(${bgImage})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-netflix-red transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-4xl font-bold text-white mb-2">{title}</h2>
            {project.category && (
              <Badge className="bg-netflix-red text-white">{project.category}</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">About this project</h3>
            <p className="text-gray-300 leading-relaxed">
              {project.description || "No description available."}
            </p>
          </div>

          {/* Tech Stack */}
          {tech.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {tech.map((t, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="border-netflix-red/50 text-gray-300 bg-netflix-dark-gray/50"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Demo Preview */}
          {demoLink && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Live Demo</h3>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-netflix-red/30">
                <iframe
                  src={demoLink}
                  className="w-full h-full"
                  title="Project Demo"
                  loading="lazy"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {repoLink && (
              <Button
                asChild
                className="bg-netflix-red hover:bg-netflix-red/80"
              >
                <a href={repoLink} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View Repository
                </a>
              </Button>
            )}
            {demoLink && (
              <Button
                asChild
                variant="outline"
                className="border-netflix-red/50 hover:bg-netflix-red/10"
              >
                <a href={demoLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
