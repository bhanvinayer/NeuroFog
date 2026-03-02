'use client'

import { useNeuroFog } from './neurofog-provider'
import { getPersonalizationProfile } from '@/lib/personalization'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { AlertCircle, Mic, MicOff, Settings, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export function VoiceAnalysisWidget() {
  const { 
    userType, 
    isVoiceEnabled, 
    voiceMetrics, 
    voiceAnalysisResult,
    toggleVoiceAnalysis,
    calibrateVoice 
  } = useNeuroFog()
  
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [recentStress, setRecentStress] = useState<number[]>([])
  const profile = getPersonalizationProfile(userType)

  // Track stress over time for mini-chart
  useEffect(() => {
    if (voiceMetrics && isVoiceEnabled) {
      setRecentStress(prev => {
        const newStress = [...prev, voiceMetrics.stressIndicators]
        return newStress.slice(-20) // Keep last 20 readings
      })
    }
  }, [voiceMetrics, isVoiceEnabled])

  const getEmotionalStateIcon = (tone: string) => {
    switch (tone) {
      case 'calm': return <span className="text-green-500">😌</span>
      case 'neutral': return <span className="text-gray-500">😐</span>
      case 'stressed': return <span className="text-red-500">😰</span>
      case 'excited': return <span className="text-orange-500">🤩</span>
      case 'tired': return <span className="text-blue-500">😴</span>
      default: return <span className="text-gray-400">❓</span>
    }
  }

  const getStressLevelColor = (stress: number) => {
    if (stress < 0.3) return 'bg-green-500'
    if (stress < 0.6) return 'bg-yellow-500'
    if (stress < 0.8) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getUserSpecificGuidance = () => {
    if (!voiceMetrics || !isVoiceEnabled) return null
    
    const stress = voiceMetrics.stressIndicators
    
    switch (userType) {
      case 'developer':
        if (stress > 0.6) return "High stress detected - consider rubber duck debugging or a brief walk"
        if (voiceMetrics.tempo > 200) return "Speaking quickly - you might be in problem-solving mode"
        if (voiceMetrics.emotionalTone === 'tired') return "Voice fatigue detected - time for a coffee break?"
        return "Voice patterns normal for coding sessions"
        
      case 'student':
        if (stress > 0.5) return "Presentation nerves? Try deep breathing exercises"
        if (voiceMetrics.clarity < 0.4) return "Speech clarity low - take a moment to articulate clearly"
        if (voiceMetrics.pauseFrequency > 25) return "Many pauses detected - you might be thinking through complex concepts"
        return "Good vocal confidence for learning"
        
      case 'creator':
        if (stress > 0.7) return "Creative tension high - channel this energy into your work"
        if (voiceMetrics.emotionalTone === 'excited') return "Excited voice detected - great for brainstorming!"
        if (voiceMetrics.volume > 0.8) return "High energy voice - perfect for creative collaboration"
        return "Voice patterns support creative flow"
        
      default:
        return "Voice analysis active"
    }
  }

  return (
    <Card className="p-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${profile.primaryColor}15` }}>
            {isVoiceEnabled ? (
              <Mic className="w-5 h-5" style={{ color: profile.primaryColor }} />
            ) : (
              <MicOff className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">Voice Analysis</h3>
            <p className="text-sm text-gray-600">
              {userType === 'developer' && 'Debug calls & meetings'}
              {userType === 'student' && 'Study sessions & presentations'}
              {userType === 'creator' && 'Creative expression tracking'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isVoiceEnabled && (
            <Badge variant="outline" className="text-green-600 border-green-600 animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Live
            </Badge>
          )}
          <Button
            onClick={toggleVoiceAnalysis}
            variant={isVoiceEnabled ? "destructive" : "default"}
            size="sm"
          >
            {isVoiceEnabled ? 'Stop' : 'Start'}
          </Button>
        </div>
      </div>

      {/* Voice metrics display */}
      {isVoiceEnabled && voiceMetrics ? (
        <div className="space-y-6">
          {/* Current emotional state */}
          <div className="flex items-center justify-between p-4 rounded-lg"
               style={{ backgroundColor: `${profile.primaryColor}08` }}>
            <div className="flex items-center gap-3">
              {getEmotionalStateIcon(voiceMetrics.emotionalTone)}
              <div>
                <div className="font-medium capitalize">
                  {voiceMetrics.emotionalTone}
                </div>
                <div className="text-sm text-gray-600">
                  Current vocal state
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold"
                   style={{ color: profile.primaryColor }}>
                {(voiceMetrics.confidence * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">
                Confidence
              </div>
            </div>
          </div>

          {/* Stress level with mini trend */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Voice Stress Level</span>
              <span className="text-sm text-gray-600">
                {(voiceMetrics.stressIndicators * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="relative">
              <Progress 
                value={voiceMetrics.stressIndicators * 100} 
                className="h-3 mb-2" 
              />
              
              {/* Mini stress trend chart */}
              {recentStress.length > 5 && (
                <div className="flex items-end gap-1 h-8">
                  {recentStress.map((stress, index) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-sm transition-all ${getStressLevelColor(stress)}`}
                      style={{ height: `${Math.max(2, stress * 100)}%` }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {voiceMetrics.stressIndicators > 0.6 && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-orange-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-700">
                  {getUserSpecificGuidance()}
                </span>
              </div>
            )}
          </div>

          {/* Quick metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold"
                   style={{ color: profile.primaryColor }}>
                {voiceMetrics.pitch.toFixed(0)}
              </div>
              <div className="text-xs text-gray-600">Hz Pitch</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold"
                   style={{ color: profile.primaryColor }}>
                {voiceMetrics.tempo.toFixed(0)}
              </div>
              <div className="text-xs text-gray-600">WPM</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold"
                   style={{ color: profile.primaryColor }}>
                {(voiceMetrics.clarity * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Clarity</div>
            </div>
          </div>

          {/* Advanced controls */}
          <div className="border-t pt-4">
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="ghost"
              size="sm"
              className="w-full mb-3"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
            
            {showAdvanced && (
              <div className="space-y-3">
                <Button 
                  onClick={calibrateVoice} 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  Calibrate Voice Baseline
                </Button>
                
                {/* Detailed metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">Volume</div>
                    <div>{(voiceMetrics.volume * 100).toFixed(0)}%</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">Pauses/min</div>
                    <div>{voiceMetrics.pauseFrequency.toFixed(0)}</div>
                  </div>
                </div>
                
                {/* Voice recommendations */}
                {voiceAnalysisResult?.recommendations && voiceAnalysisResult.recommendations.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm text-blue-900 mb-2">
                      Voice Recommendations:
                    </div>
                    <ul className="text-xs text-blue-800 space-y-1">
                      {voiceAnalysisResult.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Voice disabled state */
        <div className="text-center py-8">
          <Mic className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Voice Analysis Disabled
            </h4>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              {userType === 'developer' && 'Enable to track stress during calls, code reviews, and debugging sessions.'}
              {userType === 'student' && 'Enable to monitor confidence during presentations and study sessions.'}
              {userType === 'creator' && 'Enable to analyze creative expression and ideation patterns.'}
            </p>
          </div>
          
          {/* Permission help */}
          <div className="text-xs text-gray-400 max-w-sm mx-auto">
            Click "Start" to enable voice analysis. Your browser may request microphone permission.
            All voice data is processed locally and never stored or transmitted.
          </div>
        </div>
      )}
    </Card>
  )
}