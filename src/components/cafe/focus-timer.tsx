'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Drink, DrinkSize } from '@/lib/cafe-types'

interface FocusTimerProps {
  drink: Drink
  size: DrinkSize
  onBreak: () => void
  onEnd: () => void
  isPaused: boolean
}

export function FocusTimer({ drink, size, onBreak, onEnd, isPaused }: FocusTimerProps) {
  const totalSeconds = size.minutes * 60
  const [elapsed, setElapsed] = useState(0)
  const remaining = totalSeconds - elapsed
  const progress = elapsed / totalSeconds

  useEffect(() => {
    if (isPaused || remaining <= 0) return
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isPaused, remaining])

  useEffect(() => {
    if (remaining <= 0) {
      onEnd()
    }
  }, [remaining, onEnd])

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(Math.abs(seconds) / 60)
    const s = Math.abs(seconds) % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, [])

  // Cup fill level based on elapsed time
  const fillLevel = 1 - progress

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Timer display with drink cup visualization */}
      <div className="relative flex items-center justify-center">
        {/* Circular progress ring */}
        <svg width="180" height="180" viewBox="0 0 180 180" className="absolute" aria-hidden="true">
          <circle
            cx="90"
            cy="90"
            r="84"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border/20"
          />
          <circle
            cx="90"
            cy="90"
            r="84"
            fill="none"
            stroke={drink.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 84}`}
            strokeDashoffset={`${2 * Math.PI * 84 * (1 - progress)}`}
            className="transition-all duration-1000"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            opacity="0.7"
          />
        </svg>

        {/* Cup visualization */}
        <div className="flex flex-col items-center gap-1">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
            <rect x="15" y="12" width="30" height="36" rx="4" stroke={drink.color} strokeWidth="1.5" fill="none" opacity="0.6" />
            <rect
              x="16"
              y={12 + 35 * (1 - fillLevel)}
              width="28"
              height={35 * fillLevel}
              rx="3"
              fill={drink.color}
              opacity="0.25"
              className="transition-all duration-1000"
            />
            {fillLevel > 0.1 && (
              <path
                d={`M16 ${12 + 35 * (1 - fillLevel)} Q24 ${10 + 35 * (1 - fillLevel)} 30 ${12 + 35 * (1 - fillLevel)} Q36 ${14 + 35 * (1 - fillLevel)} 44 ${12 + 35 * (1 - fillLevel)}`}
                stroke={drink.color}
                strokeWidth="0.8"
                fill="none"
                opacity="0.3"
              />
            )}
            {/* Steam when drink is fresh */}
            {fillLevel > 0.5 && (
              <>
                <path d="M25 10c0-3 1-5 0-8" stroke={drink.color} strokeWidth="0.8" opacity="0.2" strokeLinecap="round" className="animate-fog-drift" />
                <path d="M30 9c0-3 1-5 0-8" stroke={drink.color} strokeWidth="0.8" opacity="0.2" strokeLinecap="round" className="animate-fog-drift" style={{ animationDelay: '1s' }} />
                <path d="M35 10c0-3 1-5 0-8" stroke={drink.color} strokeWidth="0.8" opacity="0.2" strokeLinecap="round" className="animate-fog-drift" style={{ animationDelay: '2s' }} />
              </>
            )}
          </svg>

          <span
            className="text-2xl font-mono font-semibold tracking-wider"
            style={{ color: drink.color }}
          >
            {formatTime(remaining)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {isPaused ? 'paused' : `${size.label} ${drink.name}`}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBreak}
          className="flex items-center gap-2 rounded-lg border border-border/30 bg-card/80 px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-card hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="3" y="2" width="3" height="10" rx="1" fill="currentColor" opacity="0.8" />
            <rect x="8" y="2" width="3" height="10" rx="1" fill="currentColor" opacity="0.8" />
          </svg>
          {isPaused ? 'Resume' : 'Take a Break'}
        </button>
        <button
          onClick={onEnd}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-muted-foreground/60 transition-colors hover:text-destructive"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="10" height="10" rx="2" fill="currentColor" opacity="0.8" />
          </svg>
          End Session
        </button>
      </div>

      {/* Progress text */}
      <p className="text-[10px] text-muted-foreground/40">
        {Math.round(progress * 100)}% complete
      </p>
    </div>
  )
}
