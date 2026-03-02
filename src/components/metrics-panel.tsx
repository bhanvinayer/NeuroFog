'use client'

import { useNeuroFog } from '@/components/neurofog-provider'
import { getStatusColor } from '@/lib/cognitive-engine'

export function MetricsPanel() {
  const { state, recoveryScore } = useNeuroFog()
  const statusColor = getStatusColor(state.status)

  const metrics = [
    {
      label: 'Cognitive Load',
      value: `${Math.round(state.normalizedLoad * 100)}%`,
      subtext: 'Mental strain level',
      color: state.normalizedLoad > 0.6 ? 'var(--fog-heavy)' : state.normalizedLoad > 0.3 ? 'var(--fog-moderate)' : 'var(--fog-clear)',
    },
    {
      label: 'Attention',
      value: `${Math.round(state.attentionStability * 100)}%`,
      subtext: 'Focus stability',
      color: state.attentionStability < 0.4 ? 'var(--fog-heavy)' : state.attentionStability < 0.7 ? 'var(--fog-moderate)' : 'var(--fog-clear)',
    },
    {
      label: 'Sentiment',
      value: `${Math.round(state.sentimentScore * 100)}%`,
      subtext: 'Self-reported clarity',
      color: 'var(--fog-clear)',
    },
    {
      label: 'Recovery',
      value: recoveryScore !== null ? `${recoveryScore}%` : '—',
      subtext: recoveryScore !== null ? 'Post-patch recovery' : 'No patch used yet',
      color: recoveryScore !== null && recoveryScore > 60 ? 'var(--fog-clear)' : 'var(--fog-moderate)',
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <rect x="2" y="8" width="3" height="8" rx="1" fill={statusColor} opacity="0.6" />
          <rect x="7.5" y="5" width="3" height="11" rx="1" fill={statusColor} opacity="0.8" />
          <rect x="13" y="2" width="3" height="14" rx="1" fill={statusColor} />
        </svg>
        <h3 className="text-sm font-semibold text-foreground">Metrics Overview</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col gap-1 rounded-xl border border-border/50 bg-secondary/30 p-3"
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {metric.label}
            </span>
            <span
              className="text-2xl font-semibold font-mono"
              style={{ color: metric.color }}
            >
              {metric.value}
            </span>
            <span className="text-[10px] text-muted-foreground/70">{metric.subtext}</span>
          </div>
        ))}
      </div>

      {/* CFI Formula display */}
      <div className="rounded-xl border border-border/30 bg-secondary/20 p-3">
        <p className="text-[10px] font-mono text-muted-foreground/60 text-center">
          {'CFI = (1 - load) × attention × sentiment × 100'}
        </p>
        <p className="text-[10px] font-mono text-muted-foreground/40 text-center mt-1">
          {'= (1 - '}{state.normalizedLoad.toFixed(2)}{') × '}{state.attentionStability.toFixed(2)}{' × '}{state.sentimentScore.toFixed(2)}{' × 100 = '}{state.cfi}
        </p>
      </div>
    </div>
  )
}
