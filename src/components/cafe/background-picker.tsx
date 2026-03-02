'use client'

import { BACKGROUNDS, type CafeBackground } from '@/lib/cafe-types'

interface BackgroundPickerProps {
  current: CafeBackground
  onChange: (bg: CafeBackground) => void
}

export function BackgroundPicker({ current, onChange }: BackgroundPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground/60">Ambiance</p>
      <div className="grid grid-cols-2 gap-2">
        {BACKGROUNDS.map((bg) => (
          <button
            key={bg.id}
            onClick={() => onChange(bg)}
            className={`group relative overflow-hidden rounded-lg border transition-all ${
              current.id === bg.id
                ? 'border-primary/50 ring-1 ring-primary/30'
                : 'border-border/20 hover:border-border/50'
            }`}
          >
            <div className="relative h-16 w-full">
              <img
                src={bg.image}
                alt={bg.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-background/40" />
            </div>
            <div className="px-2 py-1.5 bg-card/80">
              <p className="text-[11px] font-medium text-foreground">{bg.name}</p>
              <p className="text-[9px] text-muted-foreground/60">{bg.vibe}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
