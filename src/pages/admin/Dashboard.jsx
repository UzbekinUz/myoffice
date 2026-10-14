// ===== ADMIN BOSHQARUV (statistika) =====
import { useEffect, useState } from 'react'
import { FolderTree, MonitorPlay, Tag, Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../lib/api.js'
import Counter from '../../components/Counter.jsx'

export default function Dashboard() {
  const [s, setS] = useState(null)
  const [err, setErr] = useState(false)
  useEffect(() => { api.get('/stats').then((r) => setS(r.data)).catch(() => setErr(true)) }, [])
  if (err) return <p className="text-red-400">Ma'lumotni yuklab bo'lmadi. Server ishlayotganini tekshiring.</p>
  if (!s) return <p className="text-muted">Yuklanmoqda...</p>

  const cards = [
    [FolderTree, 'Kategoriyalar', s.categories, '/admin/categories'],
    [MonitorPlay, 'Demolar', s.demos, '/admin/demos'],
    [Tag, 'Tariflar', s.plans, '/admin/plans'],
    [Inbox, "Yangi so'rovlar", s.unread, '/admin/inquiries'],
  ]
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Boshqaruv paneli</h1>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(([Ico, label, n, to]) => (
          <Link key={label} to={to} className="glass hoverable p-6">
            <Ico size={26} className="text-accent" />
            <div className="text-4xl font-bold mt-3"><Counter to={n} /></div>
            <div className="text-muted text-sm mt-1">{label}</div>
          </Link>
        ))}
      </div>
      <p className="text-muted text-sm mt-8">Jami so'rovlar: {s.inquiries}</p>
    </div>
  )
}
