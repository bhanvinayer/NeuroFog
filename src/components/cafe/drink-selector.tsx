'use client'

import { useState } from 'react'
import { DRINKS, DRINK_SIZES, type Drink, type DrinkSize } from '@/lib/cafe-types'

interface DrinkSelectorProps {
  onSelect: (drink: Drink, size: DrinkSize) => void
}

function DrinkIcon({ drinkId, color, size = 48 }: { drinkId: string; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {drinkId === 'espresso' && (
        <>
          <rect x="14" y="18" width="20" height="18" rx="2" fill={color} opacity="0.9" />
          <rect x="14" y="18" width="20" height="18" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M34 24h4a3 3 0 010 6h-4" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M18 14c0-2 2-3 6-3s6 1 6 3" stroke={color} strokeWidth="1" opacity="0.4" />
          <path d="M20 14c1-2 1-4 0-6" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          <path d="M24 14c1-2 1-4 0-6" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          <path d="M28 14c1-2 1-4 0-6" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
        </>
      )}
      {drinkId === 'latte' && (
        <>
          <path d="M14 14h20v20a4 4 0 01-4 4h-12a4 4 0 01-4-4V14z" fill={color} opacity="0.3" />
          <path d="M14 14h20v20a4 4 0 01-4 4h-12a4 4 0 01-4-4V14z" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M14 22h20" stroke={color} strokeWidth="1" opacity="0.5" />
          <circle cx="24" cy="18" r="3" fill={color} opacity="0.2" />
          <path d="M21 18a3 3 0 016 0" stroke={color} strokeWidth="0.8" opacity="0.4" />
          <path d="M20 10c1-2 1-4 0-5" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          <path d="M28 10c1-2 1-4 0-5" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
        </>
      )}
      {drinkId === 'matcha' && (
        <>
          <path d="M12 20h24l-3 18H15L12 20z" fill={color} opacity="0.3" />
          <path d="M12 20h24l-3 18H15L12 20z" stroke={color} strokeWidth="1.5" fill="none" />
          <ellipse cx="24" cy="20" rx="12" ry="3" fill={color} opacity="0.4" />
          <ellipse cx="24" cy="20" rx="12" ry="3" stroke={color} strokeWidth="1.5" fill="none" />
          <circle cx="24" cy="19" r="2" fill={color} opacity="0.2" />
          <path d="M22 15c0-3 4-3 4 0" stroke={color} strokeWidth="1" opacity="0.3" />
        </>
      )}
      {drinkId === 'chai' && (
        <>
          <path d="M16 12h16v2H16v-2z" fill={color} opacity="0.3" />
          <rect x="15" y="14" width="18" height="20" rx="2" fill={color} opacity="0.3" />
          <rect x="15" y="14" width="18" height="20" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M33 20h3a2 2 0 010 4h-3" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M20 8c1-2 1-4 0-5" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          <path d="M24 7c1-2 1-4 0-5" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          <path d="M28 8c1-2 1-4 0-5" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          <circle cx="21" cy="22" r="1" fill={color} opacity="0.4" />
          <circle cx="27" cy="26" r="1" fill={color} opacity="0.4" />
          <circle cx="23" cy="28" r="0.8" fill={color} opacity="0.3" />
        </>
      )}
      {drinkId === 'cold-brew' && (
        <>
          <rect x="14" y="12" width="20" height="26" rx="3" fill={color} opacity="0.2" />
          <rect x="14" y="12" width="20" height="26" rx="3" stroke={color} strokeWidth="1.5" fill="none" />
          <rect x="17" y="30" width="14" height="6" rx="1" fill={color} opacity="0.3" />
          <rect x="17" y="24" width="14" height="6" rx="0" fill={color} opacity="0.15" />
          <circle cx="20" cy="20" r="2" stroke={color} strokeWidth="0.8" fill="none" opacity="0.4" />
          <circle cx="28" cy="22" r="1.5" stroke={color} strokeWidth="0.8" fill="none" opacity="0.3" />
          <circle cx="23" cy="17" r="1" stroke={color} strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M22 10v-3M26 10v-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {drinkId === 'herbal-tea' && (
        <>
          <path d="M16 16h16v16a4 4 0 01-4 4h-8a4 4 0 01-4-4V16z" fill={color} opacity="0.2" />
          <path d="M16 16h16v16a4 4 0 01-4 4h-8a4 4 0 01-4-4V16z" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M32 22c3-1 5 0 5 3s-2 4-5 3" stroke={color} strokeWidth="1" fill="none" opacity="0.4" />
          <path d="M14 14h20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24 20v8M20 24h8" stroke={color} strokeWidth="0.8" opacity="0.3" />
          <path d="M20 11c0-2 2-4 4-4s4 2 4 4" stroke={color} strokeWidth="1" opacity="0.3" fill="none" />
          <path d="M22 11v5M26 11v5" stroke={color} strokeWidth="0.8" opacity="0.2" />
        </>
      )}
    </svg>
  )
}

export function DrinkSelector({ onSelect }: DrinkSelectorProps) {
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null)
  const [selectedSize, setSelectedSize] = useState<DrinkSize | null>(null)

  return (
    <div className="flex flex-col items-center gap-8 px-4">
      {/* Welcome text */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight text-balance">
          Welcome to Deep Focus
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          Pick your drink to set the pace. Your session timer starts when you sit down.
        </p>
      </div>

      {/* Drink selection */}
      <div className="w-full max-w-lg">
        <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3">Choose your drink</p>
        <div className="grid grid-cols-3 gap-3">
          {DRINKS.map((drink) => (
            <button
              key={drink.id}
              onClick={() => { setSelectedDrink(drink); setSelectedSize(null) }}
              className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all
                ${selectedDrink?.id === drink.id
                  ? 'border-primary/50 bg-primary/10 scale-[1.02]'
                  : 'border-border/30 bg-card/80 hover:border-border/60 hover:bg-card'
                }`}
            >
              <DrinkIcon drinkId={drink.id} color={drink.color} size={48} />
              <span className="text-sm font-medium text-foreground">{drink.name}</span>
              <span className="text-[10px] text-muted-foreground">{drink.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Size selection */}
      {selectedDrink && (
        <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3">Pick your size</p>
          <div className="grid grid-cols-3 gap-3">
            {DRINK_SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 transition-all
                  ${selectedSize?.id === size.id
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-border/30 bg-card/80 hover:border-border/60 hover:bg-card'
                  }`}
              >
                <DrinkIcon drinkId={selectedDrink.id} color={selectedDrink.color} size={size.id === 'small' ? 32 : size.id === 'medium' ? 40 : 48} />
                <span className="text-sm font-medium text-foreground">{size.label}</span>
                <span className="text-[10px] text-muted-foreground">{size.minutes} min</span>
                <span className="text-[10px] text-muted-foreground/50">{size.ml}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start button */}
      {selectedDrink && selectedSize && (
        <button
          onClick={() => onSelect(selectedDrink, selectedSize)}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          <span>Sit Down</span>
          <span className="text-primary-foreground/60">
            {selectedSize.minutes}min with {selectedDrink.name}
          </span>
        </button>
      )}
    </div>
  )
}
