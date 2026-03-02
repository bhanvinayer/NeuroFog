'use client'

import { useState, useEffect } from 'react'
import { NeuroFogProvider, useNeuroFog } from '@/components/neurofog-provider'
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

function DashboardContent() {
  const { isGardenActive, userType, deactivateGarden } = useNeuroFog()
  const [showTutorial, setShowTutorial] = useState(false)
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false)
  const [isClient, setIsClient] = useState(false)

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
    <div className="min-h-screen bg-background">
      {/* Tutorial Modal */}
      <NeuroFogTutorial 
        isOpen={showTutorial}
        onClose={handleTutorialClose}
      />

      {/* Help Icon - Tutorial Access */}
      <button
        onClick={() => setShowTutorial(true)}
        className="fixed top-4 right-4 z-40 w-10 h-10 bg-primary/90 hover:bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Show tutorial"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

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
          {/* Header */}
          <DashboardHeader />

          {/* Controls bar */}
          <div className="mt-6">
            <TrackingControls />
          </div>

          {/* Main dashboard grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left column - CFI Gauge */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <CFIGauge />
              </div>

              {/* Garden Status Widget */}
              <GardenStatus />

              {/* Metrics below garden */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <MetricsPanel />
              </div>
            </div>

            {/* Center column - Timeline + Typing */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <CognitiveTimeline />
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <TypingArea />
              </div>
            </div>

            {/* Right column - Compass + Reflection + Settings */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <CognitiveCompass />
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <ReflectionPrompt />
              </div>

              {/* User Type Quick Switch */}
              <div className="rounded-2xl border border-border/50 bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile</span>
                  <button
                    onClick={() => setShowUserTypeSelector(true)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {userType === 'developer' && '💻'}
                    {userType === 'student' && '📚'}
                    {userType === 'creator' && '🎨'}
                  </span>
                  <span className="text-sm capitalize text-muted-foreground">{userType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-10 flex flex-col items-center gap-2 border-t border-border/30 pt-6 pb-8">
            <p className="text-[11px] text-muted-foreground/40">
              NeuroFog + NeuroGarden — A personalized cognitive wellness system for Mindcode 2026
            </p>
            <p className="text-[10px] text-muted-foreground/30">
              Privacy-first: All data stays in your browser. No cloud storage. No profiling.
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
