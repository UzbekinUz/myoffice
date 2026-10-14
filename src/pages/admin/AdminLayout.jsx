// ===== ADMIN PANEL MAKETI: yon menyu + kontent =====
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import InquiryAlert from '../../components/InquiryAlert.jsx'
import { LayoutDashboard, FolderTree, MonitorPlay, Tag, Inbox, Settings, Globe, Moon, Sun, LogOut, FileText } from 'lucide-react'
import { TOKEN_KEY } from '../../lib/api.js'
import { useTheme } from '../../lib/theme.jsx'
import Background from '../../components/Background.jsx'

const items = [
  ['/admin', LayoutDashboard, 'Boshqaruv', true],
  ['/admin/categories', FolderTree, 'Kategoriyalar'],
  ['/admin/demos', MonitorPlay, 'Demolar'],
  ['/admin/plans', Tag, 'Tariflar'],
  ['/admin/inquiries', Inbox, "So'rovlar"],
  ['/admin/content', FileText, 'Kontent'],
  ['/admin/settings', Settings, 'Sozlamalar'],
]

export default function AdminLayout() {
  const nav = useNavigate()
  const { theme, toggle } = useTheme()
  const [unread, setUnread] = useState(0) // o'qilmagan so'rovlar soni (nishon uchun)

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    nav('/admin/login')
  }

  return (
    <div className="min-h-screen md:flex">
      <Background />
      <InquiryAlert onCount={setUnread} />
      <aside className="glass md:w-60 md:m-4 md:sticky md:top-4 md:h-[calc(100vh-2rem)] p-4 flex md:flex-col gap-2 overflow-x-auto !rounded-2xl m-2">
        <div className="hidden md:block font-display font-extrabold text-xl text-gradient px-3 py-3">Admin</div>
        {items.map(([to, Ico, label, end]) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${isActive ? 'bg-accent2 text-white shadow-lg' : 'text-muted hover:text-fg hover:bg-white/5'}`}>
            <Ico size={17} /> {label}
            {to === '/admin/inquiries' && unread > 0 && (
              <span className="ml-auto text-xs px-1.5 min-w-5 text-center rounded-full bg-accent3 text-white">{unread}</span>
            )}
          </NavLink>
        ))}
        <div className="md:mt-auto flex md:flex-col gap-2">
          <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted hover:text-accent whitespace-nowrap"><Globe size={17} /> Sayt</a>
          <button onClick={toggle} className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted text-left whitespace-nowrap">{theme === 'dark' ? <><Moon size={17} /> Night</> : <><Sun size={17} /> Light</>}</button>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 text-left whitespace-nowrap"><LogOut size={17} /> Chiqish</button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
