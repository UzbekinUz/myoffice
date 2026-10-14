// ===== API MIJOZI =====
// Barcha so'rovlar shu orqali ketadi. Token localStorage'da saqlanadi va avtomatik qo'shiladi.
import axios from 'axios'

export const TOKEN_KEY = 'dm_token'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Token eskirsa — admin sahifasidan login sahifasiga qaytaramiz
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const onAdmin = location.pathname.startsWith('/admin') && !location.pathname.endsWith('/login')
    if (err.response?.status === 401 && onAdmin) {
      localStorage.removeItem(TOKEN_KEY)
      location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

export default api
export const errMsg = (e) => e?.response?.data?.message || e?.message || 'Xatolik'
