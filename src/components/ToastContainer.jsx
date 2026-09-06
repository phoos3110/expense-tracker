export default function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-xs pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-in-right flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-2xl border backdrop-blur-md ${
            t.type === 'success'
              ? 'bg-emerald-600/90 border-emerald-400/30'
              : t.type === 'error'
                ? 'bg-rose-600/90 border-rose-400/30'
                : 'bg-zinc-800/95 border-white/15'
          }`}
        >
          <span>{t.icon}</span>
          <span className="flex-1">{t.message}</span>
        </div>
      ))}
    </div>
  )
}
