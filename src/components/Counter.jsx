// ===== RAQAMLI SANAGICH =====
// Ekranga kirganda 0 dan berilgan songa qadar animatsiya bilan o'sadi.
import { useEffect, useRef, useState } from 'react'

export default function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const step = (now) => {
        const p = Math.min((now - start) / 1400, 1)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3)))) // easeOutCubic
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [to])

  return <span ref={ref}>{n}{suffix}</span>
}
