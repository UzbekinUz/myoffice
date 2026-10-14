// ===== SOZLAMALAR: Telegram bot, aloqa ma'lumotlari, parol =====
import { useEffect, useState } from 'react'
import { Send, User, Phone, KeyRound } from 'lucide-react'
import api, { errMsg, TOKEN_KEY } from '../../lib/api.js'

export default function Settings() {
  const [s, setS] = useState(null)
  const [msg, setMsg] = useState('')
  const [pw, setPw] = useState({ currentPassword: '', newUsername: '', newPassword: '' })
  const [pwMsg, setPwMsg] = useState('')
  const [chats, setChats] = useState([]) // avtomatik topilgan chatlar

  useEffect(() => { api.get('/settings').then((r) => setS(r.data)) }, [])
  if (!s) return <p className="text-muted">Yuklanmoqda...</p>

  const set = (k) => (e) => setS({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const save = async (e) => {
    e.preventDefault()
    try {
      await api.put('/settings', s)
      setMsg('Saqlandi')
    } catch (er) { setMsg('Xato: ' + errMsg(er)) }
  }
  const test = async () => {
    try {
      await api.put('/settings', s) // avval saqlaymiz, keyin sinaymiz
      await api.post('/settings/telegram-test')
      setMsg('Test xabar Telegramga yuborildi')
    } catch (er) { setMsg('Xato: ' + errMsg(er)) }
  }
  // Botga /start yozgan odamning chat ID sini topadi (token avval saqlanadi)
  const detect = async () => {
    try {
      await api.put('/settings', s)
      const { data } = await api.post('/settings/telegram-detect', { token: s.telegramToken })
      setChats(data.chats)
      setMsg(data.chats.length === 1 ? '' : 'Chatni tanlang')
      if (data.chats.length === 1) setS({ ...s, telegramChatId: data.chats[0].id })
    } catch (er) { setMsg('Xato: ' + errMsg(er)); setChats([]) }
  }
  const changePw = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.put('/auth/credentials', pw)
      localStorage.setItem(TOKEN_KEY, data.token)
      setPw({ currentPassword: '', newUsername: '', newPassword: '' })
      setPwMsg('Yangilandi')
    } catch (er) { setPwMsg('Xato: ' + errMsg(er)) }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Sozlamalar</h1>

      <form onSubmit={save} className="glass p-6 space-y-4">
        <h2 className="font-bold text-lg flex items-center gap-2"><Send size={18} className="text-accent" /> Telegram bot</h2>
        <p className="text-sm text-muted">
          1) @BotFather orqali bot yarating va token oling. 2) Tokenni kiriting va Saqlang. 3) Botingizga Telegramda /start yozing. 4) "Chat ID ni avtomatik topish" tugmasini bosing.
        </p>
        <div>
          <label className="label">Bot token {s.telegramTokenSet && '(saqlangan — o\'zgartirish uchun yangisini kiriting)'}</label>
          <input className="input" placeholder={s.telegramToken || '123456:ABC...'} onChange={(e) => setS({ ...s, telegramToken: e.target.value })} />
        </div>
        <div>
          <label className="label">Chat ID</label>
          <div className="flex gap-2">
            <input className="input" value={s.telegramChatId || ''} onChange={set('telegramChatId')} />
            <button type="button" className="btn-ghost whitespace-nowrap" onClick={detect}>Avto-aniqlash</button>
          </div>
          {chats.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {chats.map((c) => (
                <button type="button" key={c.id} className="chip" onClick={() => { setS({ ...s, telegramChatId: c.id }); setChats([]) }}>
                  {c.name} ({c.id})
                </button>
              ))}
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="w-4 h-4 accent-[var(--accent2)]" checked={s.telegramEnabled} onChange={set('telegramEnabled')} />
          Yangi so'rovlar Telegramga yuborilsin
        </label>

        <h2 className="font-bold text-lg pt-4 flex items-center gap-2"><User size={18} className="text-accent" /> Profil ("Men haqimda" va statistika)</h2>
        <input className="input" placeholder="Ismingiz (hero'da ko'rinadi)" value={s.ownerName || ''} onChange={set('ownerName')} />
        <div>
          <label className="label">Tajriba (yil). 0 bo'lsa saytda ko'rsatilmaydi</label>
          <input type="number" min="0" className="input" value={s.years || 0} onChange={(e) => setS({ ...s, years: Number(e.target.value) })} />
        </div>
        {['uz', 'en', 'ru'].map((l) => (
          <div key={l}>
            <label className="label">O'zingiz haqingizda ({l.toUpperCase()})</label>
            <textarea rows={3} className="input" value={s.about?.[l] || ''}
              onChange={(e) => setS({ ...s, about: { ...s.about, [l]: e.target.value } })} />
          </div>
        ))}

        <h2 className="font-bold text-lg pt-4 flex items-center gap-2"><Phone size={18} className="text-accent" /> Aloqa ma'lumotlari (saytda ko'rinadi)</h2>
        <input className="input" placeholder="Telefon: +998..." value={s.contactPhone || ''} onChange={set('contactPhone')} />
        <input className="input" placeholder="Telegram: @username" value={s.contactTelegram || ''} onChange={set('contactTelegram')} />
        <input className="input" placeholder="Email" value={s.contactEmail || ''} onChange={set('contactEmail')} />

        <div className="flex flex-wrap gap-3 items-center">
          <button className="btn-neon">Saqlash</button>
          <button type="button" className="btn-ghost" onClick={test}>Test xabar yuborish</button>
          <span className="text-sm">{msg}</span>
        </div>
      </form>

      <form onSubmit={changePw} className="glass p-6 space-y-4">
        <h2 className="font-bold text-lg flex items-center gap-2"><KeyRound size={18} className="text-accent" /> Login va parol</h2>
        <input className="input" type="password" placeholder="Joriy parol" value={pw.currentPassword}
          onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
        <input className="input" placeholder="Yangi login (ixtiyoriy)" value={pw.newUsername}
          onChange={(e) => setPw({ ...pw, newUsername: e.target.value })} />
        <input className="input" type="password" placeholder="Yangi parol (kamida 8 belgi)" value={pw.newPassword}
          onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
        <div className="flex items-center gap-3">
          <button className="btn-neon">Yangilash</button>
          <span className="text-sm">{pwMsg}</span>
        </div>
      </form>
    </div>
  )
}
