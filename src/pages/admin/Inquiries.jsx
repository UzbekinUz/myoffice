// ===== MIJOZ SO'ROVLARI (sahifalangan) =====
import { useEffect, useState } from 'react'
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import api, { errMsg } from '../../lib/api.js'
import { useConfirm, useToast } from '../../components/Dialog.jsx'

export default function Inquiries() {
  const confirm = useConfirm()
  const toast = useToast()
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [page, setPage] = useState(1)
  const [unreadOnly, setUnreadOnly] = useState(false)

  const load = async () => {
    try {
      const { data } = await api.get('/inquiries', { params: { page, limit: 15, unread: unreadOnly ? 1 : undefined } })
      setData(data)
    } catch (er) { toast(errMsg(er), 'error') }
  }
  useEffect(() => { load() }, [page, unreadOnly])

  const toggle = async (q) => { await api.put(`/inquiries/${q._id}`, { read: !q.read }); load() }
  const remove = async (id) => {
    const ok = await confirm({ title: "So'rovni o'chirasizmi?", message: "Bu amalni qaytarib bo'lmaydi.", confirmText: "O'chirish", danger: true })
    if (!ok) return
    await api.delete(`/inquiries/${id}`)
    toast("O'chirildi")
    // Oxirgi sahifadagi oxirgi element o'chsa — oldingi sahifaga qaytamiz
    if (data.items.length === 1 && page > 1) setPage(page - 1)
    else load()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">So'rovlar <span className="text-muted text-base font-normal">({data.total})</span></h1>
        <div className="flex gap-2">
          <button className={`chip ${!unreadOnly ? 'chip-active' : ''}`} onClick={() => { setUnreadOnly(false); setPage(1) }}>Hammasi</button>
          <button className={`chip ${unreadOnly ? 'chip-active' : ''}`} onClick={() => { setUnreadOnly(true); setPage(1) }}>O'qilmagan</button>
        </div>
      </div>

      {data.items.length === 0 && <p className="text-muted">Hozircha so'rov yo'q</p>}
      <div className="space-y-3">
        {data.items.map((q) => (
          <div key={q._id} className={`glass p-5 ${q.read ? 'opacity-60' : 'is-accent'}`}>
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div>
                <b>{q.name}</b> <span className="text-accent ml-2">{q.contact}</span>
                {!q.read && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-accent3 text-white">yangi</span>}
              </div>
              <div className="text-xs text-muted">
                {new Date(q.createdAt).toLocaleString()} · {q.telegramSent ? 'Telegramga ketdi' : 'Telegramga ketmadi'}
              </div>
            </div>
            {q.plan && <div className="text-sm mt-2 text-accent">Tarif: {q.plan}</div>}
            {q.message && <p className="text-muted text-sm mt-2 whitespace-pre-wrap">{q.message}</p>}
            <div className="flex gap-2 mt-4">
              <button className="btn-ghost !py-1.5 !px-3 text-sm" onClick={() => toggle(q)}>{q.read ? "O'qilmagan" : "O'qilgan"}</button>
              <button className="btn-ghost !py-1.5 !px-3 text-sm" aria-label="O'chirish" onClick={() => remove(q._id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {data.pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="btn-ghost !py-2 !px-3" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Oldingi"><ChevronLeft size={18} /></button>
          <span className="text-sm text-muted">{data.page} / {data.pages}</span>
          <button className="btn-ghost !py-2 !px-3" disabled={page >= data.pages} onClick={() => setPage(page + 1)} aria-label="Keyingi"><ChevronRight size={18} /></button>
        </div>
      )}
    </div>
  )
}
