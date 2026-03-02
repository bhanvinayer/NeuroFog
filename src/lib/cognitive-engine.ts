// NeuroFog Cognitive Load Tracking Engine
// All data stays local — privacy-first design

export interface CognitiveSignals {
  typingSpeed: number        // chars per second
  typingVariability: number  // standard deviation of keystroke intervals
  mouseSpeed: number         // pixels per second average
  mouseVariability: number   // erratic movement score 0-1
  idleTime: number          // seconds since last interaction
  tabSwitches: number       // count in last 60 seconds
  scrollSpeed: number       // pixels per second
  microPauses: number       // pauses > 2s in typing
}

export interface CognitiveState {
  cfi: number               // Cognitive Fog Index 0-100
  normalizedLoad: number    // 0-1
  attentionStability: number // 0-1
  sentimentScore: number     // 0-1
  status: 'clear' | 'mild' | 'moderate' | 'heavy' | 'critical'
  trend: 'improving' | 'stable' | 'declining'
  signals: CognitiveSignals
}

export interface TimelineEntry {
  timestamp: number
  cfi: number
  status: CognitiveState['status']
  signals: CognitiveSignals
}

const DEFAULT_SIGNALS: CognitiveSignals = {
  typingSpeed: 0,
  typingVariability: 0,
  mouseSpeed: 0,
  mouseVariability: 0,
  idleTime: 0,
  tabSwitches: 0,
  scrollSpeed: 0,
  microPauses: 0,
}

// Baseline calibration values (updated as user interacts)
interface Baseline {
  typingSpeed: number
  mouseSpeed: number
  scrollSpeed: number
  samples: number
}

const INITIAL_BASELINE: Baseline = {
  typingSpeed: 4,    // chars/sec - slightly lower for easier triggering
  mouseSpeed: 250,   // px/sec - reduced for demo sensitivity  
  scrollSpeed: 150,  // px/sec - reduced for demo sensitivity
  samples: 10,       // Start with baseline samples for immediate demo responsiveness
}

export function getStatusFromCFI(cfi: number): CognitiveState['status'] {
  if (cfi <= 25) return 'clear'
  if (cfi <= 45) return 'mild'
  if (cfi <= 65) return 'moderate'
  if (cfi <= 80) return 'heavy'
  return 'critical'
}

export function getStatusLabel(status: CognitiveState['status']): string {
  switch (status) {
    case 'clear': return 'Clear Skies'
    case 'mild': return 'Light Haze'
    case 'moderate': return 'Moderate Fog'
    case 'heavy': return 'Heavy Fog'
    case 'critical': return 'Storm Alert'
  }
}

export function getStatusColor(status: CognitiveState['status']): string {
  switch (status) {
    case 'clear': return 'var(--fog-clear)'
    case 'mild': return 'var(--fog-mild)'
    case 'moderate': return 'var(--fog-moderate)'
    case 'heavy': return 'var(--fog-heavy)'
    case 'critical': return 'var(--fog-critical)'
  }
}

export function getStatusEmoji(status: CognitiveState['status']): string {
  switch (status) {
    case 'clear': return 'sunny'
    case 'mild': return 'partly-cloudy'
    case 'moderate': return 'cloudy'
    case 'heavy': return 'foggy'
    case 'critical': return 'stormy'
  }
}

// Compute the Cognitive Fog Index
// Optimized for demo - responsive to stress patterns for judges presentation
export function computeCFI(
  signals: CognitiveSignals,
  baseline: Baseline,
  sentimentScore: number = 0.8
): { cfi: number; normalizedLoad: number; attentionStability: number; isExcessiveAgitation: boolean } {
  // Calculate individual cognitive stress factors - demo-optimized for responsiveness
  
  // Typing stress factor - lower threshold for demo responsiveness
  const typingStressFactor = signals.typingVariability > 0.6  // Reduced from 1.0
    ? Math.min((signals.typingVariability - 0.6) / 1.0, 1) * 0.4  // Increased impact
    : 0

  // Mouse stress factor - dramatically increased for demo visibility
  const mouseVariabilityStress = signals.mouseVariability > 0.6 ? signals.mouseVariability * 0.3 : 0  // Increased impact
  
  // Aggressive mouse movement stress - much more sensitive for demo
  const fastMouseStress = signals.mouseSpeed > (baseline.mouseSpeed * 1.8) && baseline.samples > 2  // Lower threshold
    ? Math.min((signals.mouseSpeed - baseline.mouseSpeed * 1.8) / (baseline.mouseSpeed * 1.5), 1) * 0.5  // Much higher impact
    : 0
  
  const mouseStressFactor = mouseVariabilityStress + fastMouseStress

  // Tab switching stress - more responsive for demo
  const tabSwitchStressFactor = signals.tabSwitches > 6  // Reduced from 12
    ? Math.min((signals.tabSwitches - 6) / 8, 1) * 0.4  // Increased impact
    : 0

  // Idle time stress - faster activation for demo
  const idleStressFactor = signals.idleTime > 90 // Reduced from 180 seconds
    ? Math.min((signals.idleTime - 90) / 180, 1) * 0.2  // Increased impact
    : 0

  // Micro pause stress - more sensitive for demo visibility
  const microPauseStressFactor = signals.microPauses > 5  // Reduced from 10
    ? Math.min((signals.microPauses - 5) / 8, 1) * 0.3  // Increased impact
    : 0

  // DRAMATIC scroll stress - key for demo impact with up/down scrolling
  const scrollStressFactor = signals.scrollSpeed > (baseline.scrollSpeed * 2) && baseline.samples > 2  // Much lower threshold
    ? Math.min((signals.scrollSpeed - baseline.scrollSpeed * 2) / (baseline.scrollSpeed * 1.5), 1) * 0.6  // MAJOR impact
    : 0

  // Detect aggressive behavior (lower threshold for demo visibility)
  const isExcessiveAgitation = (
    (signals.mouseSpeed > (baseline.mouseSpeed * 2.2) &&  // Reduced from 3
     signals.scrollSpeed > (baseline.scrollSpeed * 1.8) &&  // Reduced from 2.5
     baseline.samples > 2) ||  // Reduced from 5
    signals.mouseSpeed > (baseline.mouseSpeed * 3.5) ||  // Pure aggressive mouse
    signals.scrollSpeed > (baseline.scrollSpeed * 4)     // Pure aggressive scroll
  )

  // Aggressive behavior gets dramatic multiplier for demo impact
  const agitationMultiplier = isExcessiveAgitation ? 4.5 : 1.0  // Increased from 3.0

  // Weighted cognitive load (0-1) - optimized for demo responsiveness
  const cognitiveLoad = Math.min(1, Math.max(0,
    (typingStressFactor * 1.2 +      // Typing gets extra weight
    mouseStressFactor * 1.5 +        // Mouse movement is key indicator
    scrollStressFactor * 1.8 +       // Scrolling gets highest weight for demo
    tabSwitchStressFactor +
    idleStressFactor +
    microPauseStressFactor) * agitationMultiplier
  ))

  // Attention stability calculation
  const speedDeviation = baseline.samples > 10 && baseline.typingSpeed > 0
    ? Math.abs(signals.typingSpeed - baseline.typingSpeed) / baseline.typingSpeed
    : 0
  const attentionStability = Math.max(0, Math.min(1,
    1 - (speedDeviation * 0.15 + tabSwitchStressFactor * 0.3 + mouseStressFactor * 0.05)
  ))

  // Sentiment impact (lower sentiment = higher stress)
  const sentimentStress = (1 - sentimentScore) * 0.2  // Reduced impact

  // Combined stress score - reduced smoothing for faster demo response
  const rawStressScore = cognitiveLoad * 0.7 + (1 - attentionStability) * 0.4 + sentimentStress

  // Reduced smoothing for demo - faster CFI changes
  // Aggressive behavior gets immediate response
  const smoothedStress = isExcessiveAgitation ? rawStressScore : Math.pow(rawStressScore, 0.8)  // Less smoothing

  // CFI formula optimized for demo visibility
  const cfiScaling = isExcessiveAgitation ? 100 : 85  // Higher scaling
  const cfi = Math.round(smoothedStress * cfiScaling)

  return {
    cfi: Math.max(0, Math.min(100, cfi)),
    normalizedLoad: cognitiveLoad,
    attentionStability,
    isExcessiveAgitation,
  }
}

export function getTrend(history: number[]): CognitiveState['trend'] {
  if (history.length < 3) return 'stable'
  const recent = history.slice(-5)
  const first = recent.slice(0, Math.ceil(recent.length / 2))
  const second = recent.slice(Math.ceil(recent.length / 2))
  const avgFirst = first.reduce((a, b) => a + b, 0) / first.length
  const avgSecond = second.reduce((a, b) => a + b, 0) / second.length
  const diff = avgSecond - avgFirst
  if (diff > 5) return 'improving'
  if (diff < -5) return 'declining'
  return 'stable'
}

// Tracker class that monitors user behavior
export class CognitiveTracker {
  private keystrokeTimestamps: number[] = []
  private mousePositions: Array<{ x: number; y: number; t: number }> = []
  private scrollEvents: Array<{ delta: number; t: number }> = []
  private tabSwitchTimestamps: number[] = []
  private lastActivityTime: number = Date.now()
  private baseline: Baseline = { ...INITIAL_BASELINE }
  private typingPauses: number = 0
  private lastKeystrokeTime: number = 0

  getSignals(): CognitiveSignals {
    const now = Date.now()
    const windowMs = 60000 // 1 minute window

    // Typing speed & variability
    const recentKeystrokes = this.keystrokeTimestamps.filter(t => now - t < windowMs)
    let typingSpeed = 0
    let typingVariability = 0

    if (recentKeystrokes.length > 2) {
      typingSpeed = recentKeystrokes.length / (windowMs / 1000)
      const intervals: number[] = []
      for (let i = 1; i < recentKeystrokes.length; i++) {
        intervals.push(recentKeystrokes[i] - recentKeystrokes[i - 1])
      }
      const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length
      typingVariability = Math.sqrt(variance) / 1000 // normalize to seconds
    }

    // Mouse speed & variability
    const recentMouse = this.mousePositions.filter(p => now - p.t < windowMs)
    let mouseSpeed = 0
    let mouseVariability = 0

    if (recentMouse.length > 2) {
      const speeds: number[] = []
      for (let i = 1; i < recentMouse.length; i++) {
        const dx = recentMouse[i].x - recentMouse[i - 1].x
        const dy = recentMouse[i].y - recentMouse[i - 1].y
        const dt = (recentMouse[i].t - recentMouse[i - 1].t) / 1000
        if (dt > 0) speeds.push(Math.sqrt(dx * dx + dy * dy) / dt)
      }
      if (speeds.length > 0) {
        mouseSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length
        const meanSpeed = mouseSpeed
        const speedVar = speeds.reduce((a, b) => a + Math.pow(b - meanSpeed, 2), 0) / speeds.length
        mouseVariability = Math.min(1, Math.sqrt(speedVar) / (meanSpeed + 1))
      }
    }

    // Scroll speed
    const recentScrolls = this.scrollEvents.filter(s => now - s.t < windowMs)
    const scrollSpeed = recentScrolls.length > 0
      ? recentScrolls.reduce((a, s) => a + Math.abs(s.delta), 0) / (windowMs / 1000)
      : 0

    // Tab switches
    const tabSwitches = this.tabSwitchTimestamps.filter(t => now - t < windowMs).length

    // Idle time
    const idleTime = (now - this.lastActivityTime) / 1000

    // Micro pauses (pauses > 2s during typing)
    const microPauses = this.typingPauses

    return {
      typingSpeed,
      typingVariability,
      mouseSpeed,
      mouseVariability,
      idleTime,
      tabSwitches,
      scrollSpeed,
      microPauses,
    }
  }

  recordKeystroke() {
    const now = Date.now()
    if (this.lastKeystrokeTime > 0 && now - this.lastKeystrokeTime > 2000) {
      this.typingPauses++
    }
    this.keystrokeTimestamps.push(now)
    this.lastKeystrokeTime = now
    this.lastActivityTime = now
    this.updateBaseline()
    this.cleanup()
  }

  recordMouseMove(x: number, y: number) {
    const now = Date.now()
    // Reduced throttle for demo - capture aggressive movement better
    if (this.mousePositions.length > 0 &&
        now - this.mousePositions[this.mousePositions.length - 1].t < 50) {  // Reduced from 100ms to 50ms
      return
    }
    this.mousePositions.push({ x, y, t: now })
    this.lastActivityTime = now
    this.cleanup()
  }

  recordScroll(delta: number) {
    this.scrollEvents.push({ delta, t: Date.now() })
    this.lastActivityTime = Date.now()
    this.cleanup()
  }

  recordTabSwitch() {
    this.tabSwitchTimestamps.push(Date.now())
    this.lastActivityTime = Date.now()
  }

  getBaseline(): Baseline {
    return { ...this.baseline }
  }

  private updateBaseline() {
    const signals = this.getSignals()
    if (signals.typingSpeed > 0) {
      this.baseline.samples++
      const alpha = Math.min(0.1, 1 / this.baseline.samples)
      this.baseline.typingSpeed = this.baseline.typingSpeed * (1 - alpha) + signals.typingSpeed * alpha
      this.baseline.mouseSpeed = this.baseline.mouseSpeed * (1 - alpha) + signals.mouseSpeed * alpha
      this.baseline.scrollSpeed = this.baseline.scrollSpeed * (1 - alpha) + signals.scrollSpeed * alpha
    }
  }

  private cleanup() {
    const cutoff = Date.now() - 120000 // Keep 2 minutes of data
    this.keystrokeTimestamps = this.keystrokeTimestamps.filter(t => t > cutoff)
    this.mousePositions = this.mousePositions.filter(p => p.t > cutoff)
    this.scrollEvents = this.scrollEvents.filter(s => s.t > cutoff)
    this.tabSwitchTimestamps = this.tabSwitchTimestamps.filter(t => t > cutoff)

    // Reset micro pauses periodically
    if (this.typingPauses > 20) this.typingPauses = 10
  }

  reset() {
    this.keystrokeTimestamps = []
    this.mousePositions = []
    this.scrollEvents = []
    this.tabSwitchTimestamps = []
    this.lastActivityTime = Date.now()
    this.typingPauses = 0
    this.lastKeystrokeTime = 0
  }
}

export { DEFAULT_SIGNALS, INITIAL_BASELINE }
export type { Baseline }
