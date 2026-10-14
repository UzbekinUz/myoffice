// ===== YANGI SO'ROV ALERTI (admin panel) =====
// Har 15 soniyada o'qilmagan so'rovlarni tekshiradi. Yangisi kelsa — blur fonli oyna chiqadi.
// Shuningdek yon menyudagi nishon uchun o'qilmaganlar sonini yuqoriga uzatadi.
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BellRing, X, User, Phone, Tag, MessageSquare } from 'lucide-react'
import api from '../lib/api.js'

export default function InquiryAlert({ onCount }) {
  const nav = useNavigate()
  const [queue, setQueue] = useState([])       // ko'rsatilishi kutilayotgan yangi so'rovlar
  const dismissed = useRef(new Set())          // shu sessiyada yopilganlar

  const check = async () => {
    try {
      // Yengil so'rov: faqat o'qilmaganlar (eng ko'pi 20 ta) + umumiy son
      const { data } = await api.get('/inquiries/unread')
      onCount?.(data.count)
      setQueue(data.items.filter((q) => !dismissed.current.has(q._id)))
    } catch { /* tarmoq xatosi — keyingi safar */ }
  }

  useEffect(() => {
    check()
    const id = setInterval(check, 15000)
    return () => clearInterval(id)
  }, [])

  const current = queue[0]

  // Esc bilan yopish
  useEffect(() => {
    if (!current) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current?._id])
  const close = () => {
    dismissed.current.add(current._id)
    setQueue((q) => q.slice(1))
  }
  const markRead = async () => {
    await api.put(`/inquiries/${current._id}`, { read: true })
    dismissed.current.add(current._id)
    check()
  }
  const open = () => { close(); nav('/admin/inquiries') }

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current._id}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="alertdialog" aria-modal="true" aria-label="Yangi so'rov"
            className="glass !bg-[var(--bg)] w-full max-w-md p-6"
            initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent text-[var(--on-accent)]">
                  <BellRing size={20} />
                </span>
                <div>
                  <h2 className="font-bold text-lg leading-tight">Yangi so'rov</h2>
                  <p className="text-xs text-muted">{new Date(current.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button onClick={close} className="text-muted hover:text-fg"><X size={20} /></button>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex gap-3"><User size={17} className="text-accent shrink-0 mt-0.5" /><span>{current.name}</span></div>
              <div className="flex gap-3"><Phone size={17} className="text-accent shrink-0 mt-0.5" /><span>{current.contact}</span></div>
              {current.plan && <div className="flex gap-3"><Tag size={17} className="text-accent shrink-0 mt-0.5" /><span>{current.plan}</span></div>}
              {current.message && (
                <div className="flex gap-3"><MessageSquare size={17} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-muted whitespace-pre-wrap">{current.message}</span></div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button className="btn-neon !py-2" onClick={markRead}>O'qildi</button>
              <button className="btn-ghost !py-2" onClick={open}>So'rovlarga o'tish</button>
            </div>
            {queue.length > 1 && <p className="text-xs text-muted mt-4">Yana {queue.length - 1} ta yangi so'rov bor</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
