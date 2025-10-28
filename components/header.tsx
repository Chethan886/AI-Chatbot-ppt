"use client"

import { Button } from "@/components/ui/button"
import { Download, Presentation } from "lucide-react"

interface HeaderProps {
  onDownload: () => void
  hasPresentation: boolean
}

export function Header({ onDownload, hasPresentation }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Presentation className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI Slide Generator</h1>
            <p className="text-xs text-muted-foreground">Create presentations with AI</p>
          </div>
        </div>
        <Button onClick={onDownload} disabled={!hasPresentation} className="gap-2">
          <Download className="h-4 w-4" />
          Download PPTX
        </Button>
      </div>
    </header>
  )
}
