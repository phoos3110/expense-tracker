import { useEffect } from "react"

export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-zinc-900/95 border border-white/15 rounded-2xl p-5 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-3 mb-3">
          <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-rose-500/20 text-rose-300 text-lg">
            ⚠️
          </span>
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="text-sm text-white/60 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl transition cursor-pointer"
          >
            {cancelLabel || 'Huỷ'}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-rose-500/30"
          >
            {confirmLabel || 'Xoá'}
          </button>
        </div>
      </div>
    </div>
  )
}
