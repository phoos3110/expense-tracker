import { useEffect, useState } from "react"
import { categories, toDateKey } from "../data/constants"
import CategoryDropdown from "./CategoryDropdown"

export default function EditExpenseModal({ item, onSave, onClose }) {
  const [name, setName] = useState(item.name)
  const [amount, setAmount] = useState(String(item.amount))
  const [category, setCategory] = useState(item.category)
  const [date, setDate] = useState(toDateKey(new Date(item.createdAt)))
  const [note, setNote] = useState(item.note || '')
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSave = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên khoản chi!')
      return
    }
    const amountNum = Number(amount)
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Số tiền phải lớn hơn 0')
      return
    }
    onSave({
      ...item,
      name: name.trim(),
      amount: amountNum,
      category,
      date,
      note: note.trim(),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-zinc-900/95 border border-white/15 rounded-2xl p-5 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Sửa khoản chi"
      >
        <h2 className="text-lg font-semibold text-white mb-4">✏️ Sửa khoản chi</h2>
        {error && (
          <p className="text-red-400 text-sm mb-3 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            ⚠️ {error}
          </p>
        )}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Tên khoản chi"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            autoFocus
            className="w-full border border-white/20 rounded-xl px-3 py-2.5 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
          />
          <input
            type="number"
            min="0"
            placeholder="Số tiền"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError('') }}
            className="w-full border border-white/20 rounded-xl px-3 py-2.5 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
          />
          <div className="flex gap-2">
            <CategoryDropdown categories={categories} value={category} onChange={setCategory} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-40 border border-white/20 rounded-xl px-3 py-2.5 bg-white/10 text-white focus:outline-none focus:border-blue-400"
            />
          </div>
          <input
            type="text"
            placeholder="Ghi chú (tuỳ chọn)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-white/20 rounded-xl px-3 py-2.5 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
          />
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl transition cursor-pointer"
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-blue-500/30"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  )
}
