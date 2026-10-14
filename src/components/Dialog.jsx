// ===== DIZAYNGA MOS TASDIQLASH OYNASI VA XABARLAR (toast) =====
// Brauzerning oddiy confirm()/alert() oynalari o'rniga:
//   const confirm = useConfirm();  if (await confirm({ title, message, danger: true })) { ... }
//   const toast = useToast();      toast('Saqlandi')  yoki  toast('Xato', 'error')
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

const ConfirmCtx = createContext(null)
const ToastCtx = createContext(null)

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(null) // { title, message, confirmText, danger, resolve }
  const [toasts, setToasts] = useState([])
  const id = useRef(0)
  const okBtn = useRef(null)

  const confirm = useCallback(
    (opts) => new Promise((resolve) => setDialog({ ...opts, resolve })), []
  )
  const close = (v) => { dialog?.resolve(v); setDialog(null) }

  const toast = useCallback((message, type = 'success') => {
    const n = ++id.current
    setToasts((t) => [...t, { n, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.n !== n)), 3500)
  }, [])

  // Esc — bekor qilish, ochilganda asosiy tugmaga fokus
  useEffect(() => {
    if (!dialog) return
    okBtn.current?.focus()
    const onKey = (e) => e.key === 'Escape' && close(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialog])

  return (
    <ConfirmCtx.Provider value={confirm}>
      <ToastCtx.Provider value={toast}>
        {children}

        <AnimatePresence>
          {dialog && (
            <motion.div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => close(false)}
            >
              <motion.div
                role="alertdialog" aria-modal="true" aria-labelledby="dlg-title"
                className="glass !bg-[var(--bg)] w-full max-w-sm p-6"
                initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex gap-3">
                  <AlertTriangle className={dialog.danger ? 'text-red-400' : 'text-accent'} size={22} />
                  <div>
                    <h2 id="dlg-title" className="font-bold">{dialog.title || 'Tasdiqlang'}</h2>
                    {dialog.message && <p className="text-sm text-muted mt-1">{dialog.message}</p>}
                  </div>
                </div>
                <div className="flex gap-3 mt-6 justify-end">
                  <button className="btn-ghost !py-2" onClick={() => close(false)}>Bekor qilish</button>
                  <button ref={okBtn} onClick={() => close(true)}
                    className={`btn-neon !py-2 ${dialog.danger ? '!bg-red-500 !text-white' : ''}`}>
                    {dialog.confirmText || 'Tasdiqlash'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast xabarlar */}
        <div className="fixed bottom-4 right-4 z-[210] flex flex-col gap-2" aria-live="polite">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div key={t.n} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                className="glass !bg-[var(--bg)] px-4 py-3 text-sm flex items-center gap-2 max-w-xs">
                {t.type === 'error'
                  ? <XCircle size={18} className="text-red-400 shrink-0" />
                  : <CheckCircle2 size={18} className="text-green-500 shrink-0" />}
                {t.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ToastCtx.Provider>
    </ConfirmCtx.Provider>
  )
}

export const useConfirm = () => useContext(ConfirmCtx)
export const useToast = () => useContext(ToastCtx)
