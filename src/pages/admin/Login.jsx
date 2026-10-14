// ===== ADMIN KIRISH SAHIFASI =====
// Login+parol -> POST /api/auth/login -> JWT token localStorage'ga saqlanadi
import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api, { errMsg, TOKEN_KEY } from '../../lib/api.js'
import Background from '../../components/Background.jsx'

export default function Login() {
  const nav = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem(TOKEN_KEY, data.token)
      nav('/admin')
    } catch (er) {
      setError(errMsg(er))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Background />
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 w-full max-w-sm space-y-5">
        <div className="text-center">
          <Lock size={32} className="mx-auto mb-2 text-accent" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <input className="input" placeholder="Login" autoFocus value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="input" type="password" placeholder="Parol" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button disabled={loading} className="btn-neon w-full">{loading ? '...' : 'Kirish'}</button>
        <a href="/" className="block text-center text-sm text-muted hover:text-accent">← Saytga qaytish</a>
      </motion.form>
    </div>
  )
}
