'use client'

import { useNeuroFog } from '@/components/neurofog-provider'
import { getStatusColor } from '@/lib/cognitive-engine'

export function CognitiveCompass() {
  const { state } = useNeuroFog()
  const { signals } = state

  const metrics = [
    {
      label: 'Typing Rhythm',
      value: Math.min(100, signals.typingVariability * 200),
      description: 'Keystroke consistency',
    },
    {
      label: 'Mouse Stability',
      value: Math.min(100, signals.mouseVariability * 100),
      description: 'Movement erraticism',
    },
    {
      label: 'Tab Switches',
      value: Math.min(100, signals.tabSwitches * 10),
      description: 'Context switching frequency',
    },
    {
      label: 'Micro Pauses',
      value: Math.min(100, signals.microPauses * 12.5),
      description: 'Hesitation frequency',
    },
    {
      label: 'Scroll Pattern',
      value: Math.min(100, signals.scrollSpeed / 5),
      description: 'Reading engagement',
    },
    {
      label: 'Idle Time',
      value: Math.min(100, (signals.idleTime / 60) * 100),
      description: 'Inactivity level',
    },
  ]

  const statusColor = getStatusColor(state.status)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="7" stroke={statusColor} strokeWidth="1.5" fill="none" />
          <circle cx="9" cy="9" r="2" fill={statusColor} />
          <line x1="9" y1="2" x2="9" y2="5" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="9" y1="13" x2="9" y2="16" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="9" x2="5" y2="9" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="13" y1="9" x2="16" y2="9" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <h3 className="text-sm font-semibold text-foreground">Cognitive Load Compass</h3>
      </div>

      <div className="flex flex-col gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground/80">{metric.label}</span>
              <span className="text-xs font-mono text-muted-foreground">{Math.round(metric.value)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${metric.value}%`,
                  backgroundColor: metric.value > 70
                    ? 'var(--fog-heavy)'
                    : metric.value > 40
                      ? 'var(--fog-moderate)'
                      : 'var(--fog-clear)',
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{metric.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
