'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DrinkSelector } from '@/components/cafe/drink-selector'
import { FocusTimer } from '@/components/cafe/focus-timer'
import { StickyNotes } from '@/components/cafe/sticky-notes'
import { BackgroundPicker } from '@/components/cafe/background-picker'
import { SessionSummary } from '@/components/cafe/session-summary'
import { BACKGROUNDS, type Drink, type DrinkSize, type CafeBackground } from '@/lib/cafe-types'

type SessionState = 'selecting' | 'focusing' | 'break' | 'ended'

export default function DeepFocusPage() {
  const router = useRouter()
  const [sessionState, setSessionState] = useState<SessionState>('selecting')
  const [drink, setDrink] = useState<Drink | null>(null)
  const [size, setSize] = useState<DrinkSize | null>(null)
  const [background, setBackground] = useState<CafeBackground>(BACKGROUNDS[0])
  const [isPaused, setIsPaused] = useState(false)
  const [sessionStart, setSessionStart] = useState<number | null>(null)

  const handleDrinkSelect = (d: Drink, s: DrinkSize) => {
    setDrink(d)
    setSize(s)
    setSessionState('focusing')
    setSessionStart(Date.now())
    setIsPaused(false)
  }

  const handleBreak = () => {
    setIsPaused(prev => !prev)
  }

  const handleEnd = useCallback(() => {
    setSessionState('ended')
    setIsPaused(true)
  }, [])

  const handleNewSession = () => {
    setSessionState('selecting')
    setDrink(null)
    setSize(null)
    setSessionStart(null)
    setIsPaused(false)
  }

  const elapsedMinutes = sessionStart
    ? Math.floor((Date.now() - sessionStart) / 60000)
    : 0

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image layer */}
      <div className="fixed inset-0 z-0">
        <img
          src={background.image}
          alt=""
          className="h-full w-full object-cover transition-all duration-1000"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-background/75 backdrop-blur-sm" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 min-h-screen">
        {/* Top nav bar */}
        <nav className="flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm">Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-primary">
              <path d="M5 7h10v8a3 3 0 01-3 3H8a3 3 0 01-3-3V7z" stroke="currentColor" strokeWidth="1.3" fill="none" />
              <path d="M15 10h2a2 2 0 010 4h-2" stroke="currentColor" strokeWidth="1.3" fill="none" />
              <path d="M7 5c0-1.5 1.5-3 3-3s3 1.5 3 3" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <path d="M8 4c.5-1 .5-2 0-3" stroke="currentColor" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
              <path d="M12 4c.5-1 .5-2 0-3" stroke="currentColor" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-medium text-foreground">Deep Focus</span>
          </div>

          {/* Background status */}
          {sessionState === 'focusing' && (
            <div className="flex items-center gap-2">
              {isPaused && (
                <span className="rounded-full border border-chart-4/30 bg-chart-4/10 px-3 py-1 text-[10px] font-medium text-chart-4">
                  On Break
                </span>
              )}
              <span className="text-[10px] text-muted-foreground/40">
                {background.name}
              </span>
            </div>
          )}
          {sessionState !== 'focusing' && <div />}
        </nav>

        {/* Selecting state */}
        {sessionState === 'selecting' && (
          <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
            <DrinkSelector onSelect={handleDrinkSelect} />
          </div>
        )}

        {/* Focusing state */}
        {(sessionState === 'focusing' || sessionState === 'break') && drink && size && (
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left: Timer + Background picker */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-md p-6">
                  <FocusTimer
                    drink={drink}
                    size={size}
                    onBreak={handleBreak}
                    onEnd={handleEnd}
                    isPaused={isPaused}
                  />
                </div>

                <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-md p-4">
                  <BackgroundPicker current={background} onChange={setBackground} />
                </div>
              </div>

              {/* Center: Sticky notes workspace */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-md p-6 min-h-[500px]">
                  <StickyNotes />
                </div>
              </div>

              {/* Right: Context panel */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                {/* Session info card */}
                <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-md p-5">
                  <h3 className="text-sm font-medium text-foreground mb-3">Your Order</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Drink</span>
                      <span className="text-xs text-foreground">{drink.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Size</span>
                      <span className="text-xs text-foreground">{size.label} ({size.ml})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Session</span>
                      <span className="text-xs text-foreground">{size.minutes} min</span>
                    </div>
                  </div>
                </div>

                {/* Motivational */}
                <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-md p-5">
                  <CafeWisdom />
                </div>

                {/* Quick actions */}
                <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-md p-5">
                  <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleBreak}
                      className="w-full flex items-center gap-2 rounded-lg border border-border/20 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                        <path d="M6 3v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                      {isPaused ? 'Resume Focus' : 'Pause for a Moment'}
                    </button>
                    <Link
                      href="/"
                      className="w-full flex items-center gap-2 rounded-lg border border-border/20 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6h8M6 2v8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                      </svg>
                      Check Fog Index
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session ended */}
        {sessionState === 'ended' && drink && size && (
          <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
            <SessionSummary
              drink={drink}
              size={size}
              completedTasks={0}
              totalTasks={0}
              elapsedMinutes={elapsedMinutes}
              onNewSession={handleNewSession}
              onBackToDashboard={() => router.push('/')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function CafeWisdom() {
  const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "One sip at a time. One task at a time.", author: "Deep Focus" },
    { text: "Rest is not idleness. It is the fuel of creativity.", author: "Deep Focus" },
    { text: "Your mind is a garden. Tend to it gently.", author: "Deep Focus" },
  ]

  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs italic text-muted-foreground leading-relaxed">
        {`"${quote.text}"`}
      </p>
      <p className="text-[10px] text-muted-foreground/50">{'-- '}{quote.author}</p>
    </div>
  )
}
