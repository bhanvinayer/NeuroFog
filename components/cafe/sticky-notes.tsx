'use client'

import { useState, useRef, useEffect } from 'react'
import { NOTE_COLORS, type StickyNote } from '@/lib/cafe-types'

export function StickyNotes() {
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [newNoteText, setNewNoteText] = useState('')
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0])
  const [showInput, setShowInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showInput])

  const addNote = () => {
    if (!newNoteText.trim()) return
    setNotes(prev => [...prev, {
      id: crypto.randomUUID(),
      text: newNoteText.trim(),
      color: selectedColor,
      completed: false,
      createdAt: Date.now(),
    }])
    setNewNoteText('')
    setShowInput(false)
  }

  const toggleNote = (id: string) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, completed: !n.completed } : n
    ))
  }

  const removeNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const todoNotes = notes.filter(n => !n.completed)
  const doneNotes = notes.filter(n => n.completed)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">Tasks</h3>
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Add
        </button>
      </div>

      {/* Add note input */}
      {showInput && (
        <div className="mb-3 flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            ref={inputRef}
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addNote()
              if (e.key === 'Escape') setShowInput(false)
            }}
            placeholder="What are you working on?"
            className="rounded-lg border border-border/30 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {NOTE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-5 w-5 rounded-full transition-transform ${selectedColor === color ? 'scale-125 ring-2 ring-foreground/20' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowInput(false)}
                className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={addNote}
                className="rounded-md bg-primary/20 px-3 py-1 text-xs text-primary hover:bg-primary/30"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes list */}
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto pr-1" style={{ maxHeight: '300px' }}>
        {/* To Do */}
        {todoNotes.length > 0 && (
          <div className="mb-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 mb-1">
              To Do ({todoNotes.length})
            </p>
            {todoNotes.map((note) => (
              <div
                key={note.id}
                className="group mb-1.5 flex items-start gap-2 rounded-lg p-2 transition-colors hover:bg-secondary/30"
              >
                <div
                  className="mt-0.5 h-3 w-3 shrink-0 rounded-sm border cursor-pointer transition-colors hover:opacity-80"
                  style={{ borderColor: note.color, backgroundColor: `${note.color}20` }}
                  onClick={() => toggleNote(note.id)}
                  role="checkbox"
                  aria-checked={false}
                  aria-label={`Mark "${note.text}" as done`}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleNote(note.id) }}
                />
                <span className="flex-1 text-sm text-foreground leading-relaxed">{note.text}</span>
                <button
                  onClick={() => removeNote(note.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive transition-all"
                  aria-label={`Remove "${note.text}"`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Done */}
        {doneNotes.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 mb-1">
              Completed ({doneNotes.length})
            </p>
            {doneNotes.map((note) => (
              <div
                key={note.id}
                className="group mb-1.5 flex items-start gap-2 rounded-lg p-2 transition-colors hover:bg-secondary/30"
              >
                <div
                  className="mt-0.5 h-3 w-3 shrink-0 rounded-sm cursor-pointer"
                  style={{ backgroundColor: note.color }}
                  onClick={() => toggleNote(note.id)}
                  role="checkbox"
                  aria-checked={true}
                  aria-label={`Mark "${note.text}" as not done`}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleNote(note.id) }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="flex-1 text-sm text-muted-foreground line-through leading-relaxed">{note.text}</span>
                <button
                  onClick={() => removeNote(note.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive transition-all"
                  aria-label={`Remove "${note.text}"`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {notes.length === 0 && !showInput && (
          <div className="flex flex-1 flex-col items-center justify-center py-8">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-muted-foreground/20 mb-2" aria-hidden="true">
              <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 10h12M10 14h8M10 18h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            </svg>
            <p className="text-xs text-muted-foreground/30">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
