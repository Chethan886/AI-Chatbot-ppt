export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface Slide {
  title: string
  content: string[]
  notes?: string
}

export interface Presentation {
  title: string
  slides: Slide[]
}
