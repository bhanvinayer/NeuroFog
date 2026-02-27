'use client'

import { useNeuroFog } from '@/components/neurofog-provider'
import { useEffect, useState } from 'react'

export function NeuroPatch() {
  const { isPatchActive, deactivatePatch, state } = useNeuroFog()
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [breathCount, setBreathCount] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [showTip, setShowTip] = useState(false)

  const tips = [
    "Your brain is tired — pause before your next task.",
    "Try looking away from the screen for 20 seconds.",
    "Take 3 deep breaths before continuing.",
    "Close your eyes and count to 10 slowly.",
    "Stand up and stretch for a moment.",
    "Consider getting a glass of water.",
  ]

  const [currentTip] = useState(() => tips[Math.floor(Math.random() * tips.length)])

  useEffect(() => {
    if (!isPatchActive) return

    setSecondsLeft(60)
    setBreathCount(0)
    setShowTip(false)

    // Breathing cycle: 4s inhale, 4s hold, 4s exhale
    const breathInterval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'inhale') return 'hold'
        if (prev === 'hold') return 'exhale'
        setBreathCount((c) => c + 1)
        return 'inhale'
      })
    }, 4000)

    // Countdown
    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          deactivatePatch()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Show tip after 5 seconds
    const tipTimeout = setTimeout(() => setShowTip(true), 5000)

    return () => {
      clearInterval(breathInterval)
      clearInterval(countdownInterval)
      clearTimeout(tipTimeout)
    }
  }, [isPatchActive, deactivatePatch])

  if (!isPatchActive) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="NeuroPatch - Cognitive Recovery Mode"
    >
      {/* Dimmed overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" />

      {/* Ambient fog particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-fog-drift"
            style={{
              width: `${100 + i * 40}px`,
              height: `${100 + i * 40}px`,
              background: 'radial-gradient(circle, rgba(100, 200, 220, 0.06) 0%, transparent 70%)',
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${6 + i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Breathing circle */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulse rings */}
          <div
            className="absolute rounded-full animate-pulse-ring"
            style={{
              width: '220px',
              height: '220px',
              border: '1px solid rgba(100, 200, 220, 0.2)',
            }}
          />
          <div
            className="absolute rounded-full animate-pulse-ring"
            style={{
              width: '260px',
              height: '260px',
              border: '1px solid rgba(100, 200, 220, 0.1)',
              animationDelay: '0.5s',
            }}
          />

          {/* Main breathing circle */}
          <div
            className="flex items-center justify-center rounded-full transition-all duration-[4000ms] ease-in-out"
            style={{
              width: breathPhase === 'inhale' ? '180px' : breathPhase === 'hold' ? '180px' : '140px',
              height: breathPhase === 'inhale' ? '180px' : breathPhase === 'hold' ? '180px' : '140px',
              background: `radial-gradient(circle, rgba(100, 200, 220, ${breathPhase === 'hold' ? '0.2' : '0.12'}) 0%, transparent 70%)`,
              border: `2px solid rgba(100, 200, 220, ${breathPhase === 'hold' ? '0.4' : '0.2'})`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-semibold text-primary/90">
                {breathPhase === 'inhale' ? 'Breathe In' : breathPhase === 'hold' ? 'Hold' : 'Breathe Out'}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {breathCount} / 5 breaths
              </span>
            </div>
          </div>
        </div>

        {/* Status info */}
        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <h2 className="text-xl font-semibold text-foreground">
            NeuroPatch Active
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {'Cognitive overload detected (CFI: '}{state.cfi}{'). Taking a 60-second micro-recovery break.'}
          </p>

          {/* Tip */}
          <div
            className={`mt-2 rounded-xl border border-border/50 bg-card/50 px-5 py-3 transition-all duration-1000 ${showTip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            <p className="text-sm text-foreground/80 italic">
              {currentTip}
            </p>
          </div>
        </div>

        {/* Timer and dismiss */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-40 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${((60 - secondsLeft) / 60) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground">{secondsLeft}s</span>
          </div>

          <button
            onClick={deactivatePatch}
            className="mt-2 rounded-lg border border-border/50 bg-secondary/50 px-5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            I feel better — dismiss
          </button>
        </div>

        {/* Why this triggered */}
        <details className="max-w-sm text-center">
          <summary className="text-[11px] text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors">
            Why was this triggered?
          </summary>
          <p className="mt-2 text-[11px] text-muted-foreground/60 leading-relaxed">
            {'Detected signals: typing variability ('}{formatVal(state.signals.typingVariability)}
            {'), tab switches ('}{state.signals.tabSwitches}
            {'/min), mouse erraticism ('}{formatVal(state.signals.mouseVariability)}
            {'). Your Cognitive Fog Index dropped below the safety threshold of 40.'}
          </p>
        </details>
      </div>
    </div>
  )
}

function formatVal(val: number): string {
  return val.toFixed(2)
}
