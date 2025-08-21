'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTheme, toggleTheme } from '@/lib/storage'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    async function loadTheme() {
      const stored = await getTheme()
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial = stored ?? (prefersDark ? 'dark' : 'light')
      applyTheme(initial)
    }
    loadTheme()
  }, [])

  async function handleToggle() {
    const next = await toggleTheme()
    applyTheme(next)
  }

  function applyTheme(next: 'light' | 'dark') {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(next)
    setTheme(next)
  }

  return (
    <Button variant="outline" size="icon" onClick={handleToggle} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
