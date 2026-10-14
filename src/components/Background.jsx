// ===== ORQA FON =====
// Kam sonli, past ko'rinishdagi nuqtalar va ingichka chiziqlar. Maqsad: e'tibor kontentda bo'lsin.
// Nuqtalar kursordan biroz itariladi (jonli, lekin bezovta qilmaydigan harakat).
import { useEffect, useRef } from 'react'
import { useTheme } from '../lib/theme.jsx'

export default function Background() {
  const { theme } = useTheme()
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dark = theme === 'dark'
    let w, h, raf
    const mouse = { x: -999, y: -999 }
    let pts = []

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      const n = Math.min(40, Math.floor((w * h) / 40000))
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }))
    }
    const move = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }

    const rgb = dark ? '148,163,184' : '71,85,105'

    const draw = () => {
      // Modal (masalan jonli demo) ochiq bo'lsa — hisoblamaymiz, protsessorni iframe'ga qoldiramiz
      if (document.documentElement.classList.contains('modal-open')) { raf = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const d = Math.hypot(dx, dy)
        if (d < 110 && d > 0) { p.x += (dx / d) * 1.1; p.y += (dy / d) * 1.1 }
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.2, 0, 6.28)
        ctx.fillStyle = `rgba(${rgb},0.35)`
        ctx.fill()
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (d < 140) {
            ctx.strokeStyle = `rgba(${rgb},${0.1 * (1 - d / 140)})`
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    // "Animatsiyani kamaytirish" yoqilgan bo'lsa — bir marta chizib, harakatsiz qoldiramiz
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pts.forEach((p) => { p.vx = 0; p.vy = 0 })
      draw()
      cancelAnimationFrame(raf)
    } else {
      draw()
    }
    // Tab yashirin bo'lsa chizishni to'xtatamiz (batareya va protsessor tejash)
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw()
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', move)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', move)
    }
  }, [theme])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  )
}
