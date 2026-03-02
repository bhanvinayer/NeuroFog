export interface Drink {
  id: string
  name: string
  icon: string
  color: string
  description: string
}

export interface DrinkSize {
  id: string
  label: string
  minutes: number
  ml: string
}

export interface StickyNote {
  id: string
  text: string
  color: string
  completed: boolean
  createdAt: number
}

export interface CafeBackground {
  id: string
  name: string
  image: string
  vibe: string
}

export const DRINKS: Drink[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    icon: 'espresso',
    color: '#8B6F47',
    description: 'Bold and focused',
  },
  {
    id: 'latte',
    name: 'Latte',
    icon: 'latte',
    color: '#C4A882',
    description: 'Smooth and balanced',
  },
  {
    id: 'matcha',
    name: 'Matcha',
    icon: 'matcha',
    color: '#7FB069',
    description: 'Calm and sustained',
  },
  {
    id: 'chai',
    name: 'Chai',
    icon: 'chai',
    color: '#D4845C',
    description: 'Warm and spiced',
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    icon: 'cold-brew',
    color: '#5C7AEA',
    description: 'Cool and steady',
  },
  {
    id: 'herbal-tea',
    name: 'Herbal Tea',
    icon: 'herbal-tea',
    color: '#A7C957',
    description: 'Gentle and soothing',
  },
]

export const DRINK_SIZES: DrinkSize[] = [
  { id: 'small', label: 'Small', minutes: 25, ml: '240ml' },
  { id: 'medium', label: 'Medium', minutes: 45, ml: '350ml' },
  { id: 'large', label: 'Large', minutes: 60, ml: '480ml' },
]

export const BACKGROUNDS: CafeBackground[] = [
  { id: 'cozy', name: 'Cozy Night Cafe', image: '/images/cafe-cozy.jpg', vibe: 'Warm and intimate' },
  { id: 'modern', name: 'Modern Studio', image: '/images/cafe-modern.jpg', vibe: 'Clean and bright' },
  { id: 'library', name: 'Dark Library', image: '/images/cafe-library.jpg', vibe: 'Scholarly focus' },
  { id: 'garden', name: 'Zen Garden', image: '/images/cafe-garden.jpg', vibe: 'Peaceful nature' },
]

export const NOTE_COLORS = [
  '#FBBF24',  // amber
  '#F472B6',  // pink
  '#60A5FA',  // blue
  '#34D399',  // emerald
  '#C084FC',  // purple
  '#FB923C',  // orange
]
