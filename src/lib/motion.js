// ===== HARAKAT TIZIMI (Motion design tokens) =====
// Barcha animatsiyalar shu yerdagi bir xil "temp" va "egri chiziq"dan foydalanadi —
// shuning uchun sayt yaxlit, bir ohangda "harakatlanadi".
//
//   EASE   — silliq, "premium" (sekin tugaydi). Kirish, paydo bo'lish uchun.
//   SPRING — jonli, tez javob beradigan prujina. Tugma, tab, chip kabi holat o'zgarishlari uchun.
//
// Samaradorlik qoidasi: faqat transform va opacity animatsiya qilinadi (GPU, sahifani qotirmaydi).
export const EASE = [0.22, 1, 0.36, 1]
export const SPRING = { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }
export const SPRING_SOFT = { type: 'spring', stiffness: 120, damping: 24, mass: 0.6 }

// Skroll paytida paydo bo'lish: <motion.div {...reveal(0.1)}>
export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: EASE, delay },
})

// Bola elementlar ketma-ket chiqishi uchun
export const stagger = (gap = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
})
export const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

// Foydalanuvchi tizimda "animatsiyani kamaytirish"ni yoqqanmi
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
