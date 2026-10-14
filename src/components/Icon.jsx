// ===== IKONKALAR (Lucide kutubxonasi) =====
// Kategoriya ikonkasi bazada NOM sifatida saqlanadi (masalan "Globe").
// Admin panelda shu ro'yxatdan tanlanadi. Eski emoji qiymatlar ham buzilmaydi.
import {
  BarChart3, Globe, Bot, Zap, Shield, Rocket, Database, Smartphone, ShoppingCart, Users,
  Cpu, Code2, Palette, Briefcase, MessageSquare, Workflow, Cloud, FileText, Layers,
} from 'lucide-react'

export const ICONS = {
  BarChart3, Globe, Bot, Zap, Shield, Rocket, Database, Smartphone, ShoppingCart, Users,
  Cpu, Code2, Palette, Briefcase, MessageSquare, Workflow, Cloud, FileText, Layers,
}

export default function Icon({ name, size = 22, className = '' }) {
  const Cmp = ICONS[name]
  if (Cmp) return <Cmp size={size} className={className} strokeWidth={1.8} />
  // Eski emoji yoki noma'lum qiymat bo'lsa
  if (name) return <span className={className} style={{ fontSize: size }}>{name}</span>
  return <Layers size={size} className={className} strokeWidth={1.8} />
}
