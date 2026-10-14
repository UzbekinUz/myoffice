import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import { I18nProvider } from './lib/i18n.jsx'
import { ThemeProvider } from './lib/theme.jsx'
import { DialogProvider } from './components/Dialog.jsx'
import { EASE } from './lib/motion.js'
import './index.css'

// ===== TUGMA "RIPPLE" EFFEKTI =====
// Bitta global tinglovchi: .btn-neon va .btn-ghost bosilganda bosilgan nuqtadan to'lqin yoyiladi.
// (Har bir tugmaga alohida kod yozish shart emas.)
document.addEventListener('pointerdown', (e) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const btn = e.target.closest?.('.btn-neon, .btn-ghost')
  if (!btn || btn.disabled) return
  const r = btn.getBoundingClientRect()
  const size = Math.max(r.width, r.height) * 2
  const span = document.createElement('span')
  span.className = 'ripple'
  span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`
  btn.appendChild(span)
  span.addEventListener('animationend', () => span.remove())
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* future bayroqlari: React Router v7 ogohlantirishlarini o'chiradi */}
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* reducedMotion="user": tizimda "animatsiyani kamaytirish" yoqilgan bo'lsa siljish animatsiyalari o'chadi.
          transition: barcha animatsiyalar uchun standart temp va egri chiziq. */}
      <MotionConfig reducedMotion="user" transition={{ duration: 0.5, ease: EASE }}>
        <ThemeProvider>
          <I18nProvider>
            <DialogProvider>
              <App />
            </DialogProvider>
          </I18nProvider>
        </ThemeProvider>
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>
)
