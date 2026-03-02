'use client'

export interface VoiceMetrics {
  pitch: number              // Hz - average fundamental frequency
  tempo: number              // words per minute
  volume: number             // 0-1 normalized volume level
  pauseFrequency: number     // pauses per minute
  stressIndicators: number   // 0-1 composite stress score
  clarity: number           // 0-1 pronunciation clarity
  emotionalTone: 'calm' | 'neutral' | 'stressed' | 'excited' | 'tired'
  confidence: number        // 0-1 how confident the analysis is
}

export interface VoiceAnalysisResult {
  metrics: VoiceMetrics
  cognitiveLoad: number     // 0-1 estimated cognitive load from voice
  recommendations: string[]
  timestamp: number
}

export class VoiceAnalyzer {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private microphone: MediaStreamAudioSourceNode | null = null
  private dataArray: Uint8Array | null = null
  private isAnalyzing = false
  private baselinePitch = 150 // Hz baseline
  private baselineVolume = 0.3
  private recentAnalyses: VoiceAnalysisResult[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudioContext()
    }
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 2048
      const bufferLength = this.analyser.frequencyBinCount
      this.dataArray = new Uint8Array(bufferLength)
    } catch (error) {
      console.warn('Voice analysis not available:', error)
    }
  }

  async startAnalysis(): Promise<boolean> {
    if (!this.audioContext || !this.analyser || this.isAnalyzing) {
      return false
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
      this.microphone = this.audioContext.createMediaStreamSource(stream)
      this.microphone.connect(this.analyser)
      this.isAnalyzing = true
      
      console.log('🎤 Voice analysis started')
      return true
    } catch (error) {
      console.error('Failed to start voice analysis:', error)
      return false
    }
  }

  stopAnalysis() {
    if (this.microphone) {
      this.microphone.disconnect()
      this.microphone = null
    }
    this.isAnalyzing = false
    console.log('🎤 Voice analysis stopped')
  }

  getCurrentMetrics(): VoiceMetrics | null {
    if (!this.analyser || !this.dataArray || !this.isAnalyzing) {
      return null
    }

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(dataArray)
    
    // Calculate volume (RMS)
    const volume = this.calculateVolume(dataArray)
    
    // Estimate pitch using autocorrelation
    const pitch = this.estimatePitch(dataArray)
    
    // Analyze frequency distribution for stress indicators
    const stressIndicators = this.calculateStressIndicators(dataArray, pitch, volume)
    
    // Estimate clarity from high-frequency content
    const clarity = this.calculateClarity(dataArray)
    
    // Determine emotional tone
    const emotionalTone = this.determineEmotionalTone(pitch, volume, stressIndicators)
    
    // Mock tempo and pause frequency (would need speech recognition for real implementation)
    const tempo = this.estimateTempo(volume)
    const pauseFrequency = this.estimatePauseFrequency(volume)
    
    return {
      pitch,
      tempo,
      volume,
      pauseFrequency,
      stressIndicators,
      clarity,
      emotionalTone,
      confidence: volume > 0.1 ? 0.8 : 0.3  // Higher confidence when actually speaking
    }
  }

  private calculateVolume(dataArray: Uint8Array): number {
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i]
    }
    const rms = Math.sqrt(sum / dataArray.length) / 255
    return Math.min(1, rms * 3) // Normalize and boost sensitivity
  }

  private estimatePitch(dataArray: Uint8Array): number {
    // Simple pitch estimation using peak detection
    let maxIndex = 0
    let maxValue = 0
    
    // Focus on human voice frequency range (80-300 Hz)
    const minIndex = Math.floor(80 * dataArray.length / 22050)
    const maxIndexRange = Math.floor(300 * dataArray.length / 22050)
    
    for (let i = minIndex; i < Math.min(maxIndexRange, dataArray.length); i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i]
        maxIndex = i
      }
    }
    
    // Convert index to frequency
    const frequency = maxIndex * 22050 / dataArray.length
    return Math.max(80, Math.min(300, frequency))
  }

  private calculateStressIndicators(dataArray: Uint8Array, pitch: number, volume: number): number {
    if (volume < 0.1) return 0 // Not speaking
    
    let stressScore = 0
    
    // High pitch indicates stress
    if (pitch > this.baselinePitch + 30) {
      stressScore += 0.3
    }
    
    // High volume can indicate stress
    if (volume > this.baselineVolume + 0.3) {
      stressScore += 0.2
    }
    
    // Frequency distribution analysis - stress often shows in high frequencies
    let highFreqEnergy = 0
    const highFreqStart = Math.floor(dataArray.length * 0.7)
    for (let i = highFreqStart; i < dataArray.length; i++) {
      highFreqEnergy += dataArray[i]
    }
    highFreqEnergy /= (dataArray.length - highFreqStart)
    
    if (highFreqEnergy > 50) {
      stressScore += 0.3
    }
    
    // Voice tremor detection (rapid variations)
    let variation = 0
    for (let i = 1; i < Math.min(100, dataArray.length); i++) {
      variation += Math.abs(dataArray[i] - dataArray[i-1])
    }
    variation /= 99
    
    if (variation > 30) {
      stressScore += 0.2
    }
    
    return Math.min(1, stressScore)
  }

  private calculateClarity(dataArray: Uint8Array): number {
    // Measure overall spectral clarity
    let totalEnergy = 0
    let peakEnergy = 0
    
    for (let i = 0; i < dataArray.length; i++) {
      totalEnergy += dataArray[i]
      peakEnergy = Math.max(peakEnergy, dataArray[i])
    }
    
    const avgEnergy = totalEnergy / dataArray.length
    const clarity = peakEnergy > 0 ? (avgEnergy / peakEnergy) : 0
    
    return Math.min(1, clarity * 2)
  }

  private determineEmotionalTone(pitch: number, volume: number, stress: number): VoiceMetrics['emotionalTone'] {
    if (volume < 0.1) return 'neutral' // Not speaking
    
    if (stress > 0.6) return 'stressed'
    if (pitch > this.baselinePitch + 20 && volume > 0.6) return 'excited'
    if (pitch < this.baselinePitch - 20 && volume < 0.4) return 'tired'
    if (stress < 0.3 && pitch <= this.baselinePitch + 10) return 'calm'
    
    return 'neutral'
  }

  private estimateTempo(volume: number): number {
    // Simple tempo estimation based on volume changes
    // In real implementation, this would use speech recognition
    if (volume < 0.1) return 0
    
    // Estimate based on volume variability
    const baselineWPM = 150 // Average speaking rate
    const volumeMultiplier = Math.max(0.5, Math.min(2, volume * 2))
    
    return baselineWPM * volumeMultiplier
  }

  private estimatePauseFrequency(volume: number): number {
    // Estimate pauses per minute based on volume patterns
    if (volume < 0.1) return 0
    
    // Normal speaking has 10-20 pauses per minute
    const basePauses = 15
    const stressFactor = volume > 0.7 ? 1.5 : 1 // More pauses when stressed
    
    return basePauses * stressFactor
  }

  analyzeForCognitiveLoad(): number {
    const metrics = this.getCurrentMetrics()
    if (!metrics || metrics.volume < 0.1) {
      return 0 // No voice input
    }

    let cognitiveLoad = 0
    
    // Stress indicators contribute most
    cognitiveLoad += metrics.stressIndicators * 0.4
    
    // High tempo indicates mental pressure
    if (metrics.tempo > 180) {
      cognitiveLoad += 0.2
    }
    
    // Frequent pauses indicate processing difficulty
    if (metrics.pauseFrequency > 20) {
      cognitiveLoad += 0.2
    }
    
    // Low clarity indicates fatigue
    if (metrics.clarity < 0.5) {
      cognitiveLoad += 0.1
    }
    
    // Emotional tone adjustments
    switch (metrics.emotionalTone) {
      case 'stressed':
        cognitiveLoad += 0.3
        break
      case 'tired':
        cognitiveLoad += 0.2
        break
      case 'calm':
        cognitiveLoad *= 0.7 // Reduce load for calm state
        break
    }
    
    return Math.min(1, cognitiveLoad)
  }

  getAnalysisResult(): VoiceAnalysisResult | null {
    const metrics = this.getCurrentMetrics()
    if (!metrics) return null
    
    const cognitiveLoad = this.analyzeForCognitiveLoad()
    const recommendations: string[] = []
    
    // Generate recommendations based on analysis
    if (metrics.stressIndicators > 0.6) {
      recommendations.push('Take slow, deep breaths to reduce vocal tension')
    }
    
    if (metrics.volume > 0.8) {
      recommendations.push('Try lowering your speaking volume')
    }
    
    if (metrics.tempo > 200) {
      recommendations.push('Consider slowing down your speech rate')
    }
    
    if (metrics.clarity < 0.4) {
      recommendations.push('Focus on clear pronunciation - fatigue detected')
    }
    
    if (metrics.emotionalTone === 'stressed') {
      recommendations.push('Voice patterns indicate stress - consider a break')
    }
    
    const result: VoiceAnalysisResult = {
      metrics,
      cognitiveLoad,
      recommendations,
      timestamp: Date.now()
    }
    
    // Store for trend analysis
    this.recentAnalyses.push(result)
    if (this.recentAnalyses.length > 20) {
      this.recentAnalyses.shift()
    }
    
    return result
  }

  // Get voice-based stress trend over recent period
  getStressTrend(): 'improving' | 'stable' | 'declining' {
    if (this.recentAnalyses.length < 5) return 'stable'
    
    const recent = this.recentAnalyses.slice(-5)
    const older = this.recentAnalyses.slice(-10, -5)
    
    if (older.length === 0) return 'stable'
    
    const recentAvg = recent.reduce((sum, r) => sum + r.metrics.stressIndicators, 0) / recent.length
    const olderAvg = older.reduce((sum, r) => sum + r.metrics.stressIndicators, 0) / older.length
    
    const difference = recentAvg - olderAvg
    
    if (difference < -0.1) return 'improving'
    if (difference > 0.1) return 'declining'
    return 'stable'
  }

  // Calibrate baseline from current metrics
  updateBaseline() {
    const metrics = this.getCurrentMetrics()
    if (metrics && metrics.volume > 0.2) {
      this.baselinePitch = (this.baselinePitch * 0.9) + (metrics.pitch * 0.1)
      this.baselineVolume = (this.baselineVolume * 0.9) + (metrics.volume * 0.1)
      console.log(`🎤 Baseline updated - Pitch: ${this.baselinePitch.toFixed(1)}Hz, Volume: ${this.baselineVolume.toFixed(2)}`)
    }
  }
}