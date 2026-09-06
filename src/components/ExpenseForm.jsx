import { useEffect, useRef, useState } from "react"
import { categories, DEFAULT_CATEGORY_VALUE, todayInputValue } from "../data/constants"
import CategoryDropdown from "./CategoryDropdown"

const inputClass =
  "w-full border border-white/20 rounded-xl px-3 py-2.5 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"

export default function ExpenseForm({ onAdd, suggestedName = '', onConsumeSuggested }) {
  const [name, setName] = useState(suggestedName)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(DEFAULT_CATEGORY_VALUE)
  const [date, setDate] = useState(todayInputValue())
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (suggestedName) setName(suggestedName)
  }, [suggestedName])

  const handleAdd = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên khoản chi!')
      return
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Số tiền phải lớn hơn 0')
      return
    }
    onAdd({
      name: name.trim(),
      amount: Number(amount),
      category,
      date,
      note: note.trim(),
    })
    setName('')
    setAmount('')
    setDate(todayInputValue())
    setNote('')
    setError('')
    onConsumeSuggested?.()
    inputRef.current?.focus()
  }

  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-md shadow-lg">
      <h2 className="text-sm font-semibold text-white/90 mb-3">➕ Thêm khoản chi</h2>
      {error && (
        <p className="text-red-400 text-sm mb-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          ⚠️ {error}
        </p>
      )}
      <div className="flex flex-col md:flex-row gap-2 mb-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Tên khoản chi"
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          className={`flex-1 ${inputClass}`}
        />
        <input
          type="number"
          min="0"
          inputMode="decimal"
          placeholder="Số tiền"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setError('') }}
          className={`w-full md:w-28 ${inputClass}`}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-2 mb-2">
        <CategoryDropdown categories={categories} value={category} onChange={setCategory} />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`md:w-40 ${inputClass}`}
          aria-label="Ngày chi tiêu"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Ghi chú (tuỳ chọn)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`flex-1 ${inputClass}`}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-medium px-5 py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-blue-500/30"
        >
          Thêm
        </button>
      </div>
    </div>
  )
}
