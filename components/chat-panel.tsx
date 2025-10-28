"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Sparkles } from "lucide-react" // No new import needed
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"

interface ChatPanelProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  isGenerating: boolean
}

export function ChatPanel({ messages, onSendMessage, isGenerating }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // 1. UPDATED: Added `isGenerating` to the dependency array
  // This will scroll to the bottom when the loader appears
  useEffect(() => {
    scrollToBottom()
  }, [messages, isGenerating])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isGenerating) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  return (
    <div className="flex w-full flex-col border-r border-border md:w-1/2">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Create Your Presentation</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Describe your presentation topic and I'll generate professional slides for you. You can then refine and
                edit them with follow-up prompts.
              </p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button
                variant="outline"
                className="justify-start text-left bg-transparent"
                onClick={() => setInput("Create a presentation about climate change")}
              >
                <span className="text-sm">Climate change overview</span>
              </Button>
              <Button
                variant="outline"
                className="justify-start text-left bg-transparent"
                onClick={() => setInput("Create a business pitch deck for a tech startup")}
              >
                <span className="text-sm">Tech startup pitch</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground border border-border",
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <span className="text-xs font-medium text-muted-foreground">You</span>
                  </div>
                )}
              </div>
            ))}

            {/* 2. ADDED: Simple loading indicator */}
            {isGenerating && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-3",
                    "bg-card text-card-foreground border border-border",
                  )}
                >
                  {/* Simple 3-dot pulse animation */}
                  <div className="flex items-center justify-center gap-1.5 py-1.5">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                    <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                    <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
            {/* End of added section */}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="border-t border-border bg-card p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your presentation or ask for changes..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isGenerating}
            className="h-[60px] w-[60px] shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}