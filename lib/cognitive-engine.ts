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
  typingSpeed: 5,    // chars/sec
  mouseSpeed: 300,   // px/sec
  scrollSpeed: 200,  // px/sec
  samples: 0,
}

export function getStatusFromCFI(cfi: number): CognitiveState['status'] {
  if (cfi >= 80) return 'clear'
  if (cfi >= 60) return 'mild'
  if (cfi >= 40) return 'moderate'
  if (cfi >= 20) return 'heavy'
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
// CFI = (1 - normalized_load) * attention_stability * sentiment_score * 100
export function computeCFI(
  signals: CognitiveSignals,
  baseline: Baseline,
  sentimentScore: number = 0.8
): { cfi: number; normalizedLoad: number; attentionStability: number } {
  // Normalize cognitive load from signals
  const typingLoadFactor = signals.typingVariability > 0
    ? Math.min(signals.typingVariability / 0.5, 1)
    : 0

  const mouseLoadFactor = signals.mouseVariability

  const tabSwitchFactor = Math.min(signals.tabSwitches / 10, 1)

  const idleFactor = signals.idleTime > 30
    ? Math.min((signals.idleTime - 30) / 120, 1) * 0.3
    : 0

  const microPauseFactor = Math.min(signals.microPauses / 8, 1)

  // Weighted normalized load
  const normalizedLoad = Math.min(1, Math.max(0,
    typingLoadFactor * 0.25 +
    mouseLoadFactor * 0.2 +
    tabSwitchFactor * 0.25 +
    idleFactor * 0.1 +
    microPauseFactor * 0.2
  ))

  // Attention stability = inverse of erratic behavior
  const speedDeviation = baseline.samples > 5 && baseline.typingSpeed > 0
    ? Math.abs(signals.typingSpeed - baseline.typingSpeed) / baseline.typingSpeed
    : 0
  const attentionStability = Math.max(0, Math.min(1,
    1 - (speedDeviation * 0.4 + tabSwitchFactor * 0.3 + mouseLoadFactor * 0.3)
  ))

  // CFI formula
  const cfi = Math.round(
    (1 - normalizedLoad) * attentionStability * sentimentScore * 100
  )

  return {
    cfi: Math.max(0, Math.min(100, cfi)),
    normalizedLoad,
    attentionStability,
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
    // Throttle to every 100ms
    if (this.mousePositions.length > 0 &&
        now - this.mousePositions[this.mousePositions.length - 1].t < 100) {
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
