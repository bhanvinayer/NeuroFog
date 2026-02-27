'use client'

import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from 'react'
import {
  CognitiveTracker,
  computeCFI,
  getStatusFromCFI,
  getTrend,
  DEFAULT_SIGNALS,
  type CognitiveState,
  type TimelineEntry,
} from '@/lib/cognitive-engine'

interface NeuroFogContextType {
  state: CognitiveState
  timeline: TimelineEntry[]
  isTracking: boolean
  isPatchActive: boolean
  sentimentScore: number
  recoveryScore: number | null
  startTracking: () => void
  stopTracking: () => void
  activatePatch: () => void
  deactivatePatch: () => void
  setSentiment: (score: number) => void
  resetSession: () => void
}

const NeuroFogContext = createContext<NeuroFogContextType | null>(null)

export function useNeuroFog() {
  const ctx = useContext(NeuroFogContext)
  if (!ctx) throw new Error('useNeuroFog must be used within NeuroFogProvider')
  return ctx
}

export function NeuroFogProvider({ children }: { children: ReactNode }) {
  const trackerRef = useRef<CognitiveTracker | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cfiHistoryRef = useRef<number[]>([])
  const patchStartCfiRef = useRef<number | null>(null)

  const [isTracking, setIsTracking] = useState(false)
  const [isPatchActive, setIsPatchActive] = useState(false)
  const [sentimentScore, setSentimentScore] = useState(0.8)
  const [recoveryScore, setRecoveryScore] = useState<number | null>(null)
  const [state, setState] = useState<CognitiveState>({
    cfi: 75,
    normalizedLoad: 0.2,
    attentionStability: 0.9,
    sentimentScore: 0.8,
    status: 'clear',
    trend: 'stable',
    signals: DEFAULT_SIGNALS,
  })
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])

  // Initialize tracker
  useEffect(() => {
    trackerRef.current = new CognitiveTracker()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const updateState = useCallback(() => {
    if (!trackerRef.current) return

    const signals = trackerRef.current.getSignals()
    const baseline = trackerRef.current.getBaseline()
    const { cfi, normalizedLoad, attentionStability } = computeCFI(signals, baseline, sentimentScore)

    cfiHistoryRef.current.push(cfi)
    if (cfiHistoryRef.current.length > 100) cfiHistoryRef.current.shift()

    const trend = getTrend(cfiHistoryRef.current)
    const status = getStatusFromCFI(cfi)

    const newState: CognitiveState = {
      cfi,
      normalizedLoad,
      attentionStability,
      sentimentScore,
      status,
      trend,
      signals,
    }

    setState(newState)

    // Add to timeline every update
    setTimeline(prev => {
      const entry: TimelineEntry = {
        timestamp: Date.now(),
        cfi,
        status,
        signals,
      }
      const updated = [...prev, entry]
      // Keep last 200 entries
      if (updated.length > 200) return updated.slice(-200)
      return updated
    })

    // Auto-activate NeuroPatch when CFI drops below 40
    if (cfi < 40 && !isPatchActive) {
      setIsPatchActive(true)
      patchStartCfiRef.current = cfi
    }
  }, [sentimentScore, isPatchActive])

  const startTracking = useCallback(() => {
    if (!trackerRef.current) return
    setIsTracking(true)
  }, [])

  // Bind event listeners when tracking starts
  useEffect(() => {
    if (!isTracking || !trackerRef.current) return

    const handleKeydown = () => trackerRef.current?.recordKeystroke()
    const handleMouseMove = (e: MouseEvent) => trackerRef.current?.recordMouseMove(e.clientX, e.clientY)
    const handleScroll = (e: Event) => {
      if (e instanceof WheelEvent) {
        trackerRef.current?.recordScroll(e.deltaY)
      }
    }
    const handleVisibilityChange = () => {
      if (document.hidden) trackerRef.current?.recordTabSwitch()
    }

    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('wheel', handleScroll, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    intervalRef.current = setInterval(updateState, 2000)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('wheel', handleScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isTracking, updateState])

  const stopTracking = useCallback(() => {
    setIsTracking(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const activatePatch = useCallback(() => {
    setIsPatchActive(true)
    patchStartCfiRef.current = state.cfi
  }, [state.cfi])

  const deactivatePatch = useCallback(() => {
    setIsPatchActive(false)
    // Calculate recovery score
    if (patchStartCfiRef.current !== null) {
      const improvement = state.cfi - patchStartCfiRef.current
      const score = Math.max(0, Math.min(100, Math.round(improvement * 2 + 50)))
      setRecoveryScore(score)
      patchStartCfiRef.current = null
    }

    // Calm the CFI after breathing — reset signals and boost the index
    if (trackerRef.current) {
      trackerRef.current.reset()
    }
    cfiHistoryRef.current = []
    setState(prev => {
      const boostedCfi = Math.min(100, prev.cfi + 25)
      return {
        ...prev,
        cfi: boostedCfi,
        normalizedLoad: Math.max(0, prev.normalizedLoad - 0.3),
        attentionStability: Math.min(1, prev.attentionStability + 0.3),
        status: getStatusFromCFI(boostedCfi),
        trend: 'improving',
        signals: DEFAULT_SIGNALS,
      }
    })
  }, [state.cfi])

  const setSentiment = useCallback((score: number) => {
    setSentimentScore(Math.max(0, Math.min(1, score)))
  }, [])

  const resetSession = useCallback(() => {
    trackerRef.current?.reset()
    cfiHistoryRef.current = []
    setTimeline([])
    setRecoveryScore(null)
    setIsPatchActive(false)
    setState({
      cfi: 75,
      normalizedLoad: 0.2,
      attentionStability: 0.9,
      sentimentScore: 0.8,
      status: 'clear',
      trend: 'stable',
      signals: DEFAULT_SIGNALS,
    })
  }, [])

  return (
    <NeuroFogContext.Provider value={{
      state,
      timeline,
      isTracking,
      isPatchActive,
      sentimentScore,
      recoveryScore,
      startTracking,
      stopTracking,
      activatePatch,
      deactivatePatch,
      setSentiment,
      resetSession,
    }}>
      {children}
    </NeuroFogContext.Provider>
  )
}
