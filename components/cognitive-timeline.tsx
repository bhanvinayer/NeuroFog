'use client'

import { useNeuroFog } from '@/components/neurofog-provider'
import { getStatusColor } from '@/lib/cognitive-engine'
import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export function CognitiveTimeline() {
  const { timeline, state } = useNeuroFog()

  const chartData = useMemo(() => {
    if (timeline.length === 0) {
      // Generate placeholder data
      const now = Date.now()
      return Array.from({ length: 20 }, (_, i) => ({
        time: new Date(now - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cfi: 70 + Math.sin(i * 0.5) * 15 + Math.random() * 5,
      }))
    }

    return timeline.map((entry) => ({
      time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cfi: entry.cfi,
    }))
  }, [timeline])

  const statusColor = getStatusColor(state.status)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 14V4" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2 14h14" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 10l3-3 3 2 4-5" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <h3 className="text-sm font-semibold text-foreground">Cognitive Timeline</h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-fog-clear" />
            Clear ({'>'}80)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-fog-moderate" />
            Fog (40-60)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-fog-heavy" />
            Overload ({'<'}40)
          </span>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="cfiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={statusColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={statusColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickCount={5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 25, 35, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.8)',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
              formatter={(value: number) => [`CFI: ${Math.round(value)}`, '']}
            />
            {/* Danger zone reference line */}
            <Area
              type="monotone"
              dataKey="cfi"
              stroke={statusColor}
              strokeWidth={2}
              fill="url(#cfiGradient)"
              dot={false}
              activeDot={{ r: 4, fill: statusColor, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {timeline.length > 0 && (
        <p className="text-[11px] text-muted-foreground text-center">
          {timeline.length} data points collected this session
        </p>
      )}
    </div>
  )
}
