'use client'

import { NeuroFogProvider } from '@/components/neurofog-provider'
import { DashboardHeader } from '@/components/dashboard-header'
import { CFIGauge } from '@/components/cfi-gauge'
import { CognitiveCompass } from '@/components/cognitive-compass'
import { CognitiveTimeline } from '@/components/cognitive-timeline'
import { NeuroPatch } from '@/components/neuropatch'
import { ReflectionPrompt } from '@/components/reflection-prompt'
import { MetricsPanel } from '@/components/metrics-panel'
import { TrackingControls } from '@/components/tracking-controls'
import { TypingArea } from '@/components/typing-area'

export default function Page() {
  return (
    <NeuroFogProvider>
      <div className="min-h-screen bg-background">
        {/* NeuroPatch overlay */}
        <NeuroPatch />

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
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <CFIGauge />
              </div>

              {/* Metrics below gauge */}
              <div className="mt-6 rounded-2xl border border-border/50 bg-card p-6">
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

            {/* Right column - Compass + Reflection */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <CognitiveCompass />
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <ReflectionPrompt />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-10 flex flex-col items-center gap-2 border-t border-border/30 pt-6 pb-8">
            <p className="text-[11px] text-muted-foreground/40">
              NeuroFog — A cognitive health system for Mindcode 2026
            </p>
            <p className="text-[10px] text-muted-foreground/30">
              Privacy-first: All data stays in your browser. No cloud storage. No profiling.
            </p>
          </footer>
        </main>
      </div>
    </NeuroFogProvider>
  )
}
