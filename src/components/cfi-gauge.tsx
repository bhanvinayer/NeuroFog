'use client'

import { useNeuroFog } from '@/components/neurofog-provider'
import { getStatusLabel, getStatusColor } from '@/lib/cognitive-engine'
import { useEffect, useRef } from 'react'

export function CFIGauge() {
  const { state } = useNeuroFog()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animatedCfiRef = useRef(state.cfi)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 280
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    let rafId: number

    function draw() {
      if (!ctx) return

      // Smooth animation
      animatedCfiRef.current += (state.cfi - animatedCfiRef.current) * 0.08

      const centerX = size / 2
      const centerY = size / 2 + 10
      const radius = 110

      ctx.clearRect(0, 0, size, size)

      // Background arc
      const startAngle = Math.PI * 0.75
      const endAngle = Math.PI * 2.25
      const totalAngle = endAngle - startAngle

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
      ctx.lineWidth = 16
      ctx.lineCap = 'round'
      ctx.stroke()

      // Tick marks
      for (let i = 0; i <= 10; i++) {
        const angle = startAngle + (totalAngle * i) / 10
        const innerR = radius - 26
        const outerR = radius - 18
        const x1 = centerX + Math.cos(angle) * innerR
        const y1 = centerY + Math.sin(angle) * innerR
        const x2 = centerX + Math.cos(angle) * outerR
        const y2 = centerY + Math.sin(angle) * outerR

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Active arc
      const progress = animatedCfiRef.current / 100
      const activeEnd = startAngle + totalAngle * progress
      const statusColor = getStatusColor(state.status)

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, activeEnd)
      ctx.strokeStyle = statusColor
      ctx.lineWidth = 16
      ctx.lineCap = 'round'
      ctx.stroke()

      // Glow effect
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, activeEnd)
      ctx.strokeStyle = statusColor
      ctx.lineWidth = 16
      ctx.lineCap = 'round'
      ctx.shadowColor = statusColor
      ctx.shadowBlur = 20
      ctx.stroke()
      ctx.shadowBlur = 0

      // Center text - CFI value
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.font = '600 52px Inter, sans-serif'
      ctx.fillStyle = statusColor
      ctx.fillText(Math.round(animatedCfiRef.current).toString(), centerX, centerY - 8)

      ctx.font = '500 13px Inter, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.fillText('COGNITIVE FOG INDEX', centerX, centerY + 28)

      // Status indicator dot at end of arc
      const dotX = centerX + Math.cos(activeEnd) * radius
      const dotY = centerY + Math.sin(activeEnd) * radius
      ctx.beginPath()
      ctx.arc(dotX, dotY, 6, 0, Math.PI * 2)
      ctx.fillStyle = statusColor
      ctx.fill()
      ctx.beginPath()
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()

      rafId = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(rafId)
  }, [state.cfi, state.status])

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        className="drop-shadow-lg"
        aria-label={`Cognitive Fog Index: ${state.cfi} out of 100, status: ${getStatusLabel(state.status)}`}
        role="img"
      />
      <div className="flex items-center gap-2">
        <WeatherIcon status={state.status} />
        <span
          className="text-sm font-medium"
          style={{ color: getStatusColor(state.status) }}
        >
          {getStatusLabel(state.status)}
        </span>
        <TrendArrow trend={state.trend} />
      </div>
    </div>
  )
}

function WeatherIcon({ status }: { status: string }) {
  const color = getStatusColor(status)

  switch (status) {
    case 'clear':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="4" fill={color} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180
            return (
              <line
                key={deg}
                x1={10 + Math.cos(rad) * 6}
                y1={10 + Math.sin(rad) * 6}
                x2={10 + Math.cos(rad) * 8}
                y2={10 + Math.sin(rad) * 8}
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )
          })}
        </svg>
      )
    case 'mild':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8" cy="10" r="4" fill={color} opacity="0.8" />
          <path d="M10 8c2-2 6-1 6 2s-2 3-4 3H6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'moderate':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4 12c0-3 2-5 5-5s4 2 5 3c2 0 3 1 3 3s-1 2-3 2H5c-2 0-3-1-1-3z" fill={color} opacity="0.6" />
        </svg>
      )
    case 'heavy':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 11c0-3 2-5 5-5s4 2 5 3c2 0 4 1 4 3s-2 3-4 3H4c-2 0-3-1-1-3z" fill={color} opacity="0.7" />
          <line x1="7" y1="15" x2="7" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="11" y1="15" x2="11" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 10c0-3 2-5 5-5s4 2 5 3c2 0 4 1 4 3s-2 3-4 3H4c-2 0-3-1-1-3z" fill={color} opacity="0.8" />
          <path d="M9 14l-1 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M12 14l1 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
  }
}

function TrendArrow({ trend }: { trend: 'improving' | 'stable' | 'declining' }) {
  if (trend === 'stable') {
    return (
      <span className="ml-1 text-xs text-muted-foreground">Stable</span>
    )
  }

  return (
    <span className={`ml-1 text-xs font-medium ${trend === 'improving' ? 'text-fog-clear' : 'text-fog-heavy'}`}>
      {trend === 'improving' ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline" aria-hidden="true">
          <path d="M7 11V3M7 3l3 3M7 3L4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline" aria-hidden="true">
          <path d="M7 3v8M7 11l3-3M7 11l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {' '}{trend === 'improving' ? 'Improving' : 'Declining'}
    </span>
  )
}
