'use client'

import { useNeuroFog } from '@/components/neurofog-provider'
import { useEffect, useState, useCallback } from 'react'

type UserType = 'developer' | 'student' | 'creator'
type ActivityType = 'plant-seed' | 'water-plants' | 'remove-weeds' | 'code-meditation' | 'study-break' | 'creative-flow' | 
  'breathing-forest' | 'focus-game' | 'sound-therapy' | 'garden-design' | 'team-plant' | 'mindful-watering' | 'stress-storm'
type PlantType = 'focus-flower' | 'energy-tree' | 'calm-succulent' | 'creativity-vine' | 'productivity-herb' | 'wisdom-moss' |
  'zen-bamboo' | 'courage-oak' | 'peace-lily' | 'inspiration-orchid'
type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'misty' | 'aurora' | 'storm' | 'rainbow'
type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlock: () => boolean
  reward: {
    xp: number
    plantType?: PlantType
    gardenTheme?: string
  }
}

interface BiometricData {
  heartRateVariability: number
  breathingRate: number
  stressLevel: number
  focusScore: number
}

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

interface GardenActivity {
  id: string
  type: ActivityType
  name: string
  description: string
  duration: number // seconds
  stressReduction: number // 0-1
  userTypes: UserType[]
  instruction: string
  unlock: {
    level: number
    cfiThreshold?: number
    streakDays?: number
    timeOfDay?: number[] // hours when most effective
    weather?: WeatherType[]
  }
  biometricTarget?: {
    heartRateReduction: number
    breathingRateTarget: number
  }
  rewards: {
    xp: number
    plantUnlock?: PlantType
    achievementId?: string
  }
}

const GARDEN_ACTIVITIES: GardenActivity[] = [
  {
    id: 'plant-focus-seed',
    type: 'plant-seed',
    name: 'Plant Focus Seeds',
    description: 'Mindfully plant seeds to grow your focus',
    duration: 30,
    stressReduction: 0.3,
    userTypes: ['developer', 'student', 'creator'],
    instruction: 'Breathe deeply and imagine planting seeds for better focus. Click to plant each seed mindfully.',
    unlock: { level: 1 },
    rewards: { xp: 50 }
  },
  {
    id: 'breathing-forest',
    type: 'breathing-forest',
    name: 'Breathing Forest',
    description: 'Deep breathing with visual tree growth',
    duration: 60,
    stressReduction: 0.8,
    userTypes: ['developer', 'student', 'creator'],
    instruction: 'Follow the growing trees with your breath. Inhale as they grow, exhale as they sway.',
    unlock: { level: 1, timeOfDay: [9, 14, 18] },
    biometricTarget: { heartRateReduction: 15, breathingRateTarget: 6 },
    rewards: { xp: 80, achievementId: 'forest-master' }
  },
  {
    id: 'code-meditation',
    type: 'code-meditation',
    name: 'Code Meditation',
    description: 'Mindfully type calming code snippets',
    duration: 45,
    stressReduction: 0.4,
    userTypes: ['developer'],
    instruction: 'Type this peaceful code snippet slowly and mindfully, focusing on each keystone.',
    unlock: { level: 2 },
    rewards: { xp: 60, plantUnlock: 'zen-bamboo' }
  },
  {
    id: 'focus-game',
    type: 'focus-game',
    name: 'Garden Focus Game',
    description: 'Train attention with garden-themed mini-games',
    duration: 90,
    stressReduction: 0.5,
    userTypes: ['student'],
    instruction: 'Match the blooming flowers in sequence to strengthen your focus muscles.',
    unlock: { level: 2, weather: ['sunny', 'cloudy'] },
    biometricTarget: { heartRateReduction: 10, breathingRateTarget: 8 },
    rewards: { xp: 75, plantUnlock: 'focus-flower' }
  },
  {
    id: 'sound-therapy',
    type: 'sound-therapy',
    name: 'Garden Sound Therapy',
    description: 'Immersive nature sounds for deep relaxation',
    duration: 120,
    stressReduction: 0.7,
    userTypes: ['developer', 'student', 'creator'],
    instruction: 'Close your eyes and let the garden sounds wash over you. Focus on different layers of sound.',
    unlock: { level: 3, cfiThreshold: 40 },
    biometricTarget: { heartRateReduction: 20, breathingRateTarget: 5 },
    rewards: { xp: 100, achievementId: 'sound-healer' }
  },
  {
    id: 'weed-removal',
    type: 'remove-weeds',
    name: 'Remove Stress Weeds',
    description: 'Clear negative thoughts by removing weeds',
    duration: 40,
    stressReduction: 0.6,
    userTypes: ['developer', 'student', 'creator'],
    instruction: 'Identify stressful thoughts as weeds. Click to remove them and clear your mental space.',
    unlock: { level: 3 },
    rewards: { xp: 70, plantUnlock: 'peace-lily' }
  },
  {
    id: 'garden-design',
    type: 'garden-design',
    name: 'Creative Garden Design',
    description: 'Express creativity through garden layout',
    duration: 150,
    stressReduction: 0.8,
    userTypes: ['creator', 'developer'],
    instruction: 'Design your perfect garden layout. Let creativity flow as you arrange plants and paths.',
    unlock: { level: 4, weather: ['rainbow', 'aurora'] },
    rewards: { xp: 120, plantUnlock: 'inspiration-orchid', achievementId: 'garden-artist' }
  },
  {
    id: 'stress-storm',
    type: 'stress-storm',
    name: 'Weather the Stress Storm',
    description: 'Transform stress into growth through storm visualization',
    duration: 75,
    stressReduction: 0.9,
    userTypes: ['developer', 'student', 'creator'],
    instruction: 'Watch as your garden weathers the storm. See how stress can nurture growth.',
    unlock: { level: 5, cfiThreshold: 25, weather: ['storm'] },
    biometricTarget: { heartRateReduction: 25, breathingRateTarget: 4 },
    rewards: { xp: 150, plantUnlock: 'courage-oak', achievementId: 'storm-weatherer' }
  }
]

const PLANT_TYPES: Record<PlantType, { name: string; emoji: string; benefit: string; userType?: UserType; rarity: 'common' | 'rare' | 'epic' | 'legendary' }> = {
  'focus-flower': { name: 'Focus Flower', emoji: '🌸', benefit: 'Improves concentration', userType: 'student', rarity: 'common' },
  'energy-tree': { name: 'Energy Tree', emoji: '🌳', benefit: 'Boosts energy levels', rarity: 'common' },
  'calm-succulent': { name: 'Calm Succulent', emoji: '🌵', benefit: 'Reduces anxiety', rarity: 'common' },
  'creativity-vine': { name: 'Creativity Vine', emoji: '🌿', benefit: 'Enhances creative thinking', userType: 'creator', rarity: 'common' },
  'productivity-herb': { name: 'Productivity Herb', emoji: '🌱', benefit: 'Increases productivity', userType: 'developer', rarity: 'common' },
  'wisdom-moss': { name: 'Wisdom Moss', emoji: '🍀', benefit: 'Improves learning retention', userType: 'student', rarity: 'rare' },
  'zen-bamboo': { name: 'Zen Bamboo', emoji: '🎋', benefit: 'Deep meditation enhancement', userType: 'developer', rarity: 'rare' },
  'courage-oak': { name: 'Courage Oak', emoji: '🌰', benefit: 'Builds resilience to stress', rarity: 'epic' },
  'peace-lily': { name: 'Peace Lily', emoji: '🕊️', benefit: 'Emotional regulation', rarity: 'rare' },
  'inspiration-orchid': { name: 'Inspiration Orchid', emoji: '🌺', benefit: 'Sparks creative breakthroughs', userType: 'creator', rarity: 'legendary' }
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-seed',
    name: 'First Seed',
    description: 'Plant your first seed in the garden',
    icon: '🌱',
    unlock: () => true,
    reward: { xp: 25, plantType: 'energy-tree' }
  },
  {
    id: 'forest-master',
    name: 'Forest Master',
    description: 'Complete 10 breathing forest sessions',
    icon: '🌲',
    unlock: () => true,
    reward: { xp: 200, gardenTheme: 'enchanted-forest' }
  },
  {
    id: 'stress-warrior',
    name: 'Stress Warrior',
    description: 'Weather 5 stress storms successfully',
    icon: '⚡',
    unlock: () => true,
    reward: { xp: 300, plantType: 'courage-oak' }
  },
  {
    id: 'garden-artist',
    name: 'Garden Artist',
    description: 'Create 3 unique garden designs',
    icon: '🎨',
    unlock: () => true,
    reward: { xp: 250, gardenTheme: 'artistic-paradise' }
  },
  {
    id: 'sound-healer',
    name: 'Sound Healer',
    description: 'Master the art of sound therapy',
    icon: '🎵',
    unlock: () => true,
    reward: { xp: 175, plantType: 'peace-lily' }
  }
]

interface NeuroGardenProps {
  isActive: boolean
  userType: UserType
  onComplete: (effectiveness: number) => void
}

// Helper Functions
const getWeatherGradient = (weather: WeatherType): string => {
  switch (weather) {
    case 'sunny': return 'from-yellow-100/90 to-green-100/90'
    case 'cloudy': return 'from-gray-200/90 to-green-200/90'
    case 'rainy': return 'from-blue-200/90 to-green-300/90'
    case 'misty': return 'from-gray-300/90 to-green-200/90'
    case 'aurora': return 'from-purple-200/90 to-green-300/90'
    case 'storm': return 'from-gray-700/90 to-green-400/90'
    case 'rainbow': return 'from-pink-200/90 to-green-200/90'
    default: return 'from-green-50/90 to-blue-50/90'
  }
}

const getPlantMoodIcon = (healthLevel: number): string => {
  if (healthLevel > 80) return '😊'
  if (healthLevel > 60) return '🙂'
  if (healthLevel > 30) return '😐'
  return '😔'
}

const getPlantStageIcon = (plantType: PlantType, stage: number): string => {
  const baseEmoji = PLANT_TYPES[plantType].emoji
  if (stage === 0) return '🌱' // seed
  if (stage === 1) return '🌿' // sprout
  if (stage === 2) return baseEmoji // young
  if (stage === 3) return baseEmoji // mature
  return `✨${baseEmoji}✨` // evolved
}

const getWeatherEffect = (weather: WeatherType, plantType: PlantType): { healthModifier: number } => {
  const effects: Record<WeatherType, Record<PlantType, number>> = {
    sunny: {
      'focus-flower': 2, 'energy-tree': 3, 'calm-succulent': 1, 'creativity-vine': 1, 
      'productivity-herb': 2, 'wisdom-moss': -1, 'zen-bamboo': 0, 'courage-oak': 2, 
      'peace-lily': 1, 'inspiration-orchid': 1
    },
    rainy: {
      'focus-flower': 1, 'energy-tree': 2, 'calm-succulent': -1, 'creativity-vine': 3, 
      'productivity-herb': 1, 'wisdom-moss': 3, 'zen-bamboo': 1, 'courage-oak': 1, 
      'peace-lily': 2, 'inspiration-orchid': 2
    },
    cloudy: {
      'focus-flower': 0, 'energy-tree': 0, 'calm-succulent': 1, 'creativity-vine': 1, 
      'productivity-herb': 0, 'wisdom-moss': 1, 'zen-bamboo': 2, 'courage-oak': 0, 
      'peace-lily': 1, 'inspiration-orchid': 0
    },
    misty: {
      'focus-flower': 1, 'energy-tree': 0, 'calm-succulent': 2, 'creativity-vine': 2, 
      'productivity-herb': 0, 'wisdom-moss': 2, 'zen-bamboo': 3, 'courage-oak': 0, 
      'peace-lily': 3, 'inspiration-orchid': 1
    },
    aurora: {
      'focus-flower': 1, 'energy-tree': 1, 'calm-succulent': 1, 'creativity-vine': 3, 
      'productivity-herb': 1, 'wisdom-moss': 2, 'zen-bamboo': 2, 'courage-oak': 1, 
      'peace-lily': 2, 'inspiration-orchid': 4
    },
    storm: {
      'focus-flower': -1, 'energy-tree': -1, 'calm-succulent': -2, 'creativity-vine': -1, 
      'productivity-herb': -1, 'wisdom-moss': 0, 'zen-bamboo': 1, 'courage-oak': 3, 
      'peace-lily': 0, 'inspiration-orchid': -1
    },
    rainbow: {
      'focus-flower': 2, 'energy-tree': 2, 'calm-succulent': 2, 'creativity-vine': 2, 
      'productivity-herb': 2, 'wisdom-moss': 2, 'zen-bamboo': 2, 'courage-oak': 2, 
      'peace-lily': 2, 'inspiration-orchid': 3
    }
  }

  return { healthModifier: effects[weather][plantType] || 0 }
}

export function NeuroGarden({ isActive, userType, onComplete }: NeuroGardenProps) {
  const { state, gardenState, updateGarden } = useNeuroFog()
  
  // Debug logging for activation
  useEffect(() => {
    console.log('🌱 NeuroGarden render state:', { isActive, userType, cfi: state.cfi })
    if (isActive) {
      console.log('🌱 NeuroGarden should be visible - rendering garden modal')
    }
  }, [isActive, userType, state.cfi])

  // Cleanup particle timeouts on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && (window as any).particleTimeouts) {
        ;(window as any).particleTimeouts.forEach((timeoutId: NodeJS.Timeout) => clearTimeout(timeoutId))
        ;(window as any).particleTimeouts = []
      }
    }
  }, [])
  const [currentActivity, setCurrentActivity] = useState<GardenActivity | null>(null)
  const [activityProgress, setActivityProgress] = useState(0)
  const [selectedPlantPosition, setSelectedPlantPosition] = useState<{ x: number; y: number } | null>(null)
  const [isPlanting, setIsPlanting] = useState(false)
  const [meditationText, setMeditationText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [weather, setWeather] = useState<WeatherType>('sunny')
  const [season, setSeason] = useState<SeasonType>('spring')
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRateVariability: 50,
    breathingRate: 12,
    stressLevel: 0.5,
    focusScore: 75
  })
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [breathingProgress, setBreathingProgress] = useState(0)
  const [particleSystem, setParticleSystem] = useState<Array<{id: string, x: number, y: number, type: string}>>([])
  const [soundLayers, setSoundLayers] = useState<string[]>([])
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [selectedPlantIndex, setSelectedPlantIndex] = useState<number | null>(null)
  const [showPlantSelection, setShowPlantSelection] = useState(false)

  // Advanced AI-powered activity recommendation engine
  const getRecommendedActivity = useCallback((): GardenActivity => {
    const currentHour = new Date().getHours()
    const currentWeather = getDynamicWeather(state.cfi)
    
    const availableActivities = GARDEN_ACTIVITIES.filter(activity => {
      // Basic unlocking
      if (activity.userTypes.includes(userType) && gardenState.level >= activity.unlock.level) {
        // CFI threshold check
        if (activity.unlock.cfiThreshold && state.cfi > activity.unlock.cfiThreshold) return false
        
        // Time of day optimization
        if (activity.unlock.timeOfDay && !activity.unlock.timeOfDay.includes(currentHour)) return false
        
        // Weather matching
        if (activity.unlock.weather && !activity.unlock.weather.includes(currentWeather)) return false
        
        return true
      }
      return false
    })

    // Smart prioritization algorithm
    const scoredActivities = availableActivities.map(activity => {
      let score = 0
      
      // Stress level match
      if (state.cfi < 25 && activity.stressReduction > 0.8) score += 50
      else if (state.cfi < 40 && activity.stressReduction > 0.6) score += 40
      else if (state.cfi < 60 && activity.stressReduction > 0.4) score += 30
      else score += activity.stressReduction * 20
      
      // User type specific bonuses
      if (activity.userTypes.length === 1 && activity.userTypes[0] === userType) score += 25
      
      // Time of day optimization
      if (activity.unlock.timeOfDay?.includes(currentHour)) score += 15
      
      // Recent effectiveness history
      const recentEffectiveness = gardenState.effectivenessHistory.slice(-3).reduce((sum, eff) => sum + eff, 0) / 3
      if (recentEffectiveness > 80) score += 10
      
      // Biometric targeting
      if (activity.biometricTarget && state.signals.mouseVariability > 0.7) score += 20
      
      return { activity, score }
    })

    const bestActivity = scoredActivities.sort((a, b) => b.score - a.score)[0]
    return bestActivity?.activity || availableActivities[0]
  }, [state, userType, gardenState])

  // Dynamic weather system based on CFI and emotions
  const getDynamicWeather = useCallback((cfi: number): WeatherType => {
    if (cfi < 20) return 'storm'
    if (cfi < 35) return 'rainy'
    if (cfi < 50) return 'cloudy'
    if (cfi < 70) return 'misty'
    if (cfi < 85) return 'sunny'
    return 'aurora' // Peak performance
  }, [])

  // Biometric simulation and tracking
  const simulateBiometrics = useCallback(() => {
    if (!currentActivity?.biometricTarget) return

    const target = currentActivity.biometricTarget
    setBiometrics(prev => ({
      heartRateVariability: Math.max(40, prev.heartRateVariability - (target.heartRateReduction * 0.1)),
      breathingRate: prev.breathingRate * 0.98 + target.breathingRateTarget * 0.02,
      stressLevel: Math.max(0.1, prev.stressLevel - 0.01),
      focusScore: Math.min(100, prev.focusScore + 0.5)
    }))
  }, [currentActivity])

  // Particle system for visual effects
  const generateParticles = useCallback((type: string, count: number = 5) => {
    const timestamp = performance.now() + Math.random() * 1000 // More unique timestamp
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: `${type}-${timestamp.toFixed(3)}-${i}-${Math.random().toString(36).substr(2, 9)}`, // Much more unique ID
      x: Math.random() * 100,
      y: Math.random() * 100,
      type
    }))
    setParticleSystem(prev => [...prev, ...newParticles])
    
    // Clean up particles after animation
    const timeoutId = setTimeout(() => {
      setParticleSystem(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)))
    }, 3000)
    
    // Store timeout IDs for cleanup
    if (typeof window !== 'undefined') {
      if (!(window as any).particleTimeouts) (window as any).particleTimeouts = []
      ;(window as any).particleTimeouts.push(timeoutId)
    }
  }, [])

  // Enhanced code snippets with more variety
  const codeSnippets = {
    peaceful: [
      "const peace = await mindfulness.breathe()",
      "function calm() {\n  return innerBalance.restore()\n}",
      "let stress = 0\nwhile (breathing) {\n  stress--\n}",
      "const focus = meditation.map(thought => clarity)",
      "async function relax() {\n  await sleep(1000)\n  return renewal\n}"
    ],
    motivational: [
      "const success = persistence.map(effort => achievement)",
      "function overcome(challenge) {\n  return strength.build(challenge)\n}",
      "const growth = comfort.zone.expand()",
      "while (learning) {\n  skills.level++\n  confidence.boost()\n}",
      "const breakthrough = patience.then(insight)"
    ],
    creative: [
      "const inspiration = wonder.filter(moment => magical)",
      "function create() {\n  return imagination.unlimited()\n}",
      "const art = soul.express(emotion)",
      "let ideas = []\nwhile (exploring) {\n  ideas.push(new Discovery())\n}",
      "const masterpiece = process.trust(() => flow)"
    ]
  }

  // Sound therapy layers configuration
  const soundLayersConfig = {
    'forest': ['birds', 'wind', 'stream', 'leaves'],
    'ocean': ['waves', 'seagulls', 'breeze'],
    'rain': ['droplets', 'thunder', 'puddles'],
    'garden': ['bees', 'fountain', 'chimes']
  }

  // Achievement checking
  const checkAchievements = useCallback(() => {
    ACHIEVEMENTS.forEach(achievement => {
      if (!unlockedAchievements.includes(achievement.id) && achievement.unlock()) {
        setUnlockedAchievements(prev => [...prev, achievement.id])
        generateParticles('achievement', 10)
        // Award achievement rewards
        if (achievement.reward.plantType) {
          generateParticles('plant-unlock', 8)
        }
      }
    })
  }, [unlockedAchievements, generateParticles])

  // Weather updates
  useEffect(() => {
    const newWeather = getDynamicWeather(state.cfi)
    if (newWeather !== weather) {
      setWeather(newWeather)
      generateParticles('weather-change', 12)
    }
  }, [state.cfi, weather, getDynamicWeather, generateParticles])

  // Biometric simulation
  useEffect(() => {
    if (currentActivity?.biometricTarget) {
      const interval = setInterval(simulateBiometrics, 1000)
      return () => clearInterval(interval)
    }
  }, [simulateBiometrics, currentActivity])

  // Achievement checking
  useEffect(() => {
    checkAchievements()
  }, [gardenState, checkAchievements])

  useEffect(() => {
    if (isActive && !currentActivity) {
      const recommended = getRecommendedActivity()
      setCurrentActivity(recommended)
      setActivityProgress(0)

      // Initialize activity-specific states
      if (recommended.type === 'code-meditation') {
        const snippetType = state.cfi < 40 ? 'peaceful' : state.cfi < 70 ? 'motivational' : 'creative'
        const snippets = codeSnippets[snippetType]
        setMeditationText(snippets[Math.floor(Math.random() * snippets.length)])
        setUserInput('')
      } else if (recommended.type === 'sound-therapy') {
        const layerType = userType === 'developer' ? 'rain' : userType === 'student' ? 'forest' : 'garden'
        setSoundLayers(soundLayersConfig[layerType as keyof typeof soundLayersConfig])
      } else if (recommended.type === 'breathing-forest') {
        setBreathingPhase('inhale')
        setBreathingProgress(0)
      }

      generateParticles('activity-start', 8)
    }
  }, [isActive, currentActivity, getRecommendedActivity, state.cfi, userType, generateParticles])

  // Breathing exercise controller
  useEffect(() => {
    if (currentActivity?.type === 'breathing-forest') {
      const phases = { inhale: 4000, hold: 4000, exhale: 6000 }
      const currentPhaseDuration = phases[breathingPhase]
      
      const breathingInterval = setInterval(() => {
        setBreathingProgress(prev => {
          const newProgress = prev + (100 / (currentPhaseDuration / 100))
          if (newProgress >= 100) {
            setBreathingPhase(current => {
              if (current === 'inhale') return 'hold'
              if (current === 'hold') return 'exhale'
              return 'inhale'
            })
            return 0
          }
          return newProgress
        })
      }, 100)

      return () => clearInterval(breathingInterval)
    }
  }, [currentActivity, breathingPhase])

  // Enhanced activity completion with achievements and rewards
  const completeActivity = useCallback((effectiveness: number = 0.8) => {
    if (!currentActivity) return

    const newGardenState = { ...gardenState }
    newGardenState.experience += currentActivity.rewards.xp
    newGardenState.totalSessions++
    
    // Level up check
    const experienceForNextLevel = newGardenState.level * 200
    if (newGardenState.experience >= experienceForNextLevel) {
      newGardenState.level++
      newGardenState.experience -= experienceForNextLevel
      generateParticles('level-up', 15)
    }

    // Plant unlocks
    if (currentActivity.rewards.plantUnlock && effectiveness > 75) {
      generateParticles('rare-unlock', 12)
    }

    // Update plant health and growth
    newGardenState.plants.forEach(plant => {
      plant.health = Math.min(100, plant.health + currentActivity.stressReduction * 15)
      plant.healthLevel = plant.health // sync alias
      plant.growth = Math.min(100, plant.growth + 5)
      plant.stage = Math.floor(plant.growth / 25) // calculate stage from growth
      plant.age += 0.1
      
      // Update mood based on health
      if (plant.health > 80) plant.mood = 'blooming'
      else if (plant.health > 60) plant.mood = 'happy'
      else if (plant.health > 40) plant.mood = 'neutral'
      else plant.mood = 'wilting'
      
      if (currentActivity.type === 'mindful-watering') {
        plant.lastWatered = Date.now()
      }
    })

    updateGarden(newGardenState)
    generateParticles('completion', 20)
    
    const finalEffectiveness = Math.round(effectiveness)
    onComplete(finalEffectiveness)

    // Reset state
    setCurrentActivity(null)
    setActivityProgress(0)
    setSelectedPlantPosition(null)
    setIsPlanting(false)
  }, [currentActivity, gardenState, updateGarden, onComplete, generateParticles])

  // Handle garden interactions
  const handleGardenClick = (x: number, y: number) => {
    if (currentActivity?.type === 'plant-seed' && !isPlanting) {
      setSelectedPlantPosition({ x, y })
      setIsPlanting(true)
    }
  }

  const plantSeed = () => {
    if (!selectedPlantPosition) return

    // Recommend plant type based on user type and current needs
    let plantType: PlantType = 'energy-tree'
    
    if (userType === 'developer' && state.cfi < 40) plantType = 'productivity-herb'
    else if (userType === 'student' && state.normalizedLoad > 0.7) plantType = 'focus-flower'
    else if (state.attentionStability < 0.6) plantType = 'calm-succulent'
    else if (userType === 'creator') plantType = 'creativity-vine'

    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      type: plantType,
      health: 80,
      healthLevel: 80, // alias for health
      growth: 20,
      stage: 0, // starting stage
      position: selectedPlantPosition,
      lastWatered: Date.now(),
      unlockLevel: gardenState.level,
      age: 0, // newly planted
      mood: 'happy', // default mood
      nickname: undefined, // no nickname initially
      specialEffects: [] // no special effects initially
    }

    const newGardenState = { ...gardenState }
    newGardenState.plants.push(newPlant)
    updateGarden(newGardenState)

    setActivityProgress(prev => prev + 25)
    setSelectedPlantPosition(null)
    setIsPlanting(false)

    if (activityProgress + 25 >= 100) {
      setTimeout(() => completeActivity(0.9), 500)
    }
  }

  // Handle code meditation typing
  const handleTyping = (input: string) => {
    setUserInput(input)
    const accuracy = calculateTypingAccuracy(input, meditationText)
    setActivityProgress(accuracy)

    if (accuracy >= 95) {
      setTimeout(() => completeActivity(0.95), 1000)
    }
  }

  const calculateTypingAccuracy = (input: string, target: string): number => {
    if (!target) return 0
    const minLength = Math.min(input.length, target.length)
    let matches = 0
    
    for (let i = 0; i < minLength; i++) {
      if (input[i] === target[i]) matches++
    }
    
    return Math.round((matches / target.length) * 100)
  }

  if (!isActive) {
    console.log('🌱 NeuroGarden not active, not rendering')
    return null
  }
  if (!currentActivity) {
    console.log('🌱 NeuroGarden active but no current activity yet')
    return null  
  }

  console.log('🌱 NeuroGarden rendering with activity:', currentActivity.name)

  const getActivityIcon = (type: ActivityType): string => {
    switch (type) {
      case 'plant-seed': return '🌱'
      case 'water-plants': return '💧'
      case 'remove-weeds': return '🌾'
      case 'code-meditation': return '💻'
      case 'study-break': return '📚'
      case 'creative-flow': return '🎨'
      default: return '🌸'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`bg-gradient-to-b ${getWeatherGradient(weather)} border border-white/20 rounded-3xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden relative transition-all duration-1000`}>
        {/* Close Button */}
        <button
          onClick={() => onComplete(50)}
          className="absolute top-6 right-6 z-30 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Weather Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          {weather === 'rainy' && Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`rain-${weather}-${i}`}
              className="absolute w-0.5 h-6 bg-blue-400/30 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
          {weather === 'storm' && Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`lightning-${weather}-${i}`}
              className="absolute w-1 h-20 bg-yellow-300/50 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: '0.2s'
              }}
            />
          ))}
          {weather === 'aurora' && Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`aurora-${weather}-${i}`}
              className="absolute h-full w-24 bg-gradient-to-b from-purple-300/20 to-green-300/20 animate-pulse"
              style={{
                left: `${i * 12}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>

        {/* Particle Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          {particleSystem.map(particle => (
            <div
              key={particle.id}
              className={`absolute text-lg animate-ping ${
                particle.type === 'achievement' ? 'text-yellow-400' :
                particle.type === 'level-up' ? 'text-purple-400' :
                particle.type === 'completion' ? 'text-green-400' :
                'text-blue-400'
              }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: particle.type === 'achievement' ? '20px' : '14px'
            }}
          >
            {particle.type === 'achievement' && '🏆'}
            {particle.type === 'level-up' && '⭐'}
            {particle.type === 'completion' && '✨'}
            {particle.type === 'plant-unlock' && '🌟'}
            {particle.type.includes('weather') && '🌈'}
            {!particle.type.includes('achievement') && !particle.type.includes('level') && 
             !particle.type.includes('completion') && !particle.type.includes('plant') && 
             !particle.type.includes('weather') && '💫'}
          </div>
        ))}
      </div>

      {/* Modal Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Enhanced Header with Weather and Biometrics */}
        <div className="p-4 bg-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">{getActivityIcon(currentActivity.type)}</span>
              </div>
              <div>
                <h2 className="text-base font-semibold text-black">{currentActivity.name}</h2>
                <p className="text-sm text-black/80">{currentActivity.description}</p>
                <div className="text-xs text-black/70 flex items-center gap-2 mt-1">
                  <span>{weather === 'sunny' && '☀️'}{weather === 'cloudy' && '☁️'}{weather === 'rainy' && '🌧️'}{weather === 'misty' && '🌫️'}{weather === 'aurora' && '🌌'}{weather === 'storm' && '⛈️'}{weather === 'rainbow' && '🌈'}</span>
                  <span>CFI: {state.cfi}</span>
                  {currentActivity.biometricTarget && (
                    <span>❤️ {Math.round(biometrics.heartRateVariability)}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-black font-medium">Level {gardenState.level}</div>
                <div className="text-xs text-black/70">{gardenState.experience} XP</div>
                {unlockedAchievements.length > 0 && (
                  <div className="text-xs text-yellow-300">🏆 {unlockedAchievements.length}</div>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <div className="text-lg">{getActivityIcon(currentActivity.type)}</div>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar with XP */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-black/90">Activity Progress</span>
              <span className="text-black/80">{Math.round(activityProgress)}% • +{currentActivity.rewards.xp} XP</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-white/60 to-white/90 h-2 rounded-full transition-all duration-300 relative"
                style={{ width: `${activityProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Biometric Feedback Panel */}
          {currentActivity.biometricTarget && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-3 border border-white/30">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xs text-black/80">Heart Rate</div>
                  <div className={`text-sm font-mono ${biometrics.heartRateVariability < 60 ? 'text-green-700' : 'text-orange-700'}`}>
                    {Math.round(biometrics.heartRateVariability)} bpm
                  </div>
                </div>
                <div>
                  <div className="text-xs text-black/80">Breathing</div>
                  <div className={`text-sm font-mono ${Math.abs(biometrics.breathingRate - currentActivity.biometricTarget.breathingRateTarget) < 2 ? 'text-green-700' : 'text-orange-700'}`}>
                    {Math.round(biometrics.breathingRate)}/min
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions with Dynamic Tips */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-4 border border-white/30">
            <p className="text-black/90 italic text-sm">{currentActivity.instruction}</p>
            {currentActivity.type === 'breathing-forest' && (
              <div className="mt-2 text-center">
                <div className="text-sm text-black/80 capitalize">{breathingPhase}</div>
                <div className="w-full bg-white/30 rounded-full h-2 mt-1">
                  <div 
                    className="bg-white/70 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${breathingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Main Activity Area with Garden Canvas */}
        <div className="flex-1 relative overflow-hidden">
          {/* Weather Background Layer */}
          <div className={`absolute inset-0 transition-all duration-1000 rounded-b-3xl ${
            weather === 'sunny' ? 'bg-gradient-to-b from-yellow-100/20 to-white/20' :
            weather === 'cloudy' ? 'bg-gradient-to-b from-gray-200/20 to-white/20' :
            weather === 'rainy' ? 'bg-gradient-to-b from-blue-200/20 to-white/20' :
            weather === 'misty' ? 'bg-gradient-to-b from-gray-300/20 to-white/20' :
            weather === 'aurora' ? 'bg-gradient-to-b from-purple-200/20 to-white/20' :
            weather === 'storm' ? 'bg-gradient-to-b from-gray-700/20 to-white/20' :
            'bg-gradient-to-b from-pink-200/20 to-white/20'
          }`} />

          {currentActivity.type === 'plant-seed' && (
            <div className="relative w-full h-full p-4">
              {/* Garden Grid */}
              <div 
                className="w-full h-full bg-white/30 backdrop-blur-sm rounded-2xl cursor-crosshair overflow-hidden border border-white/40 shadow-xl min-h-[300px]"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width) * 100
                  const y = ((e.clientY - rect.top) / rect.height) * 100
                  handleGardenClick(x, y)
                }}
              >
                {/* Existing Plants with Enhanced Visual Effects */}
                {gardenState.plants.map(plant => (
                  <div
                    key={plant.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ 
                      left: `${plant.position.x}%`, 
                      top: `${plant.position.y}%`,
                      opacity: Math.max(0.3, plant.health / 100)
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                    setSelectedPlantIndex(gardenState.plants.findIndex(p => p.id === plant.id))
                  }}
                >
                  <div className={`text-3xl group-hover:scale-125 transition-transform duration-300 ${
                    plant.mood === 'blooming' ? 'animate-pulse' :
                    plant.mood === 'happy' ? 'animate-bounce' :
                    'animate-none'
                  }`}>
                    {PLANT_TYPES[plant.type].emoji}
                  </div>
                  
                  {/* Plant Health Indicator */}
                  <div className="absolute -top-2 -right-2 text-lg">
                    {getPlantMoodIcon(plant.health)}
                  </div>
                  
                  {/* Growth Stage Indicator */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-green-100/80 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Stage {Math.floor(plant.growth / 25) + 1}
                  </div>
                </div>
              ))}

              {/* Enhanced Selected Position */}
              {selectedPlantPosition && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12"
                  style={{ 
                    left: `${selectedPlantPosition.x}%`, 
                    top: `${selectedPlantPosition.y}%` 
                  }}
                >
                  <div className="w-full h-full bg-yellow-200/60 border-2 border-yellow-400 rounded-full animate-ping" />
                  <div className="absolute inset-2 bg-yellow-100/80 border border-yellow-300 rounded-full animate-pulse" />
                </div>
              )}

              {/* Enhanced Grid Pattern with Dynamic Opacity */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                selectedPlantPosition ? 'opacity-30' : 'opacity-10'
              }`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`v-${i}`} className="h-full border-l border-green-400/50" style={{ marginLeft: `${i * 16.66}%` }} />
                ))}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={`h-${i}`} className="w-full border-t border-green-400/50" style={{ marginTop: `${i * 25}%` }} />
                ))}
              </div>

              {/* Weather Effect Overlays */}
              {weather === 'rainy' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={`garden-rain-${i}`}
                      className="absolute w-0.5 h-6 bg-blue-300/40 animate-bounce"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: '0.8s'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Plant Button with Weather Consideration */}
            {selectedPlantPosition && (
              <button
                onClick={plantSeed}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black px-8 py-4 rounded-full shadow-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 border border-green-400"
              >
                <span className="text-xl">🌱</span>
                <span className="font-medium">Plant Seed</span>
                <span className="text-sm opacity-75">
                  ({weather === 'sunny' ? 'Perfect!' : weather === 'rainy' ? 'Great Growth!' : weather === 'cloudy' ? 'Good' : 'Nice'})
                </span>
              </button>
            )}
          </div>
        )}

        {/* Enhanced Plant Garden Grid for Other Activities */}
        {currentActivity.type !== 'plant-seed' && (
          <div className="relative z-10 p-8 h-full overflow-auto">
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {gardenState.plants.map((plant, index) => (
                <div
                  key={plant.id}
                  className="group relative bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/60 hover:bg-white/60 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedPlantIndex(index)}
                >
                  {/* Plant Mood Indicator */}
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                    {getPlantMoodIcon(plant.healthLevel)}
                  </div>
                  
                  {/* Growth Stage Visualization */}
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {getPlantStageIcon(plant.type, plant.stage)}
                    </div>
                    <div className="text-sm font-medium text-black capitalize">
                      {plant.type.replace('-', ' ')} {plant.nickname && `"${plant.nickname}"`}
                    </div>
                    <div className="text-xs text-black/80">
                      Stage {plant.stage + 1} • {plant.healthLevel > 80 ? 'Thriving' : plant.healthLevel > 60 ? 'Healthy' : plant.healthLevel > 30 ? 'Growing' : 'Struggling'}
                    </div>
                  </div>

                  {/* Enhanced Health Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-black/80">Health</span>
                      <span className="text-black/90 font-mono">{Math.round(plant.healthLevel)}%</span>
                    </div>
                    <div className="w-full bg-green-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          plant.healthLevel > 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                          plant.healthLevel > 60 ? 'bg-gradient-to-r from-green-300 to-green-400' :
                          plant.healthLevel > 30 ? 'bg-gradient-to-r from-yellow-300 to-green-300' :
                          'bg-gradient-to-r from-orange-300 to-yellow-300'
                        }`}
                        style={{ width: `${plant.healthLevel}%` }}
                      >
                        <div className="h-full w-full bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Weather Adaptation Indicator */}
                  {getWeatherEffect(weather, plant.type).healthModifier !== 0 && (
                    <div className="mt-2 text-xs text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                        getWeatherEffect(weather, plant.type).healthModifier > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        <span className="text-xs">
                          {weather === 'sunny' && '☀️'}
                          {weather === 'cloudy' && '☁️'}
                          {weather === 'rainy' && '🌧️'}
                          {weather === 'misty' && '🌫️'}
                          {weather === 'aurora' && '🌌'}
                          {weather === 'storm' && '⛈️'}
                          {weather === 'rainbow' && '🌈'}
                        </span>
                        {getWeatherEffect(weather, plant.type).healthModifier > 0 ? '+' : ''}{getWeatherEffect(weather, plant.type).healthModifier}
                      </span>
                    </div>
                  )}

                  {/* Evolution Indicator */}
                  {plant.stage < 4 && plant.healthLevel > 80 && (
                    <div className="mt-2 text-center">
                      <div className="text-xs text-black/80 animate-pulse">Ready to evolve! ⭐</div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add New Plant Slot */}
              {gardenState.plants.length < 9 && (
                <div 
                  className="group bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-green-300/60 hover:border-green-400 transition-all duration-300 cursor-pointer hover:bg-white/30"
                  onClick={() => setShowPlantSelection(true)}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2 text-green-300 group-hover:text-green-400 group-hover:scale-110 transition-all duration-300">
                      ➕
                    </div>
                    <div className="text-sm text-black/80 group-hover:text-black">
                      Plant Seed
                    </div>
                    <div className="text-xs text-black/70 mt-1">
                      {gardenState.level < 2 ? `Unlock at Level 2` : 
                       gardenState.level < 5 ? `${9 - gardenState.plants.length} slots available` :
                       'Add new plant'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Garden Statistics Panel */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl mb-1">🌱</div>
                    <div className="text-xs text-black/80">Total Plants</div>
                    <div className="text-sm font-bold text-black">{gardenState.plants.length}</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-xs text-black/80">Achievements</div>
                    <div className="text-sm font-bold text-black">{unlockedAchievements.length}</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-xs text-black/80">Daily Streak</div>
                    <div className="text-sm font-bold text-black">{gardenState.streakCount}</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">
                      {weather === 'sunny' && '☀️'}
                      {weather === 'cloudy' && '☁️'}
                      {weather === 'rainy' && '🌧️'}
                      {weather === 'misty' && '🌫️'}
                      {weather === 'aurora' && '🌌'}
                      {weather === 'storm' && '⛈️'}
                      {weather === 'rainbow' && '🌈'}
                    </div>
                    <div className="text-xs text-black/80">Weather</div>
                    <div className="text-sm font-bold text-black capitalize">{weather}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentActivity.type === 'code-meditation' && (
          <div className="p-6 max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono">
              <div className="mb-4 text-sm opacity-70">// Type this code mindfully</div>
              <pre className="whitespace-pre-wrap text-lg leading-relaxed">{meditationText}</pre>
            </div>
            
            <textarea
              value={userInput}
              onChange={(e) => handleTyping(e.target.value)}
              placeholder="Start typing the code above slowly and mindfully..."
              className="w-full mt-4 p-4 bg-white/80 rounded-xl border border-green-200 font-mono text-gray-800 resize-none h-32"
            />
            
            <div className="mt-2 text-center">
              <span className="text-sm text-black/80">
                Accuracy: {calculateTypingAccuracy(userInput, meditationText)}%
              </span>
            </div>
          </div>
        )}

        {currentActivity.type === 'remove-weeds' && (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {['Deadline Stress', 'Imposter Syndrome', 'Code Complexity', 'Social Media', 'Perfectionism', 'Comparison'].map((stress, index) => (
                <button
                  key={stress}
                  onClick={() => setActivityProgress(prev => Math.min(100, prev + 16.67))}
                  className="bg-red-100 hover:bg-green-100 text-red-800 hover:text-green-800 p-4 rounded-xl transition-colors text-center border border-red-200 hover:border-green-200"
                >
                  <div className="text-2xl mb-2">🌾</div>
                  <div className="text-xs">{stress}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        </div>

        {/* Enhanced Footer with Achievement Notifications */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-b-3xl border-t border-white/20">
          <div className="flex justify-between items-center">
            {/* Achievement Notifications */}
            {unlockedAchievements.length > 0 && (
              <div className="flex items-center gap-2 bg-yellow-100/90 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-300/50">
                <span className="text-yellow-600 animate-pulse text-sm">🏆</span>
                <span className="text-xs font-medium text-yellow-800">
                  {unlockedAchievements.length} New Achievement{unlockedAchievements.length > 1 ? 's' : ''}!
                </span>
              </div>
            )}

            {/* Weather Forecast */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30">
              <span className="text-xs text-black/80">Next:</span>
              <span className="text-sm">
                {Math.random() > 0.5 ? '🌤️' : Math.random() > 0.5 ? '🌧️' : '☁️'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => completeActivity(0.5)}
                className="group px-4 py-2 bg-white/20 hover:bg-white/30 text-black/80 hover:text-black rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50 text-sm"
              >
                <span className="flex items-center gap-1">
                  <span className="group-hover:animate-spin text-sm">🔄</span>
                  <span>Skip</span>
                </span>
              </button>
              <button
                onClick={() => completeActivity(0.8)}
                className="group px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
              >
                <span className="flex items-center gap-1">
                  <span className="group-hover:animate-bounce text-sm">✨</span>
                  <span>Complete</span>
                  <span className="text-xs opacity-75">+{currentActivity.rewards.xp} XP</span>
                </span>
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-3 text-center">
            <div className="text-xs text-black/80 mb-1">
              Session Progress • {Math.round(activityProgress)}% Complete
            </div>
            <div className="w-full bg-white/30 rounded-full h-1 max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-white/60 to-white/90 h-1 rounded-full transition-all duration-300"
                style={{ width: `${activityProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}