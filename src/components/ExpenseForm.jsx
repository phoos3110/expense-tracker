import { useEffect, useRef, useState } from "react"
import { categories, DEFAULT_CATEGORY_VALUE } from "../data/constants"
import CategoryDropdown from "./CategoryDropdown"

export default function ExpenseForm({ onAdd }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0].value)
  const [error, setError] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleAdd = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên khoản chi!')
      return
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Số tiền phải lớn hơn 0')
      return
    }
    onAdd({ name: name.trim(), amount: Number(amount), category })
    setName('')
    setAmount('')
    setError('')
    inputRef.current?.focus()
  }

  return (
    <>
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <div className="flex flex-col md:flex-row gap-2 mb-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Tên khoản chi"
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          className="flex-1 border border-white/20 rounded-lg px-3 py-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
        />
        <input
          type="number"
          min="0"
          placeholder="Số tiền"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setError('') }}
          className="w-full md:w-28 border border-white/20 rounded-lg px-3 py-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <CategoryDropdown categories={categories} value={category} onChange={setCategory} />
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
        >
          Thêm
        </button>
      </div>
    </>
  )
}