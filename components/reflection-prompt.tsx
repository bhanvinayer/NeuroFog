'use client'

import { useNeuroFog } from '@/components/neurofog-provider'
import { useState } from 'react'

const REFLECTION_PROMPTS = [
  "How focused do you feel right now?",
  "Rate your current mental clarity.",
  "How well can you concentrate?",
  "How energized is your mind?",
  "Are your thoughts clear or scattered?",
]

const WORD_PROMPTS = [
  "Type 3 words describing your current focus:",
  "Describe your mental state in 3 words:",
  "How does your mind feel? (3 words)",
]

export function ReflectionPrompt() {
  const { setSentiment, sentimentScore } = useNeuroFog()
  const [currentPrompt] = useState(() =>
    REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]
  )
  const [wordPrompt] = useState(() =>
    WORD_PROMPTS[Math.floor(Math.random() * WORD_PROMPTS.length)]
  )
  const [words, setWords] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Simple sentiment analysis from words
  const analyzeWords = (text: string): number => {
    const positiveWords = ['focused', 'clear', 'sharp', 'alert', 'good', 'great', 'energized', 'calm', 'productive', 'flow', 'engaged', 'ready', 'strong', 'fine']
    const negativeWords = ['tired', 'foggy', 'scattered', 'confused', 'exhausted', 'drained', 'slow', 'lost', 'distracted', 'overwhelmed', 'stressed', 'bad', 'unfocused', 'heavy']

    const tokens = text.toLowerCase().split(/\s+/)
    let score = 0.5

    tokens.forEach((token) => {
      if (positiveWords.includes(token)) score += 0.15
      if (negativeWords.includes(token)) score -= 0.15
    })

    return Math.max(0.1, Math.min(1, score))
  }

  const handleSliderChange = (value: number) => {
    setSentiment(value / 100)
  }

  const handleSubmitWords = () => {
    if (!words.trim()) return
    const score = analyzeWords(words)
    setSentiment(score)
    setSubmitted(true)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-primary" />
          <path d="M6 9.5C6 9.5 7 11 9 11s3-1.5 3-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary" />
          <circle cx="6.5" cy="7" r="0.75" fill="currentColor" className="text-primary" />
          <circle cx="11.5" cy="7" r="0.75" fill="currentColor" className="text-primary" />
        </svg>
        <h3 className="text-sm font-semibold text-foreground">Reflection Check-in</h3>
      </div>

      {/* Slider prompt */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-muted-foreground">{currentPrompt}</label>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">Low</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(sentimentScore * 100)}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none bg-secondary cursor-pointer accent-primary"
            aria-label="Focus level slider"
          />
          <span className="text-[10px] text-muted-foreground">High</span>
        </div>
        <div className="text-center">
          <span className="text-xs font-mono text-primary">{Math.round(sentimentScore * 100)}%</span>
        </div>
      </div>

      {/* Word prompt */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-muted-foreground">{wordPrompt}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={words}
            onChange={(e) => { setWords(e.target.value); setSubmitted(false) }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitWords() }}
            placeholder="e.g. focused calm sharp"
            className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Describe your focus in 3 words"
          />
          <button
            onClick={handleSubmitWords}
            disabled={!words.trim()}
            className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
        {submitted && (
          <p className="text-[11px] text-accent animate-in fade-in">
            Sentiment analyzed. Score updated.
          </p>
        )}
      </div>
    </div>
  )
}
