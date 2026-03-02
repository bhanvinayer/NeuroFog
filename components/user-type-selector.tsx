'use client'

import { useNeuroFog } from '@/components/neurofog-provider'
import { useState } from 'react'

type UserType = 'developer' | 'student' | 'creator'

interface UserTypeSelector {
  isOpen: boolean
  onClose: () => void
}

const USER_TYPES = {
  developer: {
    icon: '💻',
    title: 'Developer',
    description: 'Code-focused stress relief with mindful programming exercises',
    benefits: ['Code meditation sessions', 'Debug stress relief', 'Productivity herbs', 'Burnout prevention'],
    stressPatterns: ['Tab switching overload', 'Complex problem solving', 'Code review anxiety', 'Imposter syndrome']
  },
  student: {
    icon: '📚',
    title: 'Student',
    description: 'Study-optimized techniques for learning and retention',
    benefits: ['Focus flowers for concentration', 'Memory enhancement', 'Exam stress relief', 'Learning optimization'],
    stressPatterns: ['Information overload', 'Deadline pressure', 'Test anxiety', 'Procrastination cycles']
  },
  creator: {
    icon: '🎨',
    title: 'Creator',
    description: 'Creative flow enhancement and artistic inspiration',
    benefits: ['Creativity vines', 'Flow state activation', 'Artist block relief', 'Inspiration cultivation'],
    stressPatterns: ['Creative blocks', 'Perfectionism', 'Criticism sensitivity', 'Inspiration drought']
  }
}

export function UserTypeSelector({ isOpen, onClose }: UserTypeSelector) {
  const { userType, setUserType } = useNeuroFog()
  const [selectedType, setSelectedType] = useState<UserType>(userType)

  const handleSelect = (type: UserType) => {
    setSelectedType(type)
    setUserType(type)
    setTimeout(() => onClose(), 500) // Small delay to show selection
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Personalize Your NeuroGarden</h2>
          <p className="text-muted-foreground">Choose your profile for customized stress relief activities</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {(Object.entries(USER_TYPES) as [UserType, typeof USER_TYPES[UserType]][]).map(([type, config]) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                selectedType === type
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border hover:border-primary/50 bg-card hover:bg-accent/20'
              }`}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{config.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">{config.title}</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {config.description}
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-2">
                    Garden Benefits
                  </h4>
                  <div className="space-y-1">
                    {config.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-2">
                    Stress Patterns Detected
                  </h4>
                  <div className="space-y-1">
                    {config.stressPatterns.map((pattern, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1 h-1 bg-orange-400 rounded-full" />
                        {pattern}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedType === type && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    <span>✓</span>
                    Selected
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/60 mb-4">
            You can change this anytime in your settings. Your garden will adapt to your new preferences.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}