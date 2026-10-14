// ===== MARSHRUTLAR =====
// /            -> ommaviy sayt (ofis)
// /admin/login -> admin kirish
// /admin/*     -> admin panel (token bo'lmasa login'ga yo'naltiriladi)
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/admin/Login.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import { Categories, Demos, Plans } from './pages/admin/Resources.jsx'
import Inquiries from './pages/admin/Inquiries.jsx'
import Settings from './pages/admin/Settings.jsx'
import Content from './pages/admin/Content.jsx'
import { TOKEN_KEY } from './lib/api.js'

function Protected({ children }) {
  return localStorage.getItem(TOKEN_KEY) ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Protected><AdminLayout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="demos" element={<Demos />} />
        <Route path="plans" element={<Plans />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="content" element={<Content />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
