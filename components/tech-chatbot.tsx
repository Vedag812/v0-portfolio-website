"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Send, MessageCircle, X } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function TechChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your Tech Explorer AI Assistant. Ask me anything about the latest tech blogs, AI trends, machine learning, web development, or data science. What interests you?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("[v0] TechChatbot component mounted and visible")
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const techTopics = {
    "generative ai":
      "Generative AI is revolutionizing how we create content. Latest trends include multimodal models, RAG systems, and real-time applications. Check out articles on DeepLearning.AI and Anthropic Research.",
    "machine learning":
      "Machine Learning is evolving with better optimization techniques like quantization and pruning. TensorFlow and PyTorch are leading the way. Focus on model efficiency and scalability.",
    "data science":
      "Data Science in 2025 emphasizes best practices: proper data collection, feature engineering, model validation, and production deployment. Kaggle has excellent resources for learning.",
    "web development":
      "Next.js 15 brings Server Components and Edge Functions for scalable web apps. Python performance optimization is crucial for backend systems. Real Python has great tutorials.",
    "ai trends":
      "Current AI trends include RAG systems, multimodal models, edge AI, and responsible AI. The field is moving towards more efficient and interpretable models.",
    python:
      "Python remains the go-to language for AI and data science. Performance optimization through profiling, caching, and async programming is essential.",
    "deep learning":
      "Deep Learning frameworks like TensorFlow and PyTorch are essential. Focus on CNN for image tasks, RNNs for sequences, and Transformers for NLP.",
    nlp: "Natural Language Processing is advancing with large language models and RAG systems. Hugging Face provides excellent pre-trained models and tools.",
  }

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    for (const [topic, response] of Object.entries(techTopics)) {
      if (lowerMessage.includes(topic)) {
        return response
      }
    }

    if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest")) {
      return "I recommend exploring articles on: 1) Generative AI and LLMs, 2) Machine Learning Optimization, 3) Data Science Best Practices, 4) Web Development with Next.js, and 5) Python Performance. Which interests you most?"
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("what can")) {
      return "I can help you with: AI & LLMs, Machine Learning, Data Science, Web Development, Python, Deep Learning, NLP, and more. Ask me about any tech topic or request recommendations!"
    }

    return "That's an interesting question! I specialize in tech topics like AI, Machine Learning, Data Science, and Web Development. Feel free to ask me about any of these areas or request blog recommendations."
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(input),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 500)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-netflix-red hover:bg-netflix-red/90 text-white rounded-full p-4 shadow-2xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Open tech chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-96 max-h-96 bg-gray-900 border-netflix-red/30 shadow-2xl flex flex-col rounded-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-netflix-red to-red-700 p-4 rounded-t-lg">
            <h3 className="text-white font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Tech Explorer AI
            </h3>
            <p className="text-red-100 text-sm">Ask about tech blogs & trends</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-netflix-red text-white rounded-br-none"
                      : "bg-gray-800 text-gray-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-700 p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about tech..."
              className="flex-1 bg-gray-800 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-netflix-red"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-netflix-red hover:bg-netflix-red/90 text-white p-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </>
  )
}
