// ===== HARAKAT KOMPONENTLARI =====
import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { EASE, prefersReducedMotion } from '../lib/motion.js'

// ---- Skroll progressi: sahifa tepasidagi ingichka chiziq ----
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-accent z-[70]"
    />
  )
}

// ---- So'zma-so'z ochiladigan sarlavha (maska ichidan ko'tarilish) ----
// parts: [{ text, className? }]  — masalan oxirgi qismni rangli qilish uchun
export function RevealText({ as: Tag = 'h1', parts, className = '', delay = 0.1 }) {
  const label = parts.map((p) => p.text).join(' ')
  let n = 0
  return (
    <Tag className={className} aria-label={label}>
      {parts.map((p, pi) =>
        p.text.split(' ').map((word, wi) => {
          const k = n++
          return (
            <span key={`${pi}-${wi}`} aria-hidden="true"
              className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.25em]">
              <motion.span
                className={`inline-block ${p.className || ''}`}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, ease: EASE, delay: delay + k * 0.06 }}
              >
                {word}
              </motion.span>
            </span>
          )
        })
      )}
    </Tag>
  )
}

// ---- Magnit effekti: tugma kursorga biroz ergashadi ----
export function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 })

  const move = (e) => {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} onMouseMove={move} onMouseLeave={leave} style={{ x: sx, y: sy }} className="inline-block">
      {children}
    </motion.div>
  )
}

// ---- Kod "yozilish" animatsiyasi: qatorlar ketma-ket paydo bo'ladi, oxirida kursor miltillaydi ----
export function TypedLines({ lines, delay = 0.6, step = 0.16 }) {
  return (
    <div>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: delay + i * step }}
          className="min-h-[1.4em] whitespace-pre"
        >
          {line}
          {i === lines.length - 1 && <span className="caret" aria-hidden="true" />}
        </motion.div>
      ))}
    </div>
  )
}
