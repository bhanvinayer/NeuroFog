'use client'

import type { Drink, DrinkSize } from '@/lib/cafe-types'

interface SessionSummaryProps {
  drink: Drink
  size: DrinkSize
  completedTasks: number
  totalTasks: number
  elapsedMinutes: number
  onNewSession: () => void
  onBackToDashboard: () => void
}

export function SessionSummary({
  drink,
  size,
  completedTasks,
  totalTasks,
  elapsedMinutes,
  onNewSession,
  onBackToDashboard,
}: SessionSummaryProps) {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8 animate-in fade-in duration-500">
      {/* Completion illustration */}
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <circle cx="60" cy="60" r="56" stroke={drink.color} strokeWidth="2" opacity="0.2" />
          <circle
            cx="60"
            cy="60"
            r="56"
            stroke={drink.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset="0"
            opacity="0.6"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
          <path d="M42 60l10 10 26-26" stroke={drink.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-semibold text-foreground">Session Complete</h2>
        <p className="text-sm text-muted-foreground">
          {elapsedMinutes >= size.minutes
            ? `You finished your ${drink.name} session!`
            : `You ended your session after ${elapsedMinutes} minutes.`
          }
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-semibold font-mono" style={{ color: drink.color }}>
            {elapsedMinutes}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Minutes</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-semibold font-mono" style={{ color: drink.color }}>
            {completedTasks}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Tasks Done</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-semibold font-mono" style={{ color: drink.color }}>
            {completionRate}%
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Completion</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNewSession}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
        >
          Order Another
        </button>
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 rounded-xl border border-border/30 px-6 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
