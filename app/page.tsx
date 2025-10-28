"use client"

import { useState } from "react"
import { ChatPanel } from "@/components/chat-panel"
import { PreviewPanel } from "@/components/preview-panel"
import { Header } from "@/components/header"
import type { Message, Presentation } from "@/lib/types"

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsGenerating(true)

    try {
      console.log("[v0] Sending message to API:", content)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          currentPresentation: presentation,
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        console.error("[v0] API returned error status:", response.status)
        const errorText = await response.text()
        console.error("[v0] Error response body:", errorText)
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Received data:", data)

      if (!data.message) {
        console.error("[v0] Response missing message field:", data)
        throw new Error("Invalid response format")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (data.presentation) {
        setPresentation(data.presentation)
      }
    } catch (error) {
      console.error("[v0] Error in handleSendMessage:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!presentation) return

    try {
      const response = await fetch("/api/generate-ppt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presentation }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${presentation.title || "presentation"}.pptx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("[v0] Error downloading presentation:", error)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header onDownload={handleDownload} hasPresentation={!!presentation} />
      <div className="flex flex-1 overflow-hidden">
        <ChatPanel messages={messages} onSendMessage={handleSendMessage} isGenerating={isGenerating} />
        <PreviewPanel presentation={presentation} />
      </div>
    </div>
  )
}
