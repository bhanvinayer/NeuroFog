'use client'

import Link from 'next/link'
import { useNeuroFog } from '@/components/neurofog-provider'

export function TrackingControls() {
  const {
    isTracking,
    startTracking,
    stopTracking,
    isPatchActive,
    activatePatch,
    resetSession,
    state,
  } = useNeuroFog()

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Start/Stop tracking */}
      <button
        onClick={isTracking ? stopTracking : startTracking}
        className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          isTracking
            ? 'bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {isTracking && (
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        )}
        {isTracking ? 'Tracking Active' : 'Start Tracking'}
      </button>

      {/* Manual NeuroPatch trigger - only available when CFI is high enough */}
      {isTracking && !isPatchActive && state.cfi >= 50 && (
        <button
          onClick={activatePatch}
          className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="1" y="4" width="12" height="6" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 6v2M7 5v4M9 6v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Activate NeuroPatch (CFI: {Math.round(state.cfi)})
        </button>
      )}

      {/* Reset session */}
      <button
        onClick={resetSession}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1 6a5 5 0 019.5-1.5M11 6a5 5 0 01-9.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M10.5 1v3.5h-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 11V7.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Reset
      </button>

      {/* Deep Focus link */}
      <Link
        href="/deep-focus"
        className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/10 hover:border-primary/40"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 5h8v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <path d="M11 7h1.5a1.5 1.5 0 010 3H11" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <path d="M5 3c0-1 1-2 2-2s2 1 2 2" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        </svg>
        Deep Focus
      </Link>

      {/* Privacy indicator */}
      <span className="ml-auto flex items-center gap-1.5 text-[10px] text-white bg-blue-900 border border-blue-800 px-3 py-2 rounded-lg">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <rect x="2" y="4.5" width="6" height="4.5" rx="1" stroke="currentColor" strokeWidth="0.8" />
          <path d="M3 4.5V3a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
        All data stays local
      </span>
    </div>
  )
}
