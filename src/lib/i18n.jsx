// ===== KO'P TILLILIK (uz / en / ru) =====
// Sayt matnlari shu yerda. Demo/kategoriya/tarif matnlari va "Men haqimda" admin paneldan keladi.
import { createContext, useContext, useState, useEffect } from 'react'

export const BRAND = 'DemoMaker' // <- sayt nomini shu yerdan o'zgartiring

// Texnologiyalar guruhlari (tilga bog'liq emas)
export const STACK = [
  ['Frontend', ['React', 'Vite', 'TailwindCSS', 'Framer Motion', 'React Router']],
  ['Backend', ['Node.js', 'Express', 'REST API', 'JWT', 'Multer']],
  ['Database', ['MongoDB', 'Mongoose']],
  ['Tools', ['Git', 'Telegram Bot API', 'Nginx', 'PM2']],
]

const dict = {
  uz: {
    nav: { about: 'Haqimda', rooms: 'Xonalar', demos: 'Demolar', process: 'Jarayon', pricing: 'Tariflar', contact: 'Aloqa' },
    hero: {
      badge: 'Full-stack dasturchi',
      title1: 'CRM, avtomatlashtirish va web-saytlar',
      title2: 'biznesingiz uchun',
      sub: "Noldan yozilgan, sizning jarayoningizga moslangan dasturlar. Pastda yaratgan ishlarimni ko'rishingiz va narxlar bilan tanishishingiz mumkin.",
      cta1: "Ishlarni ko'rish", cta2: 'Narxlar',
    },
    stats: { demos: 'Demo ish', rooms: "Yo'nalish", years: 'Yil tajriba', stack: 'Texnologiya' },
    about: {
      title: 'Men haqimda', eyebrow: 'Kim bilan ishlaysiz',
      fallback: "Men full-stack dasturchiman. Biznes uchun CRM tizimlar, avtomatlashtirish dasturlari va web-saytlarni noldan yarataman: dizayndan tortib serverga joylashgacha.",
      stack: 'Texnologiyalar',
      points: ['Tayyor shablon emas, aynan sizning jarayoningizga yozilgan kod', "Kodga to'liq egalik: manba kodi sizga topshiriladi", "Ishga tushirgandan keyin ham qo'llab-quvvatlash"],
    },
    rooms: { title: 'Yo\'nalishlar', eyebrow: 'Xonalar', sub: "Har bir xona — alohida yo'nalish. Bosing va ichidagi ishlarni ko'ring.", all: 'Barchasi', count: 'ta demo' },
    demos: { title: 'Yaratilgan ishlar', eyebrow: 'Portfolio', sub: 'Haqiqiy loyihalardan namunalar', open: 'Demoni ochish', empty: "Hozircha demo yo'q", close: 'Yopish' },
    process: {
      title: 'Qanday ishlayman', eyebrow: 'Jarayon',
      steps: [
        ['Muhokama', "Vazifa, maqsad va kerakli funksiyalar aniqlanadi. Narx va muddat kelishiladi."],
        ['Dizayn va reja', "Sahifalar tuzilmasi va ma'lumotlar bazasi rejalashtiriladi, kelishib olinadi."],
        ['Dasturlash', "Bosqichma-bosqich yoziladi, har bosqichda natijani ko'rib borasiz."],
        ['Topshirish', "Serverga joylanadi, o'rgatiladi, manba kodi va qo'llab-quvvatlash beriladi."],
      ],
    },
    pricing: { title: 'Tariflar', eyebrow: 'Narxlar', sub: "Aniq narx. Aniq loyiha uchun tarif individual hisoblanadi.", choose: 'Tanlash', popular: 'Mashhur' },
    faq: {
      title: "Ko'p so'raladigan savollar", eyebrow: 'FAQ',
      items: [
        ['Loyiha qancha vaqt oladi?', "Landing sahifa 3–7 kun, admin panelli sayt 2–3 hafta, to'liq CRM 1–2 oy. Aniq muddat vazifaga qarab kelishiladi."],
        ["To'lov qanday amalga oshiriladi?", "Odatda ish boshlashdan oldin avans, qolgani topshirishda. Katta loyihalarda bosqichma-bosqich."],
        ["Sayt tayyor bo'lgach o'zgartirib bo'ladimi?", "Ha. Admin panel orqali kontentni o'zingiz boshqarasiz, kod o'zgarishlari uchun qo'llab-quvvatlash bor."],
        ['Hosting va domen kimning zimmasida?', "Hosting va domenni o'zingiz rasmiylashtirasiz (men yordam beraman), joylashtirishni men bajaraman."],
      ],
    },
    contact: {
      title: "Loyihangizni muhokama qilamiz", eyebrow: 'Aloqa', sub: "Ma'lumotingizni qoldiring — tez orada bog'lanaman",
      name: 'Ismingiz', contact: 'Telefon yoki Telegram', message: 'Qisqacha vazifa (ixtiyoriy)', plan: 'Tanlangan tarif',
      send: 'Yuborish', sending: 'Yuborilmoqda...', ok: "Rahmat! So'rovingiz qabul qilindi.", err: "Xatolik, qayta urinib ko'ring",
    },
    footer: 'Barcha huquqlar himoyalangan',
    common: {
      loadError: "Ma'lumotlarni yuklab bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.", retry: 'Qayta urinish',
      live: "Jonli ko'rish", details: "Tafsilotlar", desktop: 'Kompyuter', mobile: 'Telefon',
      newTab: 'Yangi oynada ochish', iframeHint: "Agar sayt ko'rinmasa, u ichki ko'rsatishni taqiqlagan bo'lishi mumkin — yangi oynada oching.",
      seoTitle: "CRM, avtomatlashtirish va web-saytlar", seoDesc: "Full-stack dasturchi: CRM tizimlar, avtomatlashtirish dasturlari va web-saytlar. Yaratilgan ishlar, tariflar va aloqa.",
    },
  },
  en: {
    nav: { about: 'About', rooms: 'Rooms', demos: 'Demos', process: 'Process', pricing: 'Pricing', contact: 'Contact' },
    hero: {
      badge: 'Full-stack developer',
      title1: 'CRM, automation and websites',
      title2: 'for your business',
      sub: 'Software written from scratch and fitted to your workflow. Below you can browse my work and see the pricing.',
      cta1: 'View work', cta2: 'Pricing',
    },
    stats: { demos: 'Demo works', rooms: 'Directions', years: 'Years of experience', stack: 'Technologies' },
    about: {
      title: 'About me', eyebrow: 'Who you work with',
      fallback: 'I am a full-stack developer. I build CRM systems, automation tools and websites from scratch, from design to deployment.',
      stack: 'Tech stack',
      points: ['Not a template: code written for your exact workflow', 'Full ownership: you receive the source code', 'Support continues after launch'],
    },
    rooms: { title: 'Directions', eyebrow: 'Rooms', sub: 'Each room is a separate direction. Click to see the work inside.', all: 'All', count: 'demos' },
    demos: { title: 'Delivered work', eyebrow: 'Portfolio', sub: 'Samples from real projects', open: 'Open demo', empty: 'No demos yet', close: 'Close' },
    process: {
      title: 'How I work', eyebrow: 'Process',
      steps: [
        ['Discussion', 'We define the goal and required features, then agree on price and timeline.'],
        ['Design & plan', 'Page structure and database are planned and approved.'],
        ['Development', 'Built step by step; you see the result at every stage.'],
        ['Delivery', 'Deployed to the server, with training, source code and support.'],
      ],
    },
    pricing: { title: 'Pricing', eyebrow: 'Plans', sub: 'Clear prices. Custom projects are quoted individually.', choose: 'Choose', popular: 'Popular' },
    faq: {
      title: 'Frequently asked questions', eyebrow: 'FAQ',
      items: [
        ['How long does a project take?', 'A landing page takes 3–7 days, a site with an admin panel 2–3 weeks, a full CRM 1–2 months. Exact timing depends on the task.'],
        ['How does payment work?', 'Usually an advance before starting and the rest on delivery. Larger projects are paid in stages.'],
        ['Can it be changed after launch?', 'Yes. You manage content via the admin panel, and code changes are covered by support.'],
        ['Who handles hosting and domain?', 'You register hosting and domain (I will help), and I handle the deployment.'],
      ],
    },
    contact: {
      title: "Let's discuss your project", eyebrow: 'Contact', sub: 'Leave your details and I will get back to you soon',
      name: 'Your name', contact: 'Phone or Telegram', message: 'Short task description (optional)', plan: 'Selected plan',
      send: 'Send', sending: 'Sending...', ok: 'Thank you! Your request was received.', err: 'Error, please try again',
    },
    footer: 'All rights reserved',
    common: {
      loadError: 'Could not load data. Check your connection and try again.', retry: 'Retry',
      live: 'Live preview', details: 'Details', desktop: 'Desktop', mobile: 'Mobile',
      newTab: 'Open in new tab', iframeHint: 'If the site does not appear, it may block embedding — open it in a new tab.',
      seoTitle: 'CRM, automation and websites', seoDesc: 'Full-stack developer: CRM systems, automation tools and websites. Delivered work, pricing and contact.',
    },
  },
  ru: {
    nav: { about: 'Обо мне', rooms: 'Комнаты', demos: 'Демо', process: 'Процесс', pricing: 'Тарифы', contact: 'Контакты' },
    hero: {
      badge: 'Full-stack разработчик',
      title1: 'CRM, автоматизация и сайты',
      title2: 'для вашего бизнеса',
      sub: 'Программы, написанные с нуля под ваши процессы. Ниже можно посмотреть мои работы и цены.',
      cta1: 'Смотреть работы', cta2: 'Цены',
    },
    stats: { demos: 'Демо-работ', rooms: 'Направлений', years: 'Лет опыта', stack: 'Технологий' },
    about: {
      title: 'Обо мне', eyebrow: 'С кем вы работаете',
      fallback: 'Я full-stack разработчик. Создаю CRM-системы, программы автоматизации и сайты с нуля: от дизайна до размещения на сервере.',
      stack: 'Технологии',
      points: ['Не шаблон, а код под ваши процессы', 'Полное владение: исходный код передаётся вам', 'Поддержка и после запуска'],
    },
    rooms: { title: 'Направления', eyebrow: 'Комнаты', sub: 'Каждая комната — отдельное направление. Нажмите, чтобы увидеть работы.', all: 'Все', count: 'демо' },
    demos: { title: 'Выполненные работы', eyebrow: 'Портфолио', sub: 'Примеры реальных проектов', open: 'Открыть демо', empty: 'Демо пока нет', close: 'Закрыть' },
    process: {
      title: 'Как я работаю', eyebrow: 'Процесс',
      steps: [
        ['Обсуждение', 'Определяем цель и функции, согласуем цену и сроки.'],
        ['Дизайн и план', 'Планируем структуру страниц и базу данных, согласовываем.'],
        ['Разработка', 'Делаю поэтапно, на каждом шаге вы видите результат.'],
        ['Сдача', 'Размещаю на сервере, обучаю, передаю исходный код и поддержку.'],
      ],
    },
    pricing: { title: 'Тарифы', eyebrow: 'Цены', sub: 'Чёткие цены. Индивидуальные проекты считаются отдельно.', choose: 'Выбрать', popular: 'Популярный' },
    faq: {
      title: 'Частые вопросы', eyebrow: 'FAQ',
      items: [
        ['Сколько занимает проект?', 'Лендинг 3–7 дней, сайт с админ-панелью 2–3 недели, полноценная CRM 1–2 месяца. Точные сроки зависят от задачи.'],
        ['Как происходит оплата?', 'Обычно аванс перед началом и остаток при сдаче. Крупные проекты оплачиваются поэтапно.'],
        ['Можно ли изменить после запуска?', 'Да. Контентом вы управляете через админ-панель, правки кода входят в поддержку.'],
        ['Кто занимается хостингом и доменом?', 'Хостинг и домен оформляете вы (помогу), размещение выполняю я.'],
      ],
    },
    contact: {
      title: 'Обсудим ваш проект', eyebrow: 'Контакты', sub: 'Оставьте данные — скоро свяжусь с вами',
      name: 'Ваше имя', contact: 'Телефон или Telegram', message: 'Краткое описание задачи (необязательно)', plan: 'Выбранный тариф',
      send: 'Отправить', sending: 'Отправка...', ok: 'Спасибо! Ваша заявка принята.', err: 'Ошибка, попробуйте ещё раз',
    },
    footer: 'Все права защищены',
    common: {
      loadError: 'Не удалось загрузить данные. Проверьте интернет и повторите попытку.', retry: 'Повторить',
      live: 'Живой просмотр', details: 'Подробности', desktop: 'Компьютер', mobile: 'Телефон',
      newTab: 'Открыть в новой вкладке', iframeHint: 'Если сайт не отображается, он может запрещать встраивание — откройте в новой вкладке.',
      seoTitle: 'CRM, автоматизация и сайты', seoDesc: 'Full-stack разработчик: CRM-системы, программы автоматизации и сайты. Работы, цены и контакты.',
    },
  },
}

const Ctx = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('dm_lang') || 'uz' } catch { return 'uz' }
  })
  useEffect(() => {
    try { localStorage.setItem('dm_lang', lang) } catch { /* ignore */ }
    document.documentElement.lang = lang
  }, [lang])

  const t = dict[lang]
  // { uz, en, ru } ko'rinishidagi bazadan kelgan matndan joriy tilni tanlaydi (bo'lmasa — mavjudini)
  const pick = (obj) => (obj ? obj[lang] || obj.uz || obj.en || obj.ru || '' : '')
  const pickList = (obj) => (obj ? (obj[lang]?.length ? obj[lang] : obj.uz || obj.en || obj.ru || []) : [])

  return <Ctx.Provider value={{ lang, setLang, t, pick, pickList }}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)
