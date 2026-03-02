'use client'

import { useState, useEffect } from 'react'
import { useNeuroFog } from '@/components/neurofog-provider'

const SAMPLE_TEXTS = [
  "The gentle hum of the computer filled the quiet room as the developer reviewed their latest code changes. Each line of logic represented hours of careful thought, debugging, and iterative refinement.",
  "Cognitive load theory suggests that our working memory has a limited capacity. When we exceed this capacity, our ability to process new information decreases significantly.",
  "Mindfulness is the practice of paying attention to the present moment without judgment. It can help reduce stress, improve focus, and enhance overall well-being in daily life.",
  "The best way to maintain peak performance is through regular breaks. Research shows that taking short pauses every 25-30 minutes can dramatically improve sustained concentration.",
]

export function TypingArea() {
  const { isTracking } = useNeuroFog()
  const [text, setText] = useState('')
  const [sampleIndex, setSampleIndex] = useState(0) // Start with first sample to prevent hydration mismatch
  const sample = SAMPLE_TEXTS[sampleIndex]

  // Set random sample after component mounts to prevent hydration mismatch
  useEffect(() => {
    setSampleIndex(Math.floor(Math.random() * SAMPLE_TEXTS.length))
  }, [])

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const charCount = text.length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <rect x="1" y="6" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
            <rect x="4" y="9" width="2" height="1.5" rx="0.25" fill="currentColor" className="text-primary/50" />
            <rect x="8" y="9" width="2" height="1.5" rx="0.25" fill="currentColor" className="text-primary/50" />
            <rect x="12" y="9" width="2" height="1.5" rx="0.25" fill="currentColor" className="text-primary/50" />
            <rect x="6" y="12" width="6" height="1.5" rx="0.25" fill="currentColor" className="text-primary/50" />
          </svg>
          <h3 className="text-sm font-semibold text-foreground">Typing Zone</h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {/* Reference text */}
      <div className="rounded-lg border border-border/30 bg-secondary/20 p-3">
        <p className="text-xs text-muted-foreground/60 leading-relaxed italic">
          {sample}
        </p>
      </div>

      {/* Input area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isTracking ? "Start typing here — your keystrokes are being monitored for cognitive patterns..." : "Start tracking first, then type here to generate cognitive data..."}
        className="min-h-28 rounded-xl border border-border/50 bg-card p-4 text-sm text-foreground leading-relaxed resize-none placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
        aria-label="Typing area for cognitive monitoring"
      />

      {!isTracking && (
        <p className="text-[11px] text-muted-foreground/50 text-center">
          Press &ldquo;Start Tracking&rdquo; above to begin monitoring your cognitive patterns.
        </p>
      )}
    </div>
  )
}
