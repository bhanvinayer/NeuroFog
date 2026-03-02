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

type UserType = 'developer' | 'student' | 'creator'
type PlantType = 'focus-flower' | 'energy-tree' | 'calm-succulent' | 'creativity-vine' | 'productivity-herb' | 'wisdom-moss' |
  'zen-bamboo' | 'courage-oak' | 'peace-lily' | 'inspiration-orchid'

interface Plant {
  id: string
  type: PlantType
  health: number // 0-100
  healthLevel: number // alias for health (0-100)
  growth: number // 0-100
  stage: number // growth stage (0-4)
  position: { x: number; y: number }
  lastWatered: number
  unlockLevel: number
  age: number // days since planted
  mood: 'happy' | 'neutral' | 'wilting' | 'blooming'
  nickname?: string // optional plant name
  specialEffects: string[] // particle effects, animations
}

interface GardenState {
  level: number
  experience: number
  plants: Plant[]
  streakDays: number
  streakCount: number // alias for streakDays
  lastActivity: number
  unlockedActivities: string[]
  preferredActivities: string[]
  totalSessions: number
  effectivenessHistory: number[]
}

interface NeuroFogContextType {
  state: CognitiveState
  timeline: TimelineEntry[]
  isTracking: boolean
  isPatchActive: boolean
  isGardenActive: boolean
  userType: UserType
  gardenState: GardenState
  sentimentScore: number
  recoveryScore: number | null
  startTracking: () => void
  stopTracking: () => void
  activatePatch: () => void
  activateGarden: () => void
  deactivatePatch: () => void
  deactivateGarden: (effectiveness?: number) => void
  setUserType: (type: UserType) => void
  updateGarden: (newState: GardenState) => void
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
  const lastInterventionTimeRef = useRef<number>(0)
  const sustainedCfiRef = useRef<{ high: number; medium: number }>({ high: 0, medium: 0 })

  const [isTracking, setIsTracking] = useState(false)
  const [isPatchActive, setIsPatchActive] = useState(false)
  const [isGardenActive, setIsGardenActive] = useState(false)
  const [userType, setUserType] = useState<UserType>('developer')
  const [sentimentScore, setSentimentScore] = useState(0.8)
  const [recoveryScore, setRecoveryScore] = useState<number | null>(null)
  
  // Initialize garden state
  const [gardenState, setGardenState] = useState<GardenState>({
    level: 1,
    experience: 0,
    plants: [],
    streakDays: 0,
    streakCount: 0, // alias for streakDays
    lastActivity: 0,
    unlockedActivities: ['plant-focus-seed'],
    preferredActivities: [],
    totalSessions: 0,
    effectivenessHistory: []
  })
  const [state, setState] = useState<CognitiveState>({
    cfi: 0, // Start at baseline clear state
    normalizedLoad: 0.1,
    attentionStability: 1.0,
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

  // Intelligent intervention system with garden integration
  const shouldActivateGarden = useCallback((): boolean => {
    const now = Date.now()
    const timeSinceLastIntervention = now - lastInterventionTimeRef.current
    const minInterval = 10 * 60 * 1000 // 10 minutes between interventions
    
    // Don't activate if too recent intervention
    if (timeSinceLastIntervention < minInterval) return false
    
    // Activate garden for gradual stress buildup (preventive)
    if (state.cfi < 55 && state.cfi > 35) {
      const recentTrend = cfiHistoryRef.current.slice(-3)
      const isDecreasing = recentTrend.length >= 2 && 
        recentTrend.every((val, i) => i === 0 || val < recentTrend[i - 1])
      
      if (isDecreasing) return true
    }
    
    // Activate for specific stress patterns based on user type
    if (userType === 'developer' && state.signals.tabSwitches > 8) return true
    if (userType === 'student' && state.signals.typingVariability > 0.6) return true
    if (state.normalizedLoad > 0.8) return true
    
    return false
  }, [state, userType])

  const updateState = useCallback(() => {
    if (!trackerRef.current) return

    const signals = trackerRef.current.getSignals()
    const baseline = trackerRef.current.getBaseline()
    const { cfi: rawCfi, normalizedLoad, attentionStability, isExcessiveAgitation } = computeCFI(signals, baseline, sentimentScore)

    // Apply very conservative smoothing to prevent rapid CFI changes
    let smoothedCfi = rawCfi
    if (cfiHistoryRef.current.length > 0) {
      const lastCfi = cfiHistoryRef.current[cfiHistoryRef.current.length - 1]
      // Extremely limited change - max 2 points per update
      const maxChange = 2
      const cfiDelta = rawCfi - lastCfi
      if (Math.abs(cfiDelta) > maxChange) {
        smoothedCfi = lastCfi + Math.sign(cfiDelta) * maxChange
      }
    }

    // Track sustained CFI levels - demo optimized for faster response
    if (smoothedCfi >= 50) {  // Reduced from 60
      sustainedCfiRef.current.high++
    } else {
      sustainedCfiRef.current.high = 0
    }
    
    if (smoothedCfi >= 35) {  // Reduced from 45
      sustainedCfiRef.current.medium++
    } else {
      sustainedCfiRef.current.medium = 0
    }

    cfiHistoryRef.current.push(smoothedCfi)
    if (cfiHistoryRef.current.length > 100) cfiHistoryRef.current.shift()

    const trend = getTrend(cfiHistoryRef.current)
    const status = getStatusFromCFI(smoothedCfi)

    const newState: CognitiveState = {
      cfi: smoothedCfi,
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
        cfi: smoothedCfi,
        status,
        signals,
      }
      const updated = [...prev, entry]
      // Keep last 200 entries
      if (updated.length > 200) return updated.slice(-200)
      return updated
    })

    // Very conservative intervention logic with sustained high CFI requirement
    const now = Date.now()
    const timeSinceLastIntervention = now - lastInterventionTimeRef.current
    const minInterventionInterval = 5 * 60 * 1000 // 5 minutes for demo (reduced from 20)
    
    // IMMEDIATE NeuroPatch activation for excessive agitation (mouse + scroll)
    if (isExcessiveAgitation && !isPatchActive && !isGardenActive) {
      setIsPatchActive(true)
      patchStartCfiRef.current = smoothedCfi
      lastInterventionTimeRef.current = now
      sustainedCfiRef.current.medium = 0
      sustainedCfiRef.current.high = 0
      console.log('🚨 Emergency NeuroPatch activated due to excessive agitation')
    }
    // Normal intervention logic for sustained CFI - demo optimized
    else if (!isPatchActive && !isGardenActive && timeSinceLastIntervention > minInterventionInterval) {
      // NeuroGarden activation - faster for demo visibility
      if (smoothedCfi >= 40 && sustainedCfiRef.current.medium >= 3) { // Reduced thresholds for demo
        setIsGardenActive(true)
        lastInterventionTimeRef.current = now
        sustainedCfiRef.current.medium = 0
        sustainedCfiRef.current.high = 0
      }
      // NeuroPatch activation - faster for demo visibility  
      else if (smoothedCfi >= 60 && sustainedCfiRef.current.high >= 3) { // Reduced thresholds for demo
        setIsPatchActive(true)
        patchStartCfiRef.current = smoothedCfi
        lastInterventionTimeRef.current = now
        sustainedCfiRef.current.medium = 0
        sustainedCfiRef.current.high = 0
      }
    }
  }, [sentimentScore, isPatchActive, isGardenActive])

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

  const activateGarden = useCallback(() => {
    setIsGardenActive(true)
  }, [])

  const deactivateGarden = useCallback((effectiveness?: number) => {
    setIsGardenActive(false)
    
    if (effectiveness !== undefined) {
      // Update garden statistics
      const newGardenState = { ...gardenState }
      newGardenState.totalSessions++
      newGardenState.lastActivity = Date.now()
      newGardenState.effectivenessHistory.push(effectiveness)
      
      // Keep only last 20 effectiveness scores
      if (newGardenState.effectivenessHistory.length > 20) {
        newGardenState.effectivenessHistory.shift()
      }
      
      // Calculate streak
      const today = new Date().toDateString()
      const lastActivityDate = new Date(newGardenState.lastActivity).toDateString()
      if (lastActivityDate !== today) {
        newGardenState.streakDays++
      }
      
      setGardenState(newGardenState)
      
      // Provide gentle cognitive boost based on garden activity
      const recoveryBoost = Math.min(20, effectiveness / 5)
      setRecoveryScore(effectiveness)
      
      // Light boost to signals and CFI with garden-based recovery
      if (trackerRef.current) {
        trackerRef.current.reset()
      }
      
      setState(prev => {
        const boostedCfi = Math.min(100, prev.cfi + recoveryBoost)
        return {
          ...prev,
          cfi: boostedCfi,
          normalizedLoad: Math.max(0, prev.normalizedLoad - (recoveryBoost / 50)),
          attentionStability: Math.min(1, prev.attentionStability + (recoveryBoost / 100)),
          status: getStatusFromCFI(boostedCfi),
          trend: 'improving',
          signals: DEFAULT_SIGNALS,
        }
      })
    }
  }, [gardenState])

  const updateGarden = useCallback((newState: GardenState) => {
    setGardenState(newState)
  }, [])

  const deactivatePatch = useCallback(() => {
    setIsPatchActive(false)
    // Calculate recovery score
    if (patchStartCfiRef.current !== null) {
      const improvement = patchStartCfiRef.current - state.cfi // Inverted since lower CFI is better
      const score = Math.max(0, Math.min(100, Math.round(improvement * 2 + 50)))
      setRecoveryScore(score)
      patchStartCfiRef.current = null
    }

    // Reset CFI to 0 after NeuroPatch intervention
    if (trackerRef.current) {
      trackerRef.current.reset()
    }
    cfiHistoryRef.current = []
    setState(prev => ({
      ...prev,
      cfi: 0, // Reset to baseline clear state
      normalizedLoad: 0.1,
      attentionStability: 1.0,
      status: 'clear',
      trend: 'improving',
      signals: DEFAULT_SIGNALS,
    }))
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
    setIsGardenActive(false)
    setState({
      cfi: 0, // Start at baseline clear state
      normalizedLoad: 0.1,
      attentionStability: 1.0,
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
      isGardenActive,
      userType,
      gardenState,
      sentimentScore,
      recoveryScore,
      startTracking,
      stopTracking,
      activatePatch,
      activateGarden,
      deactivatePatch,
      deactivateGarden,
      setUserType,
      updateGarden,
      setSentiment,
      resetSession,
    }}>
      {children}
    </NeuroFogContext.Provider>
  )
}
