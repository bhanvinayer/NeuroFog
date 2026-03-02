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
import { VoiceAnalyzer, type VoiceMetrics, type VoiceAnalysisResult } from '@/lib/voice-analysis'
import { 
  getPersonalizationProfile, 
  calculatePersonalizedCFI,
  getPersonalizedRecommendations,
  getTrackingFocus,
  type UserType 
} from '@/lib/personalization'

// UserType now imported from personalization
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
  // Voice analysis
  isVoiceEnabled: boolean
  voiceMetrics: VoiceMetrics | null
  voiceAnalysisResult: VoiceAnalysisResult | null
  personalizedCfi: number
  personalizedRecommendations: string[]
  trackingFocus: string[]
  // Methods
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
  // Voice methods
  toggleVoiceAnalysis: () => void
  calibrateVoice: () => void
}

const NeuroFogContext = createContext<NeuroFogContextType | null>(null)

export function useNeuroFog() {
  const ctx = useContext(NeuroFogContext)
  if (!ctx) throw new Error('useNeuroFog must be used within NeuroFogProvider')
  return ctx
}

export function NeuroFogProvider({ children }: { children: ReactNode }) {
  const trackerRef = useRef<CognitiveTracker | null>(null)
  const voiceAnalyzerRef = useRef<VoiceAnalyzer | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cfiHistoryRef = useRef<number[]>([])
  const patchStartCfiRef = useRef<number | null>(null)
  const lastInterventionTimeRef = useRef<number>(Date.now() - 10 * 60 * 1000) // Start 10 mins ago for immediate demo availability
  const sustainedCfiRef = useRef<{ high: number; medium: number }>({ high: 0, medium: 0 })

  const [isTracking, setIsTracking] = useState(false)
  const [isPatchActive, setIsPatchActive] = useState(false)
  const [isGardenActive, setIsGardenActive] = useState(false)
  const [userType, setUserType] = useState<UserType>('developer')
  const [sentimentScore, setSentimentScore] = useState(0.8)
  const [recoveryScore, setRecoveryScore] = useState<number | null>(null)
  
  // Voice analysis state
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [voiceMetrics, setVoiceMetrics] = useState<VoiceMetrics | null>(null)
  const [voiceAnalysisResult, setVoiceAnalysisResult] = useState<VoiceAnalysisResult | null>(null)
  const [personalizedCfi, setPersonalizedCfi] = useState(0)
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<string[]>([])
  const [trackingFocus, setTrackingFocus] = useState<string[]>(['typing', 'mouse', 'focus'])
  
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

  // Initialize tracker and voice analyzer
  useEffect(() => {
    trackerRef.current = new CognitiveTracker()
    voiceAnalyzerRef.current = new VoiceAnalyzer()
    
    // Auto-start tracking for demo purposes after 1 second
    const autoStartTimer = setTimeout(() => {
      setIsTracking(true)
      console.log('🎆 Demo: Auto-starting tracking for seamless experience')
    }, 1000)
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      clearTimeout(autoStartTimer)
      if (voiceAnalyzerRef.current) {
        voiceAnalyzerRef.current.stopAnalysis()
      }
    }
  }, [])

  // Update personalization when user type changes
  useEffect(() => {
    const focus = getTrackingFocus(userType)
    setTrackingFocus(focus)
    console.log(`👤 User type: ${userType}, Focus: ${focus.join(', ')}`)
  }, [userType])

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

    // Get voice analysis if enabled
    let voiceStress = 0
    let currentVoiceMetrics: VoiceMetrics | null = null
    let currentVoiceResult: VoiceAnalysisResult | null = null
    
    if (isVoiceEnabled && voiceAnalyzerRef.current) {
      currentVoiceMetrics = voiceAnalyzerRef.current.getCurrentMetrics()
      currentVoiceResult = voiceAnalyzerRef.current.getAnalysisResult()
      voiceStress = voiceAnalyzerRef.current.analyzeForCognitiveLoad()
      
      setVoiceMetrics(currentVoiceMetrics)
      setVoiceAnalysisResult(currentVoiceResult)
    }

    // Calculate personalized CFI based on user type
    const personalizedCfiValue = calculatePersonalizedCFI(rawCfi, voiceStress, signals, userType)
    setPersonalizedCfi(personalizedCfiValue)

    // Use personalized CFI for main calculations
    let smoothedCfi = personalizedCfiValue
    if (cfiHistoryRef.current.length > 0) {
      const lastCfi = cfiHistoryRef.current[cfiHistoryRef.current.length - 1]
      // Allow faster changes for demo - max 15 points per update (or immediate for agitation)
      const maxChange = isExcessiveAgitation ? 50 : 15  // Increased for demo visibility
      const cfiDelta = personalizedCfiValue - lastCfi
      if (Math.abs(cfiDelta) > maxChange) {
        smoothedCfi = lastCfi + Math.sign(cfiDelta) * maxChange
      }
    }
    
    // DEMO BOOST: If any stress signals are detected, give extra CFI boost
    if (signals.mouseSpeed > 200 || signals.scrollSpeed > 100 || signals.typingVariability > 0.5) {
      smoothedCfi = Math.min(100, smoothedCfi + 10) // Extra boost for demo
      console.log(`🚀 Demo boost applied! CFI boosted to ${smoothedCfi}`)
    }

    // Voice stress boost for demo visibility
    if (voiceStress > 0.5 && currentVoiceMetrics?.volume && currentVoiceMetrics.volume > 0.1) {
      smoothedCfi = Math.min(100, smoothedCfi + (voiceStress * 20))
      console.log(`🎤 Voice stress detected! CFI boosted by ${voiceStress * 20}`)
    }

    // Track sustained CFI levels - aligned with intervention thresholds
    if (smoothedCfi >= 60) {  // High threshold for NeuroPatch - requires 35 seconds
      sustainedCfiRef.current.high++
    } else {
      sustainedCfiRef.current.high = 0
    }
    
    if (smoothedCfi >= 75) {  // Medium-high threshold for NeuroGarden - increased to 75
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

    // Generate personalized recommendations
    const recommendations = getPersonalizedRecommendations(smoothedCfi, voiceStress, userType)
    setPersonalizedRecommendations(recommendations)

    // Debug logging for demo with calm state detection
    const voiceInfo = currentVoiceMetrics ? `, Voice: ${currentVoiceMetrics.emotionalTone}(${(voiceStress * 100).toFixed(0)}%)` : ''
    if (smoothedCfi > 10 || isExcessiveAgitation || voiceStress > 0.3) {
      console.log(`${userType.toUpperCase()} CFI: ${smoothedCfi}${voiceInfo}, Mouse: ${Math.round(signals.mouseSpeed)}px/s, Scroll: ${Math.round(signals.scrollSpeed)}px/s, Sustained Medium: ${sustainedCfiRef.current.medium}, Sustained High: ${sustainedCfiRef.current.high}`)
    } else if (smoothedCfi < 10 && cfiHistoryRef.current.length > 5) {
      console.log(`😌 User in calm state - CFI: ${smoothedCfi} (interventions on cooldown)`)
    }

    // Manual activation for demo purposes (console commands)
    if (typeof window !== 'undefined') {
      (window as any).demoActivateGarden = () => {
        if (!isGardenActive && !isPatchActive) {
          setIsGardenActive(true)
          lastInterventionTimeRef.current = Date.now()
          console.log('🌱 Demo: NeuroGarden manually activated')
        } else {
          console.log('⚠️ Demo: Cannot activate Garden - Patch active:', isPatchActive, 'Garden active:', isGardenActive)
        }
      }
      (window as any).demoActivatePatch = () => {
        if (!isPatchActive && !isGardenActive) {
          setIsPatchActive(true)
          lastInterventionTimeRef.current = Date.now()
          console.log('🩹 Demo: NeuroPatch manually activated')
        } else {
          console.log('⚠️ Demo: Cannot activate Patch - Patch active:', isPatchActive, 'Garden active:', isGardenActive)
        }
      }
      (window as any).demoResetCFI = () => {
        cfiHistoryRef.current = []
        sustainedCfiRef.current = { high: 0, medium: 0 }
        lastInterventionTimeRef.current = Date.now() - 10 * 60 * 1000 // Reset cooldown
        setIsPatchActive(false)
        setIsGardenActive(false)
        console.log('🔄 Demo: CFI system reset - interventions now available')
      }
      (window as any).demoStartTracking = () => {
        setIsTracking(true)
        console.log('🏁 Demo: Tracking started')
      }
      (window as any).demoForceCFI = (targetCfi: number) => {
        const newState = {
          ...state,
          cfi: targetCfi,
          status: getStatusFromCFI(targetCfi)
        }
        setState(newState)
        cfiHistoryRef.current.push(targetCfi)
        
        // Trigger sustained reading counts
        if (targetCfi >= 35) sustainedCfiRef.current.medium = 2
        if (targetCfi >= 60) sustainedCfiRef.current.high = 2
        
        console.log(`📊 Demo: CFI forced to ${targetCfi} with sustained readings`)
      }
      (window as any).demoCheckState = () => {
        console.log('📊 Demo State Check:', {
          tracking: isTracking,
          cfi: state.cfi,
          gardenActive: isGardenActive,
          patchActive: isPatchActive,
          sustainedMedium: sustainedCfiRef.current.medium,
          sustainedHigh: sustainedCfiRef.current.high,
          cooldownRemaining: Math.max(0, (minInterventionInterval - (Date.now() - lastInterventionTimeRef.current)) / 60000).toFixed(1) + ' minutes'
        })
      }
      
      // Show available commands once
      if (!(window as any).demoCmdShown) {
        console.log('🛠️ Demo commands: demoActivateGarden(), demoForceCFI(40), demoCheckState(), demoResetCFI()')
        ;(window as any).demoCmdShown = true
      }
    }

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

    // Intervention logic - optimized for demo responsiveness
    const now = Date.now()
    const timeSinceLastIntervention = now - lastInterventionTimeRef.current
    const minInterventionInterval = 30 * 1000 // 30 SECONDS for demo (was 3 minutes)
    
    // Debug intervention state - comprehensive logging
    if (smoothedCfi >= 20) { // Lower threshold for more visibility
      console.log(`🔍 Intervention Debug:`, {
        cfi: smoothedCfi,
        mediumSustained: `${sustainedCfiRef.current.medium}/2`,
        highSustained: `${sustainedCfiRef.current.high}/2`, 
        cooldownMins: Math.max(0, (minInterventionInterval - timeSinceLastIntervention)/1000/60).toFixed(1),
        canActivateGarden: !isPatchActive && !isGardenActive && timeSinceLastIntervention >= minInterventionInterval && smoothedCfi >= 35,
        gardenActive: isGardenActive,
        patchActive: isPatchActive,
        tracking: isTracking
      })
    }
    
    // Improved intervention logic - prevents premature activation
    if (!isPatchActive && !isGardenActive && timeSinceLastIntervention >= minInterventionInterval) {
      // NeuroPatch activation - requires 35 seconds of sustained high stress (CFI 60+) 
      if (smoothedCfi >= 60 && sustainedCfiRef.current.high >= 35) { // 35 seconds of sustained stress
        console.log(`🩹 NeuroPatch ACTIVATING! CFI: ${smoothedCfi}, Sustained: ${sustainedCfiRef.current.high} seconds`)
        setIsPatchActive(true)
        patchStartCfiRef.current = smoothedCfi
        lastInterventionTimeRef.current = now
        sustainedCfiRef.current.medium = 0
        sustainedCfiRef.current.high = 0
        console.log('🩹 NeuroPatch activated - 35 seconds of sustained high stress')
      }
      // NeuroGarden activation - CFI 75 threshold (increased from 35)
      else if (smoothedCfi >= 75 && sustainedCfiRef.current.medium >= 3) { // 3 seconds at CFI 75+
        console.log(`🌱 NeuroGarden ACTIVATING! CFI: ${smoothedCfi}, Sustained: ${sustainedCfiRef.current.medium}`)
        setIsGardenActive(true)
        lastInterventionTimeRef.current = now
        sustainedCfiRef.current.medium = 0
        sustainedCfiRef.current.high = 0
        console.log('🌱 NeuroGarden activated - Stress detected at CFI 75+')
      }
      // Debug why activation didn't happen
      else if (smoothedCfi >= 50) {
        console.log(`🙅 No activation: CFI ${smoothedCfi} (need 75+ for Garden, 60+ for Patch) | Garden sustained: ${sustainedCfiRef.current.medium}/3 | Patch sustained: ${sustainedCfiRef.current.high}/35`)
      }
    }
    // Log why interventions are blocked
    else if (smoothedCfi >= 60 && !isPatchActive && !isGardenActive) {
      const remainingCooldown = Math.max(0, (minInterventionInterval - timeSinceLastIntervention) / 1000 / 60)
      if (remainingCooldown > 0) {
        console.log(`⏰ Interventions blocked - ${Math.ceil(remainingCooldown)} seconds cooldown remaining`)
      } else {
        console.log(`🤔 Interventions blocked for unknown reason - Debug needed`)
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

    intervalRef.current = setInterval(updateState, 1000)  // 1 second for demo responsiveness

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
      
      // Provide calming effect based on garden activity effectiveness
      const calmingEffect = Math.min(30, effectiveness / 3) // Max 30 point CFI reduction
      setRecoveryScore(effectiveness)
      
      // Apply calming effect - reduce CFI and improve cognitive state
      if (trackerRef.current) {
        trackerRef.current.reset()
      }
      
      // Reduce CFI based on intervention effectiveness
      const newCfi = Math.max(0, state.cfi - calmingEffect)
      cfiHistoryRef.current.push(newCfi) // Add the reduced CFI to history
      
      setState(prev => {
        return {
          ...prev,
          cfi: newCfi, // Reduced CFI indicates calming effect
          normalizedLoad: Math.max(0, prev.normalizedLoad - (calmingEffect / 50)),
          attentionStability: Math.min(1, prev.attentionStability + (calmingEffect / 100)),
          status: getStatusFromCFI(newCfi),
          trend: 'improving',
          signals: DEFAULT_SIGNALS,
        }
      })
      
      console.log(`🌱 NeuroGarden completed - CFI reduced by ${Math.round(calmingEffect)} points (effectiveness: ${effectiveness}%)`)
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

    // Reset CFI with calming effect after NeuroPatch intervention  
    if (trackerRef.current) {
      trackerRef.current.reset()
    }
    cfiHistoryRef.current = [0] // Reset with calm baseline
    sustainedCfiRef.current = { high: 0, medium: 0 } // Reset sustained counters
    
    setState(prev => ({
      ...prev,
      cfi: 0, // Reset to baseline clear state
      normalizedLoad: 0.1,
      attentionStability: 1.0,
      status: 'clear',
      trend: 'improving',
      signals: DEFAULT_SIGNALS,
    }))
    
    console.log(`🩹 NeuroPatch completed - CFI reset to 0, user now in calm state`)
  }, [state.cfi])

  const setSentiment = useCallback((score: number) => {
    setSentimentScore(Math.max(0, Math.min(1, score)))
  }, [])

  // Voice analysis methods
  const toggleVoiceAnalysis = useCallback(async () => {
    if (!voiceAnalyzerRef.current) return
    
    if (isVoiceEnabled) {
      voiceAnalyzerRef.current.stopAnalysis()
      setIsVoiceEnabled(false)
      setVoiceMetrics(null)
      setVoiceAnalysisResult(null)
      console.log('🎤 Voice analysis disabled')
    } else {
      const success = await voiceAnalyzerRef.current.startAnalysis()
      if (success) {
        setIsVoiceEnabled(true)
        console.log('🎤 Voice analysis enabled')
      } else {
        console.error('Failed to start voice analysis')
      }
    }
  }, [isVoiceEnabled])

  const calibrateVoice = useCallback(() => {
    if (voiceAnalyzerRef.current && isVoiceEnabled) {
      voiceAnalyzerRef.current.updateBaseline()
      console.log('🎤 Voice baseline calibrated')
    }
  }, [isVoiceEnabled])

  const resetSession = useCallback(() => {
    trackerRef.current?.reset()
    if (voiceAnalyzerRef.current) {
      voiceAnalyzerRef.current.stopAnalysis()
    }
    cfiHistoryRef.current = []
    setTimeline([])
    setRecoveryScore(null)
    setIsPatchActive(false)
    setIsGardenActive(false)
    setIsVoiceEnabled(false)
    setVoiceMetrics(null)
    setVoiceAnalysisResult(null)
    setPersonalizedCfi(0)
    setPersonalizedRecommendations([])
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
      // Voice analysis
      isVoiceEnabled,
      voiceMetrics,
      voiceAnalysisResult,
      personalizedCfi,
      personalizedRecommendations,
      trackingFocus,
      // Methods
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
      // Voice methods
      toggleVoiceAnalysis,
      calibrateVoice,
    }}>
      {children}
    </NeuroFogContext.Provider>
  )
}
