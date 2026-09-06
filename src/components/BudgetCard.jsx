import { useState } from "react"
import { formatCurrency } from "../data/constants"

export default function BudgetCard({ spent, budget, onChange }) {
  const [draft, setDraft] = useState(budget ? String(budget) : '')
  const [saving, setSaving] = useState(false)

  const ratio = budget > 0 ? Math.min(spent / budget, 1) : 0
  const pct = Math.round(ratio * 100)
  const over = budget > 0 && spent > budget

  const color =
    over ? 'bg-rose-500'
    : pct >= 80 ? 'bg-amber-400'
    : 'bg-emerald-400'

  const handleSave = () => {
    const value = Number(draft)
    if (!draft.trim() || isNaN(value) || value <= 0) {
      onChange(0)
      setDraft('')
      return
    }
    onChange(value)
    setSaving(true)
    setTimeout(() => setSaving(false), 900)
  }

  const handleClear = () => {
    onChange(0)
    setDraft('')
  }

  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white/90">🎯 Ngân sách tháng này</h2>
        {budget > 0 && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${over ? 'bg-rose-500/20 text-rose-300' : 'bg-white/10 text-white/70'}`}>
            {over ? 'Vượt ngân sách!' : `${pct}% đã dùng`}
          </span>
        )}
      </div>

      {budget > 0 ? (
        <>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold text-white">{formatCurrency(spent)}</span>
            <span className="text-sm text-white/60">/ {formatCurrency(budget)}</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-1">
            <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
          </div>
          <p className={`text-xs mb-3 ${over ? 'text-rose-300' : 'text-white/50'}`}>
            {over
              ? `Đã vượt ${formatCurrency(spent - budget)} so với ngân sách`
              : `Còn lại ${formatCurrency(Math.max(budget - spent, 0))} để chi tiêu`}
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={String(budget)}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-xl transition cursor-pointer"
            >
              {saving ? '✓ Đã lưu' : 'Cập nhật'}
            </button>
            <button
              onClick={handleClear}
              className="bg-white/10 hover:bg-white/20 text-white/70 text-sm px-3 py-2 rounded-xl transition cursor-pointer"
              title="Xoá ngân sách"
            >
              ✕
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-white/60 mb-3">Đặt ngân sách hàng tháng để kiểm soát chi tiêu tốt hơn.</p>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="VD: 5.000.000"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Đặt ngân sách
            </button>
          </div>
        </>
      )}
    </div>
  )
}
