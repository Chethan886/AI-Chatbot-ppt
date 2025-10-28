import { LucidePresentation as FilePresentation } from "lucide-react"
import type { Presentation } from "@/lib/types"

interface PreviewPanelProps {
  presentation: Presentation | null
}

export function PreviewPanel({ presentation }: PreviewPanelProps) {
  if (!presentation) {
    return (
      <div className="hidden w-1/2 flex-col items-center justify-center bg-secondary/30 md:flex">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
          <FilePresentation className="h-12 w-12 text-secondary-foreground" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Your presentation preview will appear here</p>
      </div>
    )
  }

  return (
    <div className="hidden w-1/2 flex-col overflow-y-auto bg-secondary/30 p-6 md:flex">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground">{presentation.title}</h2>
        <p className="text-sm text-muted-foreground">
          {presentation.slides.length} {presentation.slides.length === 1 ? "slide" : "slides"}
        </p>
      </div>
      <div className="space-y-4">
        {presentation.slides.map((slide, index) => (
          <div key={index} className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
                {index + 1}
              </span>
              <h3 className="font-semibold text-card-foreground">{slide.title}</h3>
            </div>
            <div className="space-y-2">
              {slide.content.map((item, itemIndex) => (
                <p key={itemIndex} className="text-sm text-muted-foreground leading-relaxed">
                  • {item}
                </p>
              ))}
            </div>
            {slide.notes && (
              <div className="mt-4 rounded bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground italic">{slide.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
