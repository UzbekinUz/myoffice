// ===== YENGIL 3D "TILT" KARTOCHKA =====
// Kursor ustida bo'lganda kartochka biroz (4°) buriladi.
// Qulaylik: onClick bo'lsa klaviatura (Tab, Enter, Space) bilan ham ochiladi.
// Sensorli ekran yoki "animatsiyani kamaytirish" yoqilgan bo'lsa, burilish o'chiriladi.
import { useRef } from 'react'

const calm = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(pointer: coarse)').matches)

export default function TiltCard({ children, className = '', max = 4, onClick, ...rest }) {
  const el = useRef(null)

  const onMove = (e) => {
    if (calm()) return
    const r = el.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.current.style.transform = `perspective(1000px) rotateY(${(px - 0.5) * max * 2}deg) rotateX(${(0.5 - py) * max * 2}deg)`
    el.current.style.setProperty('--mx', `${px * 100}%`)
    el.current.style.setProperty('--my', `${py * 100}%`)
  }
  const onLeave = () => { el.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)' }

  const a11y = onClick
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e) }
        },
      }
    : {}

  return (
    <div
      ref={el}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`glass relative overflow-hidden hoverable transition-transform duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${className}`}
      {...a11y}
      {...rest}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
           style={{ background: 'radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.05), transparent 60%)' }} />
      <div className="relative">{children}</div>
    </div>
  )
}
