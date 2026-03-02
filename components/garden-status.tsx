'use client'

import { useNeuroFog } from '@/components/neurofog-provider'
import { useState } from 'react'

export function GardenStatus() {
  const { gardenState, userType, isGardenActive, activateGarden } = useNeuroFog()
  const [showDetails, setShowDetails] = useState(false)

  const getExperienceProgress = () => {
    const experienceForNextLevel = gardenState.level * 200
    return (gardenState.experience / experienceForNextLevel) * 100
  }

  const getGardenHealth = () => {
    if (gardenState.plants.length === 0) return 0
    const avgHealth = gardenState.plants.reduce((sum, plant) => sum + plant.health, 0) / gardenState.plants.length
    return Math.round(avgHealth)
  }

  const getUserTypeEmoji = () => {
    switch (userType) {
      case 'developer': return '💻'
      case 'student': return '📚'
      case 'creator': return '🎨'
      default: return '🧠'
    }
  }

  const getRecentEffectiveness = () => {
    if (gardenState.effectivenessHistory.length === 0) return 0
    const recent = gardenState.effectivenessHistory.slice(-5)
    return Math.round(recent.reduce((sum, eff) => sum + eff, 0) / recent.length)
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getUserTypeEmoji()}</span>
          <div>
            <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">NeuroGarden</h3>
            <p className="text-xs text-green-600 dark:text-green-300">Level {gardenState.level} • {gardenState.plants.length} plants</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-green-600 hover:text-green-700 transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-green-600 dark:text-green-300 mb-1">
          <span>Experience</span>
          <span>{gardenState.experience} / {gardenState.level * 200} XP</span>
        </div>
        <div className="w-full bg-green-100 dark:bg-green-800/30 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getExperienceProgress()}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-3 text-center">
        <div className="bg-blue-900/30 dark:bg-blue-900/20 rounded-lg py-2 px-1">
          <div className="text-lg leading-none">{getGardenHealth()}%</div>
          <div className="text-xs text-green-600 dark:text-green-300">Health</div>
        </div>
        <div className="bg-blue-900/30 dark:bg-blue-900/20 rounded-lg py-2 px-1">
          <div className="text-lg leading-none">{gardenState.streakDays}</div>
          <div className="text-xs text-green-600 dark:text-green-300">Streak</div>
        </div>
        <div className="bg-blue-900/30 dark:bg-blue-900/20 rounded-lg py-2 px-1">
          <div className="text-lg leading-none">{getRecentEffectiveness()}%</div>
          <div className="text-xs text-green-600 dark:text-green-300">Effect</div>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-3 border-t border-green-200/50 pt-3 animate-in slide-in-from-top-2 duration-200">
          {/* Plant Gallery */}
          {gardenState.plants.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-green-700 dark:text-green-200 mb-2">Your Plants</h4>
              <div className="grid grid-cols-4 gap-2">
                {gardenState.plants.slice(0, 8).map((plant) => (
                  <div
                    key={plant.id}
                    className="bg-blue-900/40 dark:bg-blue-900/30 rounded-lg p-2 text-center relative"
                    title={`${plant.type.replaceAll('-', ' ')}\nHealth: ${plant.health}%`}
                  >
                    <div className="text-sm">
                      {plant.type === 'focus-flower' && '🌸'}
                      {plant.type === 'energy-tree' && '🌳'}
                      {plant.type === 'calm-succulent' && '🌵'}
                      {plant.type === 'creativity-vine' && '🌿'}
                      {plant.type === 'productivity-herb' && '🌱'}
                      {plant.type === 'wisdom-moss' && '🍀'}
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white" 
                         style={{ backgroundColor: plant.health > 70 ? '#10B981' : plant.health > 40 ? '#F59E0B' : '#EF4444' }} />
                  </div>
                ))}
                {gardenState.plants.length > 8 && (
                  <div className="bg-blue-900/40 dark:bg-blue-900/30 rounded-lg p-2 text-center flex items-center justify-center">
                    <span className="text-xs text-green-600 dark:text-green-300">+{gardenState.plants.length - 8}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div>
            <h4 className="text-xs font-semibold text-green-700 dark:text-green-200 mb-2">Recent Activity</h4>
            <div className="text-xs text-green-600 dark:text-green-300">
              {gardenState.totalSessions === 0 && "No garden sessions yet"}
              {gardenState.totalSessions > 0 && (
                <>
                  {gardenState.totalSessions} sessions completed • Last activity: {
                    gardenState.lastActivity ? new Date(gardenState.lastActivity).toLocaleDateString() : 'Never'
                  }
                </>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={activateGarden}
            disabled={isGardenActive}
            className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
              isGardenActive
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isGardenActive ? 'Garden Active...' : 'Tend Garden'}
          </button>
        </div>
      )}
    </div>
  )
}