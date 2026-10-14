// ===== SAYT KONTENTI: FAQ, "Qanday ishlayman", texnologiyalar =====
// Bu bo'limlar bo'sh qoldirilsa, saytda standart matnlar ko'rinadi.
// Kamida bitta element qo'shsangiz — standart o'rniga sizning matnlaringiz chiqadi.
import { useEffect, useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import api, { errMsg } from '../../lib/api.js'
import { useToast } from '../../components/Dialog.jsx'

const LANGS = ['uz', 'en', 'ru']

// Ko'p tilli maydon (uz/en/ru)
function ML({ label, value, onChange, area }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="space-y-2">
        {LANGS.map((l) => (
          <div key={l} className="flex gap-2 items-start">
            <span className="text-xs uppercase text-accent w-6 pt-3">{l}</span>
            {area
              ? <textarea rows={2} className="input" value={value?.[l] || ''} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />
              : <input className="input" value={value?.[l] || ''} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />}
          </div>
        ))}
      </div>
    </div>
  )
}

// Ro'yxat bloki: elementlarni qo'shish/o'chirish
function ListBlock({ title, hint, items, setItems, blank, render }) {
  const update = (i, v) => setItems(items.map((it, k) => (k === i ? v : it)))
  return (
    <section className="glass p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-lg">{title}</h2>
          <p className="text-sm text-muted">{hint}</p>
        </div>
        <button type="button" className="btn-ghost !py-2" onClick={() => setItems([...items, blank])}><Plus size={16} /> Qo'shish</button>
      </div>
      {items.length === 0 && <p className="text-sm text-muted">Bo'sh — saytda standart matnlar ko'rinadi.</p>}
      {items.map((it, i) => (
        <div key={i} className="border border-[var(--border)] rounded-xl p-4 space-y-3">
          {render(it, (v) => update(i, v))}
          <button type="button" className="text-sm text-red-400 inline-flex items-center gap-1.5"
            onClick={() => setItems(items.filter((_, k) => k !== i))}><Trash2 size={15} /> O'chirish</button>
        </div>
      ))}
    </section>
  )
}

export default function Content() {
  const toast = useToast()
  const [faq, setFaq] = useState(null)
  const [steps, setSteps] = useState([])
  const [stack, setStack] = useState([])

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      setFaq(data.faq || [])
      setSteps(data.process || [])
      setStack(data.stack || [])
    }).catch((er) => toast(errMsg(er), 'error'))
  }, [])
  if (!faq) return <p className="text-muted">Yuklanmoqda...</p>

  const save = async () => {
    try {
      await api.put('/settings', { faq, process: steps, stack })
      toast('Saqlandi')
    } catch (er) { toast(errMsg(er), 'error') }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sayt kontenti</h1>
        <button className="btn-neon !py-2" onClick={save}><Save size={16} /> Saqlash</button>
      </div>

      <ListBlock title="Ko'p so'raladigan savollar (FAQ)" hint="Savol va javob, 3 tilda"
        items={faq} setItems={setFaq} blank={{ q: {}, a: {} }}
        render={(it, set) => (
          <>
            <ML label="Savol" value={it.q} onChange={(q) => set({ ...it, q })} />
            <ML label="Javob" value={it.a} area onChange={(a) => set({ ...it, a })} />
          </>
        )} />

      <ListBlock title="Qanday ishlayman (jarayon bosqichlari)" hint="Tartib bo'yicha 01, 02, 03... deb ko'rsatiladi"
        items={steps} setItems={setSteps} blank={{ title: {}, text: {} }}
        render={(it, set) => (
          <>
            <ML label="Sarlavha" value={it.title} onChange={(title) => set({ ...it, title })} />
            <ML label="Tavsif" value={it.text} area onChange={(text) => set({ ...it, text })} />
          </>
        )} />

      <ListBlock title="Texnologiyalar" hint="Guruh nomi va vergul bilan ajratilgan texnologiyalar"
        items={stack} setItems={setStack} blank={{ group: '', items: [] }}
        render={(it, set) => (
          <>
            <div>
              <label className="label">Guruh nomi (masalan: Frontend)</label>
              <input className="input" value={it.group || ''} onChange={(e) => set({ ...it, group: e.target.value })} />
            </div>
            <div>
              <label className="label">Texnologiyalar (vergul bilan)</label>
              <input className="input" placeholder="React, Vite, TailwindCSS"
                value={(it.items || []).join(', ')}
                onChange={(e) => set({ ...it, items: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
            </div>
          </>
        )} />
    </div>
  )
}
