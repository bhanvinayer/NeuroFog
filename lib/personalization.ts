'use client'

export type UserType = 'developer' | 'student' | 'creator'

export interface PersonalizationProfile {
  name: string
  emoji: string
  primaryColor: string
  accentColor: string
  bgGradient: string
  
  // Tracking priorities - which signals matter most for this user type
  trackingPriorities: {
    voice: number         // 0-1 importance
    typing: number
    mouse: number
    breaks: number
    focus: number
  }
  
  // CFI calculation weights (different for each user type)
  cfiWeights: {
    voiceStress: number
    typingVariability: number
    mouseErratic: number
    tabSwitching: number
    microPauses: number
  }
  
  // Intervention thresholds
  interventionThresholds: {
    garden: number        // CFI level to trigger NeuroGarden
    patch: number         // CFI level to trigger NeuroPatch
    voiceAlert: number    // Voice stress level to trigger alerts
  }
  
  // Personalized features
  features: {
    codeAnalysis?: boolean       // For developers
    commitTracking?: boolean     // For developers
    focusTimers?: boolean        // For students
    studyBreaks?: boolean        // For students
    inspirationMode?: boolean    // For creators
    creativityTracking?: boolean // For creators
    voiceJournaling?: boolean    // Available for all
    biometricFeedback?: boolean  // Enhanced for all
  }
  
  // Customized interventions
  interventions: {
    gardenActivities: string[]
    patchExercises: string[]
    voiceGuidance: string[]
    motivationalMessages: string[]
  }
  
  // Analytics focus
  analyticsViews: string[]
}

export const PERSONALIZATION_PROFILES: Record<UserType, PersonalizationProfile> = {
  developer: {
    name: 'Developer',
    emoji: '💻',
    primaryColor: '#3b82f6', // Blue
    accentColor: '#1d4ed8',
    bgGradient: 'from-slate-950 to-gray-950',
    
    trackingPriorities: {
      voice: 0.8,    // High - important for dev calls/meetings
      typing: 1.0,   // Highest - core activity
      mouse: 0.9,    // High - constant interaction
      breaks: 0.9,   // High - prevent burnout
      focus: 1.0     // Highest - deep work essential
    },
    
    cfiWeights: {
      voiceStress: 0.25,
      typingVariability: 0.3,  // Key indicator for devs
      mouseErratic: 0.2,
      tabSwitching: 0.15,      // Important for context switching
      microPauses: 0.1
    },
    
    interventionThresholds: {
      garden: 35,      // Early intervention
      patch: 65,       // Before critical
      voiceAlert: 0.6  // Moderate voice stress
    },
    
    features: {
      codeAnalysis: true,
      commitTracking: true,
      voiceJournaling: true,
      biometricFeedback: true
    },
    
    interventions: {
      gardenActivities: [
        'Debug Duck Meditation', 
        'Code Review Breathing', 
        'Variable Naming Zen',
        'Algorithm Visualization',
        'Refactoring Reflection'
      ],
      patchExercises: [
        'Programmer Posture Reset',
        'Eye Strain Relief',
        'Wrist Stretch Sequence',
        'Deep Debugging Breath',
        'Mental Stack Overflow Recovery'
      ],
      voiceGuidance: [
        'Explain your current problem out loud',
        'Practice rubber duck debugging',
        'Describe the ideal solution',
        'Verbalize your next three steps'
      ],
      motivationalMessages: [
        'Great code is written, not just typed',
        'Every bug is a learning opportunity',
        'Clean code starts with a clear mind',
        'The best developers know when to rest'
      ]
    },
    
    analyticsViews: [
      'Code Session Intensity',
      'Debugging Stress Patterns',
      'Focus Deep Dive Analysis',
      'Commit Frequency vs Stress',
      'Voice Stress During Meetings'
    ]
  },

  student: {
    name: 'Student',
    emoji: '📚',
    primaryColor: '#10b981', // Green
    accentColor: '#047857',
    bgGradient: 'from-slate-950 to-zinc-950',
    
    trackingPriorities: {
      voice: 0.6,    // Medium - for study sessions/presentations
      typing: 0.8,   // High - note-taking, essays
      mouse: 0.7,    // Medium-high - research, navigation
      breaks: 1.0,   // Highest - critical for learning
      focus: 0.9     // Very high - sustained attention
    },
    
    cfiWeights: {
      voiceStress: 0.2,
      typingVariability: 0.25,
      mouseErratic: 0.25,
      tabSwitching: 0.2,       // Research behavior
      microPauses: 0.1
    },
    
    interventionThresholds: {
      garden: 30,      // Earlier intervention for learning
      patch: 60,       // Prevent study burnout
      voiceAlert: 0.5  // Lower threshold for presentations
    },
    
    features: {
      focusTimers: true,
      studyBreaks: true,
      voiceJournaling: true,
      biometricFeedback: true
    },
    
    interventions: {
      gardenActivities: [
        'Knowledge Tree Growth',
        'Memory Palace Building',
        'Concept Connection Web',
        'Learning Path Visualization',
        'Academic Goal Setting'
      ],
      patchExercises: [
        'Study Posture Reset',
        'Reading Eye Exercises',
        'Note-taking Hand Stretches',
        'Memory Consolidation Breath',
        'Pre-exam Calm Sequence'
      ],
      voiceGuidance: [
        'Explain the concept you just learned',
        'Summarize the main points aloud',
        'Ask yourself questions about the material',
        'Practice presenting your ideas clearly'
      ],
      motivationalMessages: [
        'Learning is a marathon, not a sprint',
        'Every question leads to understanding',
        'Your brain needs rest to retain knowledge',
        'Curiosity is your greatest tool'
      ]
    },
    
    analyticsViews: [
      'Study Session Performance',
      'Learning Retention Patterns',
      'Focus Duration Trends',
      'Break Effectiveness Analysis',
      'Presentation Stress Tracking'
    ]
  },

  creator: {
    name: 'Creator',
    emoji: '🎨',
    primaryColor: '#f59e0b', // Amber
    accentColor: '#d97706',
    bgGradient: 'from-gray-950 to-slate-950',
    
    trackingPriorities: {
      voice: 0.9,    // Very high - recordings, calls, ideation
      typing: 0.7,   // Medium-high - content creation
      mouse: 0.8,    // High - design, editing
      breaks: 0.8,   // High - inspiration needs space
      focus: 0.9     // Very high - flow state important
    },
    
    cfiWeights: {
      voiceStress: 0.3,        // Higher weight for creators
      typingVariability: 0.2,
      mouseErratic: 0.2,
      tabSwitching: 0.15,      // Context switching for research
      microPauses: 0.15        // Important for ideation
    },
    
    interventionThresholds: {
      garden: 40,      // Allow some creative tension
      patch: 70,       // Higher tolerance for flow state
      voiceAlert: 0.7  // Higher threshold - creators use voice more
    },
    
    features: {
      inspirationMode: true,
      creativityTracking: true,
      voiceJournaling: true,
      biometricFeedback: true
    },
    
    interventions: {
      gardenActivities: [
        'Creative Flow Meditation',
        'Inspiration Gathering',
        'Artistic Vision Quest',
        'Color Therapy Garden',
        'Muse Connection Ritual'
      ],
      patchExercises: [
        'Creative Block Breaker',
        'Artist Hand Care',
        'Vision Board Breathing',
        'Inspiration Activation',
        'Flow State Preparation'
      ],
      voiceGuidance: [
        'Describe your creative vision out loud',
        'Voice memo your spontaneous ideas',
        'Narrate your creative process',
        'Practice pitching your concept'
      ],
      motivationalMessages: [
        'Creativity flows when the mind is calm',
        'Every masterpiece started with an idea',
        'Your unique perspective matters',
        'Innovation happens at the edge of comfort'
      ]
    },
    
    analyticsViews: [
      'Creative Flow Analysis',
      'Inspiration Peak Times',
      'Voice Ideation Patterns',
      'Creative Block Detection',
      'Productivity vs Innovation Balance'
    ]
  }
}

export function getPersonalizationProfile(userType: UserType): PersonalizationProfile {
  return PERSONALIZATION_PROFILES[userType]
}

// Calculate personalized CFI based on user type
export function calculatePersonalizedCFI(
  baseCfi: number,
  voiceStress: number,
  signals: any,
  userType: UserType
): number {
  const profile = getPersonalizationProfile(userType)
  const weights = profile.cfiWeights
  
  // Apply user-specific weights to different signals
  let personalizedCfi = baseCfi * 0.5 // Base contribution
  
  // Add weighted contributions
  personalizedCfi += voiceStress * weights.voiceStress * 100
  personalizedCfi += signals.typingVariability * weights.typingVariability * 50
  personalizedCfi += signals.mouseVariability * weights.mouseErratic * 30
  personalizedCfi += (signals.tabSwitches / 10) * weights.tabSwitching * 20
  personalizedCfi += (signals.microPauses / 5) * weights.microPauses * 15
  
  return Math.min(100, Math.max(0, personalizedCfi))
}

// Get personalized recommendations based on current state and user type
export function getPersonalizedRecommendations(
  cfi: number,
  voiceStress: number,
  userType: UserType
): string[] {
  const profile = getPersonalizationProfile(userType)
  const recommendations: string[] = []
  
  if (cfi >= profile.interventionThresholds.garden) {
    recommendations.push(`Try ${profile.interventions.gardenActivities[0]}`)
  }
  
  if (voiceStress >= profile.interventionThresholds.voiceAlert) {
    recommendations.push(profile.interventions.voiceGuidance[0])
  }
  
  if (cfi >= profile.interventionThresholds.patch) {
    recommendations.push(`Time for: ${profile.interventions.patchExercises[0]}`)
  }
  
  // Add motivational message
  const randomMessage = profile.interventions.motivationalMessages[
    Math.floor(Math.random() * profile.interventions.motivationalMessages.length)
  ]
  recommendations.push(randomMessage)
  
  return recommendations
}

// Get user-specific tracking focus
export function getTrackingFocus(userType: UserType): string[] {
  const profile = getPersonalizationProfile(userType)
  const priorities = profile.trackingPriorities
  
  return Object.entries(priorities)
    .sort(([,a], [,b]) => b - a) // Sort by importance
    .slice(0, 3) // Top 3
    .map(([key]) => key)
}