// ===== UMUMIY ADMIN CRUD SAHIFASI =====
// Kategoriya, Demo, Tarif — uchalasi bitta ResourcePage komponenti orqali ishlaydi.
// Har biri uchun faqat "fields" (forma maydonlari) tavsifi beriladi.
//
// Maydon turlari:
//   ml      — ko'p tilli qisqa matn (uz/en/ru)
//   mlarea  — ko'p tilli uzun matn
//   mllist  — ko'p tilli ro'yxat (har qatorda bitta element)
//   text, number, color, checkbox, tags (vergul bilan), image (yuklash), category (tanlash)
import { useEffect, useState } from 'react'
import { Pencil, Trash2, MonitorPlay } from 'lucide-react'
import Icon, { ICONS } from '../../components/Icon.jsx'
import api, { errMsg } from '../../lib/api.js'
import { useConfirm, useToast } from '../../components/Dialog.jsx'

const LANGS = ['uz', 'en', 'ru']

// ----- Rasm yuklash maydoni -----
function ImageField({ value, onChange }) {
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const upload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBusy(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const { data } = await api.post('/upload', fd)
      onChange(data.url)
    } catch (er) {
      toast(errMsg(er), 'error')
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="space-y-2">
      {value && <img src={value} alt="" className="h-32 rounded-xl object-cover border border-[var(--border)]" />}
      <input type="file" accept="image/*" onChange={upload} className="text-sm text-muted" />
      <input className="input" placeholder="yoki rasm URL manzili" value={value || ''} onChange={(e) => onChange(e.target.value)} />
      {busy && <p className="text-xs text-accent">Yuklanmoqda...</p>}
    </div>
  )
}

// ----- Bitta maydonni chizish -----
function Field({ f, value, onChange, categories }) {
  switch (f.type) {
    case 'ml':
    case 'mlarea':
      return (
        <div className="space-y-2">
          {LANGS.map((l) => (
            <div key={l} className="flex gap-2 items-start">
              <span className="text-xs uppercase text-accent w-6 pt-3">{l}</span>
              {f.type === 'ml' ? (
                <input className="input" value={value?.[l] || ''} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />
              ) : (
                <textarea rows={2} className="input" value={value?.[l] || ''} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />
              )}
            </div>
          ))}
        </div>
      )
    case 'mllist':
      // Massivni matnga (har qatorda bitta) aylantiramiz va aksincha
      return (
        <div className="space-y-2">
          {LANGS.map((l) => (
            <div key={l} className="flex gap-2 items-start">
              <span className="text-xs uppercase text-accent w-6 pt-3">{l}</span>
              <textarea rows={3} className="input" placeholder="Har qatorga bitta imkoniyat"
                value={(value?.[l] || []).join('\n')}
                onChange={(e) => onChange({ ...value, [l]: e.target.value.split('\n') })} />
            </div>
          ))}
        </div>
      )
    case 'checkbox':
      return <input type="checkbox" className="w-5 h-5 accent-[var(--accent2)]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
    case 'color':
      return <input type="color" value={value || '#22d3ee'} onChange={(e) => onChange(e.target.value)} className="w-16 h-10 rounded bg-transparent" />
    case 'number':
      return <input type="number" className="input" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />
    case 'tags':
      return <input className="input" placeholder="React, Node, MongoDB" value={(value || []).join(', ')}
        onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
    case 'icon':
      // Ikonkalar to'ri: bosib tanlanadi
      return (
        <div className="flex flex-wrap gap-2">
          {Object.keys(ICONS).map((n) => (
            <button type="button" key={n} title={n} onClick={() => onChange(n)}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center ${value === n ? 'border-[var(--accent)] text-accent bg-[var(--card)]' : 'border-[var(--border)] text-muted'}`}>
              <Icon name={n} size={20} />
            </button>
          ))}
        </div>
      )
    case 'image':
      return <ImageField value={value} onChange={onChange} />
    case 'category':
      return (
        <select className="input" value={value || ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">— tanlang —</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.title?.uz}</option>)}
        </select>
      )
    default:
      return <input className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} />
  }
}

function ResourcePage({ title, endpoint, fields, empty, summary, needsCategories }) {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null) // null | {} (yangi) | mavjud obyekt
  const [error, setError] = useState('')
  const confirm = useConfirm()
  const toast = useToast()

  const load = async () => {
    try {
      const { data } = await api.get(endpoint)
      setItems(data)
      if (needsCategories) setCategories((await api.get('/categories')).data)
    } catch (er) {
      toast(errMsg(er), 'error')
    }
  }
  useEffect(() => { load() }, [endpoint])

  const save = async (e) => {
    e.preventDefault()
    setError('')
    // Populate qilingan kategoriya obyektini yuborishdan oldin id ga aylantiramiz
    const body = { ...editing }
    if (body.category && typeof body.category === 'object') body.category = body.category._id
    try {
      if (editing._id) await api.put(`${endpoint}/${editing._id}`, body)
      else await api.post(endpoint, body)
      setEditing(null)
      toast('Saqlandi')
      load()
    } catch (er) {
      setError(errMsg(er))
    }
  }

  const remove = async (item) => {
    const ok = await confirm({
      title: "O'chirishni tasdiqlang",
      message: "Bu amalni qaytarib bo'lmaydi.",
      confirmText: "O'chirish",
      danger: true,
    })
    if (!ok) return
    try {
      await api.delete(`${endpoint}/${item._id}`)
      toast("O'chirildi")
      load()
    } catch (er) {
      toast(errMsg(er), 'error') // masalan: ichida demo bor kategoriyani o'chirib bo'lmaydi
    }
  }

  const init = () => Object.fromEntries(fields.map((f) => [f.name, f.default ?? (f.type === 'checkbox' ? false : f.type === 'number' ? 0 : undefined)]))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button className="btn-neon !py-2" onClick={() => setEditing(init())}>+ Qo'shish</button>
      </div>

      {items.length === 0 && <p className="text-muted">{empty}</p>}
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it._id} className="glass p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">{summary(it)}</div>
            <button className="btn-ghost !py-1.5 !px-3 text-sm" onClick={() => setEditing(it)} aria-label="Tahrirlash"><Pencil size={16} /></button>
            <button className="btn-ghost !py-1.5 !px-3 text-sm" onClick={() => remove(it)} aria-label="O'chirish"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      {/* Tahrirlash oynasi */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="glass !bg-[var(--bg)] w-full max-w-2xl p-6 my-8 space-y-5">
            <h2 className="text-xl font-bold">{editing._id ? 'Tahrirlash' : "Yangi qo'shish"}</h2>
            {fields.map((f) => (
              <div key={f.name}>
                <label className="label">{f.label}</label>
                <Field f={f} value={editing[f.name]} categories={categories}
                  onChange={(v) => setEditing({ ...editing, [f.name]: v })} />
              </div>
            ))}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button className="btn-neon">Saqlash</button>
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Bekor qilish</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

// ===== KATEGORIYALAR =====
export const Categories = () => (
  <ResourcePage
    title="Kategoriyalar (xonalar)" endpoint="/categories" empty="Kategoriya yo'q"
    fields={[
      { name: 'title', label: 'Nomi', type: 'ml' },
      { name: 'description', label: 'Tavsif', type: 'mlarea' },
      { name: 'icon', label: 'Ikonka', type: 'icon', default: 'Rocket' },
      { name: 'color', label: 'Neon rangi', type: 'color', default: '#22d3ee' },
      { name: 'order', label: 'Tartib raqami', type: 'number' },
    ]}
    summary={(c) => <div className="flex items-center gap-3"><Icon name={c.icon} size={22} className="text-accent" /><b>{c.title?.uz}</b>
      <span className="w-4 h-4 rounded-full" style={{ background: c.color }} /></div>}
  />
)

// ===== DEMOLAR =====
export const Demos = () => (
  <ResourcePage
    title="Demolar" endpoint="/demos" empty="Demo yo'q" needsCategories
    fields={[
      { name: 'category', label: 'Kategoriya', type: 'category' },
      { name: 'title', label: 'Sarlavha', type: 'ml' },
      { name: 'description', label: 'Tavsif', type: 'mlarea' },
      { name: 'image', label: 'Rasm', type: 'image' },
      { name: 'url', label: 'Demo havolasi', type: 'text' },
      { name: 'tags', label: 'Texnologiyalar (vergul bilan)', type: 'tags' },
      { name: 'featured', label: 'TOP demo', type: 'checkbox' },
      { name: 'order', label: 'Tartib raqami', type: 'number' },
    ]}
    summary={(d) => (
      <div className="flex items-center gap-3">
        {d.image ? <img src={d.image} alt="" className="w-14 h-10 rounded object-cover" /> : <MonitorPlay size={22} className="text-muted" />}
        <div className="min-w-0"><b className="block truncate">{d.title?.uz}</b>
          <span className="text-xs text-muted">{d.category?.title?.uz}</span></div>
      </div>
    )}
  />
)

// ===== TARIFLAR =====
export const Plans = () => (
  <ResourcePage
    title="Tariflar" endpoint="/plans" empty="Tarif yo'q"
    fields={[
      { name: 'name', label: 'Tarif nomi', type: 'ml' },
      { name: 'price', label: 'Narx (masalan: 5 000 000 yoki $300)', type: 'text' },
      { name: 'period', label: 'Davr (masalan: bir martalik)', type: 'ml' },
      { name: 'features', label: 'Imkoniyatlar', type: 'mllist' },
      { name: 'highlighted', label: 'Mashhur (ajratib ko\'rsatish)', type: 'checkbox' },
      { name: 'order', label: 'Tartib raqami', type: 'number' },
    ]}
    summary={(p) => <div><b>{p.name?.uz}</b> <span className="text-accent ml-2">{p.price}</span>
      {p.highlighted && <span className="ml-2 text-xs text-accent3">mashhur</span>}</div>}
  />
)
