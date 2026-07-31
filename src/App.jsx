import { useEffect, useState } from "react"
import backgroundImage from "./assets/296.WEBP"
import { categories, filters } from "./data/constants"
import ExpenseForm from "./components/ExpenseForm"
import ExpenseList from "./components/ExpenseList"
import ExpenseChart from "./components/ExpenseChart"
import FilterBar from "./components/FilterBar"

function loadExpenses() {
  try {
    const saved = localStorage.getItem('expenses')
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    console.error('Không thể đọc dữ liệu chi tiêu đã lưu:', e)
    return []
  }
}

function App() {
  const [expenses, setExpenses] = useState(loadExpenses)
  const [filterPeriod, setFilterPeriod] = useState('all')

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const filteredExpenses = expenses.filter((item) => {
    if (filterPeriod === 'all') return true
    const now = new Date()
    const itemDate = new Date(item.createdAt)
    if (filterPeriod === 'today') {
      return itemDate.toDateString() === now.toDateString()
    }
    if (filterPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return itemDate >= weekAgo
    }
    if (filterPeriod === 'month') {
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
    }
    return true
  })

  const total = filteredExpenses.reduce((sum, item) => sum + item.amount, 0)

  const chartData = categories
    .map((cat) => ({
      name: cat.label,
      value: filteredExpenses
        .filter((item) => item.category === cat.value)
        .reduce((sum, item) => sum + item.amount, 0),
      hex: cat.hex,
    }))
    .filter((c) => c.value > 0)

  const handleAdd = ({ name, amount, category }) => {
    const newExpense = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      name,
      amount,
      category,
    }
    setExpenses((prev) => [...prev, newExpense])
  }

  const handleDelete = (id) => {
    setExpenses((prev) => prev.filter(e => e.id !== id))
  }

  return (
    <div className="min-h-screen relative px-2 md:px-0 py-8 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "blur(10px)",
          transform: "scale(1.1)",
        }}
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      
      <div className="relative max-w-md lg:max-w-4xl mx-auto p-4 bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Expense Tracker</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-blue-500/80 rounded-lg shadow-lg p-4 text-center mb-6">
              <p className="text-sm text-blue-50">Tổng chi tiêu</p>
              <p className="text-3xl font-bold">{total.toLocaleString()}đ</p>
            </div>
            <FilterBar filters={filters} value={filterPeriod} onChange={setFilterPeriod} />
            <ExpenseForm onAdd={handleAdd} />
            <ExpenseList expenses={filteredExpenses} onDelete={handleDelete} />
          </div>
          <div>
            <ExpenseChart chartData={chartData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App