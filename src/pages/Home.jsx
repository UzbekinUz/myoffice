// ===== ASOSIY SAHIFA =====
// Tartib: Hero -> Statistika -> Men haqimda -> Yo'nalishlar -> Demolar
//         -> Jarayon (scrollytelling) -> Tariflar -> FAQ -> Aloqa
//
// HARAKAT (motion design) xaritasi:
//   Hero      : so'zma-so'z ochiladigan sarlavha, ketma-ket kirish, kod "yoziladi", parallax, magnitli tugma
//   Skroll    : yuqorida progress chizig'i, bo'limlar tagidan ko'tarilib chiqadi (stagger)
//   Jarayon   : "scrollytelling" — skroll bilan chiziq to'lib boradi, faol bosqich yonib turadi
//   Holatlar  : filtr tabida sirpanuvchi fon, FAQ silliq ochiladi, tugma yuborish holatlari o'zgaradi
//   Mikro     : kartochka ko'tariladi, rasm zoom, ikonka burilishi, strelka siljishi
import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Monitor, Smartphone, ExternalLink, RefreshCw, X, Plus, ArrowRight, Loader2 } from 'lucide-react'
import {
  motion, AnimatePresence, useScroll, useTransform, useSpring, useInView,
} from 'framer-motion'
import Icon from '../components/Icon.jsx'
import api, { errMsg } from '../lib/api.js'
import { useI18n, BRAND, STACK } from '../lib/i18n.jsx'
import { EASE, SPRING, reveal, stagger, rise } from '../lib/motion.js'
import Background from '../components/Background.jsx'
import Navbar from '../components/Navbar.jsx'
import TiltCard from '../components/TiltCard.jsx'
import Counter from '../components/Counter.jsx'
import { ScrollProgress, RevealText, Magnetic, TypedLines } from '../components/Motion.jsx'

// Bo'lim sarlavhasi: yorliq -> sarlavha -> chiziladigan aksent chizig'i
function SectionTitle({ eyebrow, title, sub }) {
  return (
    <motion.div {...reveal()} className="mb-12 max-w-2xl">
      <div className="eyebrow mb-2">{eyebrow}</div>
      <h2 className="text-3xl md:text-5xl">{title}</h2>
      <motion.span
        className="block h-[3px] w-14 bg-accent mt-5 origin-left rounded-full"
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
      />
      {sub && <p className="text-muted mt-4">{sub}</p>}
    </motion.div>
  )
}

export default function Home() {
  const { t, lang, pick, pickList } = useI18n()
  const [categories, setCategories] = useState([])
  const [demos, setDemos] = useState([])
  const [plans, setPlans] = useState([])
  const [profile, setProfile] = useState({})
  const [filter, setFilter] = useState('all')
  const [preview, setPreview] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  const load = () => {
    setLoading(true)
    setFailed(false)
    Promise.all([api.get('/categories'), api.get('/demos'), api.get('/plans'), api.get('/settings/public')])
      .then(([c, d, p, s]) => { setCategories(c.data); setDemos(d.data); setPlans(p.data); setProfile(s.data) })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  // SEO: sarlavha va tavsif tanlangan tilga mos o'zgaradi
  useEffect(() => {
    document.title = `${profile.ownerName ? profile.ownerName + ' — ' : ''}${BRAND}: ${t.common.seoTitle}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.common.seoDesc)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${BRAND}: ${t.common.seoTitle}`)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.common.seoDesc)
  }, [lang, profile.ownerName])

  // Admin paneldan kiritilgan kontent bo'lsa — o'sha, bo'lmasa standart matnlar
  const stack = profile.stack?.length ? profile.stack.map((g) => [g.group, g.items]) : STACK
  const processSteps = profile.process?.length ? profile.process.map((s) => [pick(s.title), pick(s.text)]) : t.process.steps
  const faqItems = profile.faq?.length ? profile.faq.map((f) => [pick(f.q), pick(f.a)]) : t.faq.items

  const shown = useMemo(
    () => (filter === 'all' ? demos : demos.filter((d) => d.category?._id === filter)),
    [demos, filter]
  )
  const countOf = (id) => demos.filter((d) => d.category?._id === id).length
  const stackCount = stack.reduce((n, [, items]) => n + items.length, 0)

  const goDemos = (id) => {
    setFilter(id)
    document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' })
  }
  const choosePlan = (p) => {
    setSelectedPlan(`${pick(p.name)} — ${p.price}`)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Statistika faqat haqiqiy qiymatlardan: 0 bo'lsa ko'rsatilmaydi
  const stats = [
    [demos.length, t.stats.demos],
    [categories.length, t.stats.rooms],
    [profile.years || 0, t.stats.years],
    [stackCount, t.stats.stack],
  ].filter(([n]) => n > 0)

  // Hero parallaksi: skroll qilganda kod oynasi sekinroq siljiydi (chuqurlik tuyg'usi)
  const { scrollY } = useScroll()
  const codeY = useTransform(scrollY, [0, 700], [0, -70])
  const codeYSmooth = useSpring(codeY, { stiffness: 120, damping: 24, mass: 0.4 })

  const codeLines = [
    <><span className="text-accent">api</span>.post(<span className="text-muted">'/inquiries'</span>, async (req, res) =&gt; {'{'}</>,
    '  const { name, contact, plan } = req.body',
    '  if (!name || !contact)',
    "    return res.status(400).json({ message: 'Required' })",
    '',
    '  const q = await Inquiry.create({ name, contact, plan })',
    <>  await sendTelegram(inquiryText(q))   <span className="text-muted">// </span><span className="text-accent">notify owner</span></>,
    '',
    '  res.status(201).json({ ok: true })',
    '})',
  ]

  return (
    <div id="top" className="min-h-screen">
      <ScrollProgress />
      <Background />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="max-w-6xl mx-auto px-4 pt-36 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 text-sm text-muted rounded-full px-3 py-1 mb-6 shadow-[0_0_0_1px_var(--border)]">
            {/* Yashil nuqta "jonli" holatni bildirib pulsatsiya qiladi */}
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500" />
            </span>
            {t.hero.badge}
            {profile.ownerName && <span className="text-fg">· {profile.ownerName}</span>}
          </motion.span>

          <RevealText
            as="h1" className="text-4xl md:text-6xl leading-[1.05]"
            parts={[{ text: t.hero.title1 }, { text: t.hero.title2, className: 'text-gradient' }]}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
            className="text-muted text-lg mt-6 max-w-lg">{t.hero.sub}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
            className="flex flex-wrap gap-3 mt-8">
            <Magnetic><a href="#demos" className="btn-neon">{t.hero.cta1} <ArrowRight size={18} /></a></Magnetic>
            <Magnetic><a href="#pricing" className="btn-ghost">{t.hero.cta2}</a></Magnetic>
          </motion.div>
        </div>

        {/* Kod oynasi: kirish animatsiyasi + qatorlar "yoziladi" + skrollda parallaks */}
        <motion.div style={{ y: codeYSmooth }} className="hidden sm:block">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            className="glass overflow-hidden font-mono text-[13px]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <span className="w-3 h-3 rounded-full bg-green-400/80" />
              <span className="ml-3 text-muted text-xs">server/routes/inquiries.js</span>
            </div>
            <div className="p-5 leading-relaxed text-muted overflow-x-auto">
              <TypedLines lines={codeLines} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATISTIKA ===== */}
      {stats.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(([n, label], i) => (
              <motion.div key={label} {...reveal(i * 0.08)} className="glass p-6">
                <div className="text-4xl font-bold tabular-nums"><Counter to={n} /></div>
                <div className="text-muted text-sm mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ===== MEN HAQIMDA ===== */}
      <section id="about" className="max-w-6xl mx-auto px-4 pb-28 scroll-mt-24">
        <SectionTitle eyebrow={t.about.eyebrow} title={t.about.title} />
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div {...reveal()}>
            <p className="text-lg leading-relaxed whitespace-pre-line">{pick(profile.about) || t.about.fallback}</p>
            <motion.ul variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-6 space-y-3">
              {t.about.points.map((p) => (
                <motion.li variants={rise} key={p} className="flex gap-3 text-muted">
                  <Check size={18} className="text-accent mt-0.5 shrink-0" />{p}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          <motion.div {...reveal(0.1)} className="glass p-6">
            <div className="eyebrow mb-4">{t.about.stack}</div>
            <div className="space-y-4">
              {stack.map(([group, items]) => (
                <div key={group} className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted w-24 shrink-0">{group}</span>
                  {items.map((i) => (
                    <span key={i}
                      className="text-sm px-2.5 py-1 rounded-md shadow-[0_0_0_1px_var(--border)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_var(--accent)]">
                      {i}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== YO'NALISHLAR (KATEGORIYALAR) ===== */}
      <section id="rooms" className="max-w-6xl mx-auto px-4 pb-28 scroll-mt-24">
        <SectionTitle eyebrow={t.rooms.eyebrow} title={t.rooms.title} sub={t.rooms.sub} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c, i) => (
            <motion.div key={c._id} {...reveal((i % 3) * 0.09)}>
              <TiltCard className="group lift p-6 cursor-pointer h-full" onClick={() => goDemos(c._id)}>
                {/* Mikro-animatsiya: ikonka biroz burilib kattalashadi */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[-8deg] group-hover:scale-110"
                     style={{ background: `color-mix(in srgb, ${c.color} 16%, transparent)` }}>
                  <Icon name={c.icon} size={24} />
                </div>
                <h3 className="text-lg">{pick(c.title)}</h3>
                <p className="text-muted text-sm mt-2">{pick(c.description)}</p>
                <div className="mt-4 text-sm text-accent inline-flex items-center gap-1.5">
                  {countOf(c._id)} {t.rooms.count}
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== DEMOLAR ===== */}
      <section id="demos" className="max-w-6xl mx-auto px-4 pb-28 scroll-mt-24">
        <SectionTitle eyebrow={t.demos.eyebrow} title={t.demos.title} sub={t.demos.sub} />

        {/* Filtr: faol tab ustiga sirpanib o'tuvchi fon (layoutId) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[{ _id: 'all' }, ...categories].map((c) => {
            const active = filter === c._id
            return (
              <button key={c._id} onClick={() => setFilter(c._id)}
                className={`chip flex items-center gap-1.5 ${active ? '!shadow-none' : ''}`}
                style={{ color: active ? 'var(--btn-fg)' : undefined }}>
                {active && (
                  <motion.span layoutId="filter-pill" transition={SPRING}
                    className="absolute inset-0 -z-0 rounded-[var(--radius-pill)]" style={{ background: 'var(--btn-bg)' }} />
                )}
                <span className="relative flex items-center gap-1.5">
                  {c._id !== 'all' && <Icon name={c.icon} size={16} />}
                  {c._id === 'all' ? t.rooms.all : pick(c.title)}
                </span>
              </button>
            )
          })}
        </div>

        {failed && (
          <div className="glass p-6 flex flex-wrap items-center gap-4" role="alert">
            <span className="text-muted">{t.common.loadError}</span>
            <button className="btn-ghost !py-2" onClick={load}><RefreshCw size={16} /> {t.common.retry}</button>
          </div>
        )}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="glass overflow-hidden animate-pulse">
                <div className="aspect-video bg-[var(--border)]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-2/3 rounded bg-[var(--border)]" />
                  <div className="h-3 w-full rounded bg-[var(--border)]" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !failed && shown.length === 0 && <p className="text-muted">{t.demos.empty}</p>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {shown.map((d, i) => (
              <motion.div key={d._id} layout
                initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 5) * 0.05 }}>
                <TiltCard className="group lift cursor-pointer h-full flex flex-col p-1.5" onClick={() => setPreview(d)}>
                  <div className="aspect-video bg-black/10 overflow-hidden rounded-[calc(var(--radius)-6px)]">
                    {d.image
                      ? <img src={d.image} alt="" className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" />
                      : <div className="w-full h-full flex items-center justify-center opacity-50"><Icon name={d.category?.icon} size={40} /></div>}
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-muted mb-1">{pick(d.category?.title)}{d.featured && ' · ★ TOP'}</div>
                    <h3 className="text-lg">{pick(d.title)}</h3>
                    <p className="text-muted text-sm mt-1 line-clamp-2">{pick(d.description)}</p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {d.tags?.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-md shadow-[0_0_0_1px_var(--border)] text-muted">{tag}</span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ===== JARAYON: SCROLLYTELLING ===== */}
      <ProcessStory steps={processSteps} eyebrow={t.process.eyebrow} title={t.process.title} />

      {/* ===== TARIFLAR ===== */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 pb-28 scroll-mt-24">
        <SectionTitle eyebrow={t.pricing.eyebrow} title={t.pricing.title} sub={t.pricing.sub} />
        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {plans.map((p, i) => (
            <motion.div key={p._id} {...reveal(i * 0.1)}>
              <TiltCard className={`lift p-7 h-full flex flex-col ${p.highlighted ? 'is-accent' : ''}`}>
                {p.highlighted && (
                  <span className="absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full bg-accent text-[var(--on-accent)] font-semibold">{t.pricing.popular}</span>
                )}
                <h3 className="text-lg">{pick(p.name)}</h3>
                <div className="mt-4">
                  <div className="text-4xl font-bold tracking-tight tabular-nums">{p.price}</div>
                  <div className="text-muted text-sm mt-1">{pick(p.period)}</div>
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {pickList(p.features).map((f, k) => (
                    <li key={k} className="flex gap-2 text-sm"><Check size={16} className="text-accent mt-0.5 shrink-0" />{f}</li>
                  ))}
                </ul>
                <button onClick={() => choosePlan(p)} className={`mt-8 w-full ${p.highlighted ? 'btn-neon' : 'btn-ghost'}`}>
                  {t.pricing.choose}
                </button>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="max-w-3xl mx-auto px-4 pb-28 scroll-mt-24">
        <SectionTitle eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <div className="space-y-3">
          {faqItems.map(([q, a], i) => <FaqItem key={q} q={q} a={a} delay={i * 0.07} />)}
        </div>
      </section>

      {/* ===== ALOQA ===== */}
      <section id="contact" className="max-w-3xl mx-auto px-4 pb-24 scroll-mt-24">
        <SectionTitle eyebrow={t.contact.eyebrow} title={t.contact.title} sub={t.contact.sub} />
        <motion.div {...reveal()}>
          <ContactForm selectedPlan={selectedPlan} contact={profile} />
        </motion.div>
      </section>

      <footer className="border-t border-[var(--border)] text-center text-muted text-sm py-8">
        © {new Date().getFullYear()} {BRAND}. {t.footer}
      </footer>

      {/* ===== DEMO MODALI =====
          AnimatePresence ataylab yo'q: ichidagi layoutId (sirpanuvchi tab) bilan birga chiqish animatsiyasi
          oynani yopilmay qotib qolishiga sabab bo'lgan. Kirish animatsiyasi saqlangan. */}
      {preview && <DemoModal demo={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}

// ===== SCROLLYTELLING: jarayon bosqichlari skroll bilan "hikoya" bo'lib ochiladi =====
// Chap tomonda sticky sarlavha va katta raqam, o'ng tomonda bosqichlar. Skroll qilgan sari
// vertikal chiziq to'lib boradi va navbatdagi bosqich yonadi, chapdagi raqam almashadi.
function ProcessStory({ steps, eyebrow, title }) {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 })

  return (
    <section id="process" ref={ref} className="max-w-6xl mx-auto px-4 pb-28 scroll-mt-24">
      <div className="grid lg:grid-cols-[1fr_1.35fr] gap-12">
        <div className="lg:sticky lg:top-28 self-start">
          <SectionTitle eyebrow={eyebrow} title={title} />
          <div className="hidden lg:block" aria-hidden="true">
            <div className="relative h-28 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={active}
                  initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-0 font-bold tabular-nums text-accent leading-none"
                  style={{ fontFamily: 'var(--font-head)', fontSize: '6.5rem' }}>
                  0{active + 1}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="text-muted text-sm mt-2">0{active + 1} / 0{steps.length}</div>
          </div>
        </div>

        <ol className="relative pl-10 space-y-8">
          {/* Vertikal chiziq: skroll progressiga qarab to'lib boradi */}
          <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[var(--border)] rounded-full">
            <motion.div style={{ scaleY: fill }} className="origin-top h-full w-full bg-accent rounded-full" />
          </div>
          {steps.map(([stepTitle, text], i) => (
            <ProcessStep key={stepTitle} index={i} title={stepTitle} text={text} onActive={() => setActive(i)} />
          ))}
        </ol>
      </div>
    </section>
  )
}

function ProcessStep({ index, title, text, onActive }) {
  const ref = useRef(null)
  // Ekran o'rtasidagi tor "zona"ga kirganda bosqich faol hisoblanadi
  const inView = useInView(ref, { margin: '-42% 0px -42% 0px' })
  useEffect(() => { if (inView) onActive() }, [inView])

  return (
    <li ref={ref} className="relative">
      <motion.span
        animate={{ scale: inView ? 1 : 0.7, backgroundColor: inView ? 'var(--accent)' : 'var(--card)' }}
        transition={SPRING}
        className="absolute -left-10 top-5 w-6 h-6 rounded-full shadow-[0_0_0_1px_var(--border)] flex items-center justify-center text-[10px] font-bold"
        style={{ color: 'var(--on-accent)' }}>
        {inView ? index + 1 : ''}
      </motion.span>
      <motion.div
        animate={{ opacity: inView ? 1 : 0.5, x: inView ? 0 : -6 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`glass p-6 ${inView ? 'is-accent' : ''}`}>
        <h3 className="text-xl">{title}</h3>
        <p className="text-muted mt-2 leading-relaxed">{text}</p>
      </motion.div>
    </li>
  )
}

// ===== FAQ elementi: balandlik silliq ochiladi, "+" burilib "×" ga aylanadi =====
function FaqItem({ q, a, delay = 0 }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div {...reveal(delay)} className={`glass ${open ? 'is-accent' : 'hoverable'}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}
        className="w-full text-left p-5 font-medium flex items-center justify-between gap-4">
        {q}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={SPRING} className="text-accent shrink-0">
          <Plus size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
            <p className="text-muted text-sm px-5 pb-5 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ===== DEMO MODALI: tafsilot + jonli ko'rish (iframe) =====
function DemoModal({ demo, onClose }) {
  const { t, pick } = useI18n()
  const [mode, setMode] = useState('details') // details | live
  const [device, setDevice] = useState('desktop') // desktop | mobile
  const closeBtn = useRef(null)
  const frameRef = useRef(null)
  // Demo havolasi sayt o'zining manzili bo'lsa iframe ochilmaydi (o'zini o'zi ichiga joylash sahifani qotiradi)
  const sameOrigin = (() => { try { return new URL(demo.url).origin === location.origin } catch { return false } })()

  // Esc bilan yopish, ochilganda fokusni oynaga olish, orqa sahifa skrollini to'xtatish
  useEffect(() => {
    closeBtn.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Modal ochiq paytda fon animatsiyasi to'xtaydi (Background.jsx shu sinfni tekshiradi)
    document.documentElement.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      document.documentElement.classList.remove('modal-open')
      // Yopilganda iframe ichidagi sahifa (video, skript) darhol to'xtatiladi
      if (frameRef.current) frameRef.current.src = 'about:blank'
    }
  }, [])

    // Diqqat: overlay'da backdrop-blur ATAYLAB yo'q — iframe ustidan blur har kadrda qayta hisoblanib sahifani qotiradi.
  return (
    <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label={pick(demo.title)}
        className="glass w-full max-w-4xl max-h-[92vh] overflow-y-auto !bg-[var(--bg)]"
        initial={{ scale: 0.94, y: 24, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 12, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between gap-3 p-4 border-b border-[var(--border)]">
          <h3 className="text-lg font-bold truncate">{pick(demo.title)}</h3>
          <div className="flex items-center gap-2">
            {demo.url && (
              <div className="glass flex p-1 text-sm !rounded-xl">
                {[['details', t.common.details], ['live', t.common.live]].map(([k, label]) => (
                  <button key={k} onClick={() => setMode(k)}
                    className={`relative px-3 py-1 rounded-lg ${mode === k ? 'text-[var(--on-accent)]' : 'text-muted'}`}>
                    {mode === k && (
                      <motion.span layoutId="modal-tab" transition={SPRING} className="absolute inset-0 rounded-lg bg-accent" />
                    )}
                    <span className="relative">{label}</span>
                  </button>
                ))}
              </div>
            )}
            <button ref={closeBtn} onClick={onClose} aria-label={t.demos.close}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-fg hover:rotate-90 transition-all duration-300"><X size={20} /></button>
          </div>
        </div>

        {/* Rejimlar orasida yumshoq kirish (chiqish animatsiyasi ataylab yo'q: u oynani osib qo'ygan edi) */}
        <div>
          <motion.div key={mode}
            initial={{ opacity: 0, x: mode === 'live' ? 24 : -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: EASE }}>
            {mode === 'details' ? (
              <div>
                {demo.image && <img src={demo.image} alt="" className="w-full max-h-96 object-cover" />}
                <div className="p-6">
                  <p className="text-muted whitespace-pre-line">{pick(demo.description)}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {demo.tags?.map((tag) => <span key={tag} className="chip !cursor-default">{tag}</span>)}
                  </div>
                  {demo.url && (
                    <div className="flex flex-wrap gap-3 mt-6">
                      <button className="btn-neon" onClick={() => setMode('live')}><Monitor size={18} /> {t.common.live}</button>
                      <a href={demo.url} target="_blank" rel="noreferrer" className="btn-ghost"><ExternalLink size={18} /> {t.common.newTab}</a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex gap-2">
                    <button onClick={() => setDevice('desktop')} className={`chip flex items-center gap-1.5 ${device === 'desktop' ? 'chip-active' : ''}`}><Monitor size={15} /> {t.common.desktop}</button>
                    <button onClick={() => setDevice('mobile')} className={`chip flex items-center gap-1.5 ${device === 'mobile' ? 'chip-active' : ''}`}><Smartphone size={15} /> {t.common.mobile}</button>
                  </div>
                  <a href={demo.url} target="_blank" rel="noreferrer" className="text-sm text-accent inline-flex items-center gap-1.5"><ExternalLink size={15} /> {t.common.newTab}</a>
                </div>
                {/* Qurilma ramkasi: kenglik silliq o'zgaradi */}
                <div className="mx-auto rounded-2xl border-[6px] border-[var(--border)] overflow-hidden bg-white transition-[max-width] duration-500"
                  style={{ maxWidth: device === 'mobile' ? 390 : '100%' }}>
                  {sameOrigin ? (
                    <div className="p-8 text-sm text-neutral-600">Bu havola saytning o'zi. Yangi oynada oching.</div>
                  ) : (
                  <iframe
                    ref={frameRef}
                    title={pick(demo.title)} src={demo.url} loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    referrerPolicy="no-referrer"
                    className={`w-full block ${device === 'mobile' ? 'h-[640px]' : 'h-[520px]'}`}
                  />
                  )}
                </div>
                <p className="text-xs text-muted mt-3">{t.common.iframeHint}</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ===== ALOQA FORMASI =====
// Yuborish tugmasi holatlari animatsiya bilan almashadi: matn -> spinner -> galochka
function ContactForm({ selectedPlan, contact }) {
  const { t } = useI18n()
  const [form, setForm] = useState({ name: '', contact: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | ok | err
  const openedAt = useRef(Date.now()) // forma qachon ochilgani (botlarni aniqlash uchun)
  const [honey, setHoney] = useState('') // odamga ko'rinmaydi; bot to'ldirsa — so'rov rad etiladi
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await api.post('/inquiries', { ...form, plan: selectedPlan, website: honey, elapsed: Date.now() - openedAt.current })
      setStatus('ok')
      setForm({ name: '', contact: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (er) {
      console.error(errMsg(er))
      setStatus('err')
    }
  }

  const label = {
    idle: <><span>{t.contact.send}</span><ArrowRight size={18} /></>,
    sending: <><Loader2 size={18} className="animate-spin" /><span>{t.contact.sending}</span></>,
    ok: <><Check size={18} /><span>{t.contact.ok}</span></>,
    err: <span>{t.contact.err}</span>,
  }

  return (
    <div className="glass p-7 relative">
      <form onSubmit={submit} className="space-y-4">
        {/* Spam tuzog'i: ekrandan tashqarida, klaviatura va ekran o'quvchidan yashirin */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
          value={honey} onChange={(e) => setHoney(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
        <div className="grid sm:grid-cols-2 gap-4">
          <input required className="input" placeholder={t.contact.name} value={form.name} onChange={set('name')} />
          <input required className="input" placeholder={t.contact.contact} value={form.contact} onChange={set('contact')} />
        </div>
        <AnimatePresence>
          {selectedPlan && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="text-sm text-accent overflow-hidden">
              {t.contact.plan}: <b>{selectedPlan}</b>
            </motion.div>
          )}
        </AnimatePresence>
        <textarea rows={4} className="input" placeholder={t.contact.message} value={form.message} onChange={set('message')} />

        <motion.button
          disabled={status === 'sending'}
          animate={{ backgroundColor: status === 'ok' ? '#16a34a' : status === 'err' ? '#dc2626' : undefined }}
          className="btn-neon w-full" style={status === 'ok' || status === 'err' ? { color: '#fff' } : undefined}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={status} className="inline-flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: EASE }}>
              {label[status]}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </form>

      <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-[var(--border)] text-sm text-muted">
        {contact.contactPhone && <a href={`tel:${contact.contactPhone}`} className="link-underline hover:text-fg">{contact.contactPhone}</a>}
        {contact.contactTelegram && (
          <a href={`https://t.me/${contact.contactTelegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="link-underline hover:text-fg">{contact.contactTelegram}</a>
        )}
        {contact.contactEmail && <a href={`mailto:${contact.contactEmail}`} className="link-underline hover:text-fg">{contact.contactEmail}</a>}
      </div>
    </div>
  )
}
