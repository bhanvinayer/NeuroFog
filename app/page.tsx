'use client'

import { useState, useEffect } from 'react'
import { NeuroFogProvider, useNeuroFog } from '@/components/neurofog-provider'
import { getPersonalizationProfile } from '@/lib/personalization'
import { DashboardHeader } from '@/components/dashboard-header'
import { CFIGauge } from '@/components/cfi-gauge'
import { CognitiveCompass } from '@/components/cognitive-compass'
import { CognitiveTimeline } from '@/components/cognitive-timeline'
import { NeuroPatch } from '@/components/neuropatch'
import { NeuroGarden } from '@/components/neurogarden'
import { UserTypeSelector } from '@/components/user-type-selector'
import { NeuroFogTutorial } from '@/components/neurofog-tutorial'
import { GardenStatus } from '@/components/garden-status'
import { ReflectionPrompt } from '@/components/reflection-prompt'
import { MetricsPanel } from '@/components/metrics-panel'
import { TrackingControls } from '@/components/tracking-controls'
import { TypingArea } from '@/components/typing-area'
import { VoiceAnalysisWidget } from '@/components/voice-analysis-widget'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function DashboardContent() {
  const { 
    isGardenActive, 
    userType, 
    deactivateGarden, 
    personalizedCfi,
    personalizedRecommendations,
    trackingFocus,
    isVoiceEnabled,
    toggleVoiceAnalysis
  } = useNeuroFog()
  
  const [showTutorial, setShowTutorial] = useState(false)
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  const profile = getPersonalizationProfile(userType)

  // Ensure we're on the client side before accessing localStorage
  useEffect(() => {
    setIsClient(true)
    
    // Immediately check localStorage when client is ready
    const hasSeenTutorial = localStorage.getItem('neurofog_tutorial_completed')
    const hasSeenUserTypeSelector = localStorage.getItem('neurofog_user_type_selected')
    
    if (hasSeenTutorial === null) {
      setShowTutorial(true)
    } else if (hasSeenUserTypeSelector === null) {
      setShowUserTypeSelector(true)
    }
  }, [])

  const handleTutorialClose = () => {
    setShowTutorial(false)
    localStorage.setItem('neurofog_tutorial_completed', 'true')
    
    // Show user type selector after tutorial
    const hasSeenUserTypeSelector = localStorage.getItem('neurofog_user_type_selected')
    if (!hasSeenUserTypeSelector) {
      setShowUserTypeSelector(true)
    }
  }

  const handleUserTypeClose = () => {
    setShowUserTypeSelector(false)
    localStorage.setItem('neurofog_user_type_selected', 'true')
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${profile.bgGradient}`}>
      {/* Tutorial Modal */}
      <NeuroFogTutorial 
        isOpen={showTutorial}
        onClose={handleTutorialClose}
      />

      {/* Personalized Header */}
      <div className="border-b"
           style={{ backgroundColor: `${profile.primaryColor}10`, borderColor: `${profile.primaryColor}20` }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl">{profile.emoji}</span>
              <div>
                <h1 className="text-xl font-bold"
                    style={{ color: profile.primaryColor }}>
                  NeuroFog for {profile.name}s
                </h1>
                <div className="flex gap-2 mt-1">
                  {trackingFocus.slice(0, 3).map((focus, index) => (
                    <Badge 
                      key={focus} 
                      variant="outline"
                      className="text-xs"
                      style={{ 
                        borderColor: index === 0 ? profile.accentColor : profile.primaryColor + '40',
                        color: index === 0 ? profile.accentColor : profile.primaryColor
                      }}
                    >
                      {focus}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Voice toggle */}
              <Button
                onClick={toggleVoiceAnalysis}
                variant={isVoiceEnabled ? "default" : "outline"}
                size="sm"
                style={isVoiceEnabled ? { 
                  backgroundColor: profile.primaryColor, 
                  borderColor: profile.primaryColor 
                } : {
                  borderColor: profile.primaryColor,
                  color: profile.primaryColor
                }}
              >
                🎤 {isVoiceEnabled ? 'Voice On' : 'Voice Off'}
              </Button>
              
              {/* Help Icon - Tutorial Access */}
              <button
                onClick={() => setShowTutorial(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: `${profile.primaryColor}90` }}
                aria-label="Show tutorial"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Personalized status bar */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {userType === 'developer' && `Code Stress: ${personalizedCfi.toFixed(1)}`}
                {userType === 'student' && `Study Load: ${personalizedCfi.toFixed(1)}`}
                {userType === 'creator' && `Creative Flow: ${personalizedCfi.toFixed(1)}`}
              </div>
              {personalizedRecommendations.length > 0 && (
                <div className="text-sm"
                     style={{ color: profile.accentColor }}>
                  💡 {personalizedRecommendations[0]}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NeuroGarden overlay */}
      <NeuroGarden 
        isActive={isGardenActive}
        userType={userType}
        onComplete={(effectiveness) => deactivateGarden(effectiveness)}
      />

      {/* NeuroPatch overlay */}
      <NeuroPatch />

      {/* User Type Selector Modal */}
      <UserTypeSelector 
        isOpen={showUserTypeSelector}
        onClose={handleUserTypeClose}
      />

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          {/* Controls bar */}
          <div className="mb-6">
            <TrackingControls />
          </div>

          {/* User-type specific dashboard layout */}
          {userType === 'developer' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left column - CFI + Voice */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6"
                     style={{ borderColor: `${profile.primaryColor}20` }}>
                  <CFIGauge />
                </div>
                <VoiceAnalysisWidget />
                <GardenStatus />
              </div>

              {/* Center column - Timeline + Code Tools */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <CognitiveTimeline />
                </div>
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      💻 Developer Tools
                    </h3>
                  </div>
                  <TypingArea />
                </div>
              </div>

              {/* Right column - Metrics + Reflection */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <CognitiveCompass />
                </div>
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <MetricsPanel />
                </div>
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <ReflectionPrompt />
                </div>
              </div>
            </div>
          )}

          {userType === 'student' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left column - Study metrics */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <CFIGauge />
                </div>
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <MetricsPanel />
                </div>
                <GardenStatus />
              </div>

              {/* Center column - Study session */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <VoiceAnalysisWidget />
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      📚 Study Session
                    </h3>
                  </div>
                  <TypingArea />
                </div>
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <CognitiveTimeline />
                </div>
              </div>

              {/* Right column - Focus tools */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <CognitiveCompass />
                </div>
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <ReflectionPrompt />
                </div>
              </div>
            </div>
          )}

          {userType === 'creator' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left column - Creative flow */}
              <div className="lg:col-span-4 space-y-6">
                <VoiceAnalysisWidget />
                <GardenStatus />
              </div>

              {/* Center column - Creative workspace */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <CFIGauge />
                </div>
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      🎨 Creative Workspace
                    </h3>
                  </div>
                  <TypingArea />
                </div>
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <CognitiveTimeline />
                </div>
              </div>

              {/* Right column - Inspiration */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <CognitiveCompass />
                </div>
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <MetricsPanel />
                </div>
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <ReflectionPrompt />
                </div>
              </div>
            </div>
          )}

          {/* User Type Quick Switch */}
          <div className="mt-6 flex justify-center">
            <div className="rounded-2xl border border-border/50 bg-card p-4"
                 style={{ borderColor: `${profile.primaryColor}20` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile</span>
                <button
                  onClick={() => setShowUserTypeSelector(true)}
                  className="text-xs hover:underline"
                  style={{ color: profile.primaryColor }}
                >
                  Change Type
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{profile.emoji}</span>
                <span className="text-sm capitalize text-muted-foreground">{userType}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-10 flex flex-col items-center gap-2 border-t pt-6 pb-8"
                  style={{ borderColor: `${profile.primaryColor}20` }}>
            <p className="text-[11px] text-muted-foreground/40">
              NeuroFog + NeuroGarden — Personalized cognitive wellness for {profile.name}s • Mindcode 2026
            </p>
            <p className="text-[10px] text-muted-foreground/30">
              Privacy-first: All data stays in your browser. Voice analysis is local. No cloud storage.
            </p>
          </footer>
        </main>
      </div>
    )
}

export default function Page() {
  return (
    <NeuroFogProvider>
      <DashboardContent />
    </NeuroFogProvider>
  )
}
