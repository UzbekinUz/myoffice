// ===== LIGHT / NIGHT REJIM =====
// <html class="dark"> — ranglar va effektlar index.css da.
// Eslatma: dizayn uslubi bitta (Klassik) — qo'shimcha uslublar olib tashlangan.
import { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const v = localStorage.getItem('dm_theme')
      return v === 'light' ? 'light' : 'dark'
    } catch { return 'dark' }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('dm_theme', theme)
      localStorage.removeItem('dm_style') // eski uslub tanlovi endi kerak emas
    } catch { /* ignore */ }
  }, [theme])

  // Sinxron: sinf darhol almashadi (View Transition animatsiyasi to'g'ri "keyingi holat"ni ko'rishi uchun)
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    setTheme(next)
  }

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
