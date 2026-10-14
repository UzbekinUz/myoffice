// ===== YUQORI MENYU =====
// Harakat: pastga skroll qilganda yashirinadi, yuqoriga qaytganda chiqadi (aqlli sarlavha);
// havolalarda chiziq "chizilishi"; light/night almashganda aylana shaklida yoyiladigan o'tish.
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useI18n, BRAND } from '../lib/i18n.jsx'
import { useTheme } from '../lib/theme.jsx'
import { EASE, SPRING, prefersReducedMotion } from '../lib/motion.js'

export default function Navbar() {
  const { lang, setLang, t } = useI18n()
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  // Aqlli sarlavha: tez pastga ketganda yashirin, yuqoriga qaytganda ko'rinadi
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 20)
    setHidden(y > 160 && y > prev && !open)
  })

  // Light/Night: bosilgan joydan aylana bo'lib yoyiladi (View Transitions API, bo'lmasa oddiy almashish)
  const switchTheme = (e) => {
    const x = e.clientX, y = e.clientY
    if (!document.startViewTransition || prefersReducedMotion()) return toggle()
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const tr = document.startViewTransition(() => toggle())
    tr.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
      )
    }).catch(() => {})
  }

  const links = [['about', t.nav.about], ['demos', t.nav.demos], ['process', t.nav.process], ['pricing', t.nav.pricing], ['contact', t.nav.contact]]

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 ${scrolled ? 'py-2' : 'py-4'}`}
      animate={{ y: hidden ? '-110%' : 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className={`max-w-6xl mx-auto px-4 ${scrolled ? 'glass nav-blur' : ''} flex items-center justify-between h-14`}>
        <a href="#top" className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-head)' }}>{BRAND}<span className="text-accent">.</span></a>

        <nav className="hidden md:flex gap-7 text-sm">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="link-underline text-muted hover:text-fg transition-colors">{label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="glass flex p-1 text-xs !rounded-xl relative">
            {['uz', 'en', 'ru'].map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={`relative px-2.5 py-1 rounded-lg uppercase font-semibold transition-colors ${lang === l ? 'text-[var(--on-accent)]' : 'text-muted'}`}>
                {/* Faol til "siljib" boradigan fon: holat o'zgarishi animatsiyasi */}
                {lang === l && (
                  <motion.span layoutId="lang-pill" transition={SPRING}
                    className="absolute inset-0 rounded-lg bg-accent" />
                )}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>

          <button onClick={switchTheme} aria-label="theme"
            className="glass hoverable w-10 h-10 !rounded-xl flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme}
                initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}>
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button onClick={() => setOpen(!open)} aria-label="menu" aria-expanded={open}
            className="md:hidden glass w-10 h-10 !rounded-xl flex items-center justify-center">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobil menyu: yumshoq ochiladi */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="md:hidden glass nav-blur mx-4 mt-2 p-4 flex flex-col gap-3">
            {links.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
