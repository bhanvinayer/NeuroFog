'use client'

import { useState } from 'react'

interface NeuroFogTutorialProps {
  isOpen: boolean
  onClose: () => void
}

const TUTORIAL_SLIDES = [
  {
    title: "Welcome to NeuroFog",
    subtitle: "Your Cognitive Wellness Companion",
    icon: "🧠",
    content: (
      <div className="space-y-4">
        <p className="text-foreground/80 leading-relaxed">
          NeuroFog is an AI-powered mental health app that monitors your cognitive patterns in real-time 
          and provides personalized interventions to optimize your mental well-being.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <h4 className="font-semibold text-primary mb-2">What makes NeuroFog unique?</h4>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li>• Real-time cognitive fog detection</li>
            <li>• Personalized stress relief activities</li>
            <li>• Gamified garden-based interventions</li>
            <li>• Adaptive AI that learns your patterns</li>
            <li>• Biometric-aware recommendations</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "Cognitive Fog Index (CFI)",
    subtitle: "Real-time Mind Clarity Monitoring",
    icon: "📊",
    content: (
      <div className="space-y-4">
        <p className="text-foreground/80 leading-relaxed">
          CFI starts at 0 (clear baseline) and increases as behavioral patterns indicate growing cognitive fog and mental fatigue.
        </p>
        
        <div className="bg-blue-900/50 border border-blue-800 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-3">How CFI Increases with Cognitive Stress:</h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">⌨️</span>
              <div>
                <strong className="text-gray-800">Typing Instability:</strong>
                <span className="text-gray-600"> Increased pauses, backspaces, speed variations (Major Factor)</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500">🔄</span>
              <div>
                <strong className="text-gray-800">Tab Switching:</strong>
                <span className="text-gray-600"> Frequent task switching indicates distraction (Major Factor)</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-500">⏱️</span>
              <div>
                <strong className="text-gray-800">Micro Pauses:</strong>
                <span className="text-gray-600"> Hesitation during typing shows uncertainty (Moderate Factor)</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500">📜</span>
              <div>
                <strong className="text-gray-800">Scroll Patterns:</strong>
                <span className="text-gray-600"> Erratic scrolling and re-reading (Moderate Factor)</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">🖱️</span>
              <div>
                <strong className="text-gray-800">Mouse Behavior:</strong>
                <span className="text-gray-600"> Movement patterns (Minor Factor for context)</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
            <p className="text-xs text-blue-700">
              � <strong>Sustained Levels Required:</strong> Interventions only activate after maintaining elevated CFI for multiple consecutive readings, preventing false alarms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="text-2xl mb-2">🟢</div>
            <h4 className="font-semibold text-green-800">Low CFI (0-45)</h4>
            <p className="text-sm text-green-600">Clear mind, optimal focus</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="text-2xl mb-2">🟡</div>
            <h4 className="font-semibold text-yellow-800">Medium CFI (46-69)</h4>
            <p className="text-sm text-yellow-600">NeuroGarden (sustained levels)</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-2xl mb-2">🔴</div>
            <h4 className="font-semibold text-red-800">High CFI (70+)</h4>
            <p className="text-sm text-red-600">NeuroPatch (sustained levels), then resets to 0</p>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">☕</span>
            <div>
              <h4 className="font-semibold text-indigo-800 mb-2">Deep Focus Mode</h4>
              <p className="text-sm text-indigo-700 mb-3">
                Enter a virtual cafe environment for dedicated focus sessions. Pick your drink to set the pace and duration.
              </p>
              
              <div className="space-y-2">
                <div className="text-xs text-indigo-600">
                  <strong>Available Drinks & Vibes:</strong>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-indigo-100 rounded p-2">
                    <span className="font-medium text-blue-800">☕ Espresso:</span> <span className="text-blue-700">Bold and focused</span>
                  </div>
                  <div className="bg-indigo-100 rounded p-2">
                    <span className="font-medium text-blue-800">🥛 Latte:</span> <span className="text-blue-700">Smooth and balanced</span>
                  </div>
                  <div className="bg-indigo-100 rounded p-2">
                    <span className="font-medium text-blue-800">🍵 Matcha:</span> <span className="text-blue-700">Calm and sustained</span>
                  </div>
                  <div className="bg-indigo-100 rounded p-2">
                    <span className="font-medium text-blue-800">🫖 Chai:</span> <span className="text-blue-700">Warm and spiced</span>
                  </div>
                  <div className="bg-indigo-100 rounded p-2">
                    <span className="font-medium text-blue-800">🧊 Cold Brew:</span> <span className="text-blue-700">Cool and steady</span>
                  </div>
                  <div className="bg-indigo-100 rounded p-2">
                    <span className="font-medium text-blue-800">🌿 Herbal Tea:</span> <span className="text-blue-700">Gentle and soothing</span>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-indigo-200">
                  <div className="text-xs text-indigo-600">
                    <strong>Session Sizes:</strong> Small (25min), Medium (45min), Large (60min)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Start typing in the Typing Zone to begin comprehensive behavioral monitoring
          </p>
        </div>
      </div>
    )
  },
  {
    title: "NeuroPatch System",
    subtitle: "Intelligent Intervention Activation",
    icon: "🎯",
    content: (
      <div className="space-y-4">
        <p className="text-foreground/80 leading-relaxed">
          NeuroFog uses a two-tier intervention system that responds to your cognitive fog levels automatically.
        </p>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Tier 1: NeuroGarden (CFI 50+ sustained)</h4>
              <p className="text-sm text-yellow-700">
                Preventive intervention that activates only after sustained medium-level cognitive fog. Requires consistent elevated CFI to avoid false triggers.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h4 className="font-semibold text-red-800 mb-2">Tier 2: NeuroPatch (CFI 70+ sustained)</h4>
              <p className="text-sm text-red-700 mb-2">
                Critical intervention for severe, sustained cognitive fog. Only activates after multiple consecutive high readings.
              </p>
              <p className="text-xs text-red-600 bg-red-100 border border-red-200 rounded p-2">
                ✨ <strong>Reset Effect:</strong> Completing a NeuroPatch session resets your CFI to 0, giving you a fresh start with optimal clarity.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700">Personalized Interventions by User Type:</div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <span className="text-lg">💻</span>
            <div>
              <h4 className="font-semibold text-purple-800">Developers</h4>
              <p className="text-sm text-purple-600">Code meditation, productivity herbs, debug stress relief</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-lg">📚</span>
            <div>
              <h4 className="font-semibold text-blue-800">Students</h4>
              <p className="text-sm text-blue-600">Focus flowers, study breaks, exam stress management</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-pink-50 border border-pink-200 rounded-lg">
            <span className="text-lg">🎨</span>
            <div>
              <h4 className="font-semibold text-pink-800">Creators</h4>
              <p className="text-sm text-pink-600">Creative flow states, inspiration cultivation, block removal</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Deep Focus Mode",
    subtitle: "Virtual Cafe Focus Sessions",
    icon: "☕",
    content: (
      <div className="space-y-4">
        <p className="text-foreground/80 leading-relaxed">
          Enter a virtual cafe environment for dedicated focus sessions. Pick your drink to set the pace and duration.
        </p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-semibold text-amber-800 mb-3">Available Drinks & Vibes:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-amber-100 rounded-lg p-3">
              <span className="text-lg mb-2 block">☕</span>
              <h5 className="font-semibold text-black">Espresso</h5>
              <p className="text-xs text-black">Bold and focused</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-3">
              <span className="text-lg mb-2 block">🥛</span>
              <h5 className="font-semibold text-black">Latte</h5>
              <p className="text-xs text-black">Smooth and balanced</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-3">
              <span className="text-lg mb-2 block">🍵</span>
              <h5 className="font-semibold text-black">Matcha</h5>
              <p className="text-xs text-black">Calm and sustained</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-3">
              <span className="text-lg mb-2 block">🫖</span>
              <h5 className="font-semibold text-black">Chai</h5>
              <p className="text-xs text-black">Warm and spiced</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-3">
              <span className="text-lg mb-2 block">🧊</span>
              <h5 className="font-semibold text-black">Cold Brew</h5>
              <p className="text-xs text-black">Cool and steady</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-3">
              <span className="text-lg mb-2 block">🌿</span>
              <h5 className="font-semibold text-black">Herbal Tea</h5>
              <p className="text-xs text-black">Gentle and soothing</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <h4 className="font-semibold text-blue-800">Session Sizes</h4>
              <p className="text-sm text-blue-700">
                <strong>Small:</strong> 25 minutes • <strong>Medium:</strong> 45 minutes • <strong>Large:</strong> 60 minutes
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-coffee-50 border border-coffee-200 rounded-xl p-3">
          <p className="text-sm text-coffee-700">
            ☕ <strong>Immersive Experience:</strong> Choose your perfect cafe vibe and let the environment guide your focus session with ambient sounds and visual cues.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "NeuroGarden Experience",
    subtitle: "Gamified Stress Relief Activities",
    icon: "🌱",
    content: (
      <div className="space-y-4">
        <p className="text-foreground/80 leading-relaxed">
          Transform stress relief into an engaging garden-building experience with 8+ unique activities 
          tailored to your needs and preferences.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <span className="text-lg mb-2 block">🌱</span>
            <h4 className="font-semibold text-green-800 text-sm">Plant Seeds</h4>
            <p className="text-xs text-green-600">Mindful planting for focus</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <span className="text-lg mb-2 block">🌬️</span>
            <h4 className="font-semibold text-blue-800 text-sm">Breathing Forest</h4>
            <p className="text-xs text-blue-600">Guided breathing exercises</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <span className="text-lg mb-2 block">💻</span>
            <h4 className="font-semibold text-purple-800 text-sm">Code Meditation</h4>
            <p className="text-xs text-purple-600">Mindful typing practice</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <span className="text-lg mb-2 block">🌾</span>
            <h4 className="font-semibold text-orange-800 text-sm">Remove Weeds</h4>
            <p className="text-xs text-orange-600">Clear negative thoughts</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-sm text-yellow-700">
            🏆 <strong>Gamification:</strong> Earn XP, unlock plants, level up, and build your personal wellness garden!
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-sm text-green-700">
            🌱 <strong>Conservative Activation:</strong> NeuroGarden automatically opens only after sustained elevated CFI (50+) for multiple readings, with 20-minute cooldowns between interventions.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Getting Started",
    subtitle: "Begin Your NeuroFog Journey",
    icon: "🚀",
    content: (
      <div className="space-y-4">
        <p className="text-black leading-relaxed">
          Ready to optimize your cognitive wellness? Follow these simple steps to get started.
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h4 className="font-semibold text-black">Select Your User Type</h4>
              <p className="text-sm text-black/70">Choose Developer, Student, or Creator for personalized experiences</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h4 className="font-semibold text-black">Start Tracking</h4>
              <p className="text-sm text-black/70">Click "Start Tracking" and begin typing in the Typing Zone</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h4 className="font-semibold text-black">Engage with Interventions</h4>
              <p className="text-sm text-black/70">Let NeuroPatch guide you through personalized wellness activities</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 rounded-xl p-4">
          <p className="text-center text-black font-medium">
            🌟 Your cognitive wellness journey starts now! 🌟
          </p>
        </div>
      </div>
    )
  }
]

export function NeuroFogTutorial({ isOpen, onClose }: NeuroFogTutorialProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  if (!isOpen) return null

  const handleNext = () => {
    if (currentSlide < TUTORIAL_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  const slide = TUTORIAL_SLIDES[currentSlide]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-blue-900 border border-blue-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-blue-800/50 border-b border-blue-700 p-4 md:p-6 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground transition-all duration-300 hover:scale-110"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center">
            <div className="text-3xl md:text-4xl mb-2">{slide.icon}</div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">{slide.title}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{slide.subtitle}</p>
            
            {/* Progress indicators moved to header */}
            <div className="flex justify-center space-x-2 mt-4">
              {TUTORIAL_SLIDES.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {currentSlide + 1} / {TUTORIAL_SLIDES.length}
            </p>
          </div>
        </div>

        {/* Content - scrollable area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 min-h-0">
          <div className="space-y-4">
            {slide.content}
          </div>
        </div>

        {/* Footer - fixed at bottom */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-blue-700 bg-blue-800/30 flex-shrink-0">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip Tutorial
          </button>
          
          <div className="flex items-center gap-3">
            {currentSlide > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 md:px-4 md:py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors text-sm md:text-base"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 md:px-6 md:py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium text-sm md:text-base"
            >
              {currentSlide === TUTORIAL_SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}