'use client'

import { useEffect, useState } from 'react'
import { useNeuroFog } from '@/components/neurofog-provider'
import { getStatusColor } from '@/lib/cognitive-engine'

export function DashboardHeader() {
  const { state, isTracking } = useNeuroFog()
  const statusColor = getStatusColor(state.status)

  return (
    <header className="flex items-center justify-between border-b border-border/50 pb-6">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="relative flex items-center justify-center h-10 w-10">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            {/* Brain outline */}
            <path
              d="M20 6c-4 0-7 2-8.5 4.5C9 11 7 13 7 16c0 2 1 3.5 2 4.5-.5 1.5-1 3.5 0 5.5 1 2 3 3 5 3h1c1.5 2 4 3 5 3s3.5-1 5-3h1c2 0 4-1 5-3 1-2 .5-4 0-5.5 1-1 2-2.5 2-4.5 0-3-2-5-4.5-5.5C27 8 24 6 20 6z"
              stroke={statusColor}
              strokeWidth="1.5"
              fill="none"
              opacity="0.8"
            />
            {/* Center neural node */}
            <circle cx="20" cy="18" r="3" fill={statusColor} opacity="0.6" />
            {/* Neural connections */}
            <line x1="20" y1="15" x2="20" y2="10" stroke={statusColor} strokeWidth="1" opacity="0.4" />
            <line x1="17" y1="18" x2="12" y2="16" stroke={statusColor} strokeWidth="1" opacity="0.4" />
            <line x1="23" y1="18" x2="28" y2="16" stroke={statusColor} strokeWidth="1" opacity="0.4" />
            <line x1="20" y1="21" x2="18" y2="26" stroke={statusColor} strokeWidth="1" opacity="0.4" />
            <line x1="20" y1="21" x2="22" y2="26" stroke={statusColor} strokeWidth="1" opacity="0.4" />
            {/* Pulse effect when tracking */}
            {isTracking && (
              <circle
                cx="20"
                cy="18"
                r="6"
                fill="none"
                stroke={statusColor}
                strokeWidth="0.5"
                opacity="0.3"
                className="animate-pulse-ring"
              />
            )}
          </svg>
        </div>

        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">NeuroFog</h1>
          <p className="text-[11px] text-muted-foreground tracking-wide">Detect. Prevent. Recover.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Session time */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Session</span>
          <SessionTimer isActive={isTracking} />
        </div>

        {/* Status badge */}
        <div
          className="flex items-center gap-2 rounded-full border px-3 py-1.5"
          style={{
            borderColor: `color-mix(in oklch, ${statusColor} 30%, transparent)`,
            backgroundColor: `color-mix(in oklch, ${statusColor} 8%, transparent)`,
          }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: statusColor }}
            aria-hidden="true"
          />
          <span className="text-xs font-medium" style={{ color: statusColor }}>
            CFI: {state.cfi}
          </span>
        </div>
      </div>
    </header>
  )
}

function SessionTimer({ isActive }: { isActive: boolean }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const start = Date.now()
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive])

  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60

  return (
    <span className="text-xs font-mono text-muted-foreground">
      {isActive ? `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` : '--:--'}
    </span>
  )
}
