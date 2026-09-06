import { useEffect, useMemo, useRef, useState } from "react"
import backgroundImage from "./assets/296.WEBP"
import {
  STORAGE_KEYS,
  filters,
  getCategory,
  normalizeText,
  startOfDay,
  timestampFromDateInput,
  toDateKey,
} from "./data/constants"
import ExpenseForm from "./components/ExpenseForm"
import ExpenseList from "./components/ExpenseList"
import ExpenseChart from "./components/ExpenseChart"
import TrendChart from "./components/TrendChart"
import FilterBar from "./components/FilterBar"
import StatsCards from "./components/StatsCards"
import BudgetCard from "./components/BudgetCard"
import ListToolbar from "./components/ListToolbar"
import EditExpenseModal from "./components/EditExpenseModal"
import ConfirmDialog from "./components/ConfirmDialog"
import ToastContainer from "./components/ToastContainer"

function loadExpenses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.expenses)
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    console.error('Không thể đọc dữ liệu chi tiêu đã lưu:', e)
    return []
  }
}

function loadBudget() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.budget)
    const value = Number(saved)
    return isNaN(value) || value < 0 ? 0 : value
  } catch {
    return 0
  }
}

function App() {
  const [expenses, setExpenses] = useState(loadExpenses)
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [budget, setBudget] = useState(loadBudget)
  const [suggestedName, setSuggestedName] = useState('')
  const [editing, setEditing] = useState(null)
  const [confirmState, setConfirmState] = useState(null)
  const [toasts, setToasts] = useState([])
  const fileInputRef = useRef()
  const toastSeq = useRef(0)

  // ---------- Lưu dữ liệu ----------
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.budget, String(budget))
  }, [budget])

  // ---------- Toast ----------
  const pushToast = (message, type = 'success') => {
    const id = ++toastSeq.current
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'
    setToasts((prev) => [...prev, { id, message, type, icon }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2600)
  }

  // ---------- Lọc theo thời gian ----------
  const periodFiltered = useMemo(() => {
    if (filterPeriod === 'all') return expenses
    const now = new Date()
    return expenses.filter((item) => {
      const itemDate = new Date(item.createdAt)
      if (filterPeriod === 'today') return toDateKey(itemDate) === toDateKey(now)
      if (filterPeriod === 'week') {
        const start = startOfDay(new Date())
        start.setDate(start.getDate() - 6)
        return itemDate >= start
      }
      if (filterPeriod === 'month') {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
      }
      if (filterPeriod === 'year') {
        return itemDate.getFullYear() === now.getFullYear()
      }
      return true
    })
  }, [expenses, filterPeriod])

  // ---------- Tìm kiếm + lọc danh mục + sắp xếp ----------
  const filteredExpenses = useMemo(() => {
    const q = normalizeText(search)
    let result = periodFiltered.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
      if (!q) return true
      return (
        normalizeText(item.name).includes(q) ||
        normalizeText(item.note).includes(q) ||
        normalizeText(getCategory(item.category).label).includes(q)
      )
    })
    const sorted = [...result]
    switch (sortBy) {
      case 'oldest':
        sorted.sort((a, b) => a.createdAt - b.createdAt)
        break
      case 'highest':
        sorted.sort((a, b) => b.amount - a.amount)
        break
      case 'lowest':
        sorted.sort((a, b) => a.amount - b.amount)
        break
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt)
    }
    return sorted
  }, [periodFiltered, search, categoryFilter, sortBy])

  // ---------- Thống kê ----------
  const total = filteredExpenses.reduce((sum, item) => sum + item.amount, 0)

  const chartData = useMemo(() => {
    const map = new Map()
    filteredExpenses.forEach((item) => {
      const cat = getCategory(item.category)
      const prev = map.get(cat.value) || { name: cat.label, value: 0, hex: cat.hex, icon: cat.icon }
      prev.value += item.amount
      map.set(cat.value, prev)
    })
    return [...map.values()].sort((a, b) => b.value - a.value)
  }, [filteredExpenses])

  const stats = useMemo(() => {
    const count = filteredExpenses.length
    const average = count ? Math.round(total / count) : 0
    const topCategoryAmount = chartData.length ? chartData[0].value : 0
    const topCategoryLabel = chartData.length ? chartData[0].name : '—'
    const topCategoryIcon = chartData.length ? chartData[0].icon : '🏆'
    return { total, count, average, topCategoryAmount, topCategoryLabel, topCategoryIcon }
  }, [filteredExpenses, total, chartData])

  // ---------- Ngân sách tháng hiện tại ----------
  const monthTotal = useMemo(() => {
    const now = new Date()
    return expenses
      .filter((item) => {
        const d = new Date(item.createdAt)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, item) => sum + item.amount, 0)
  }, [expenses])

  // ---------- Thao tác CRUD ----------
  const handleAdd = ({ name, amount, category, date, note }) => {
    const newExpense = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: timestampFromDateInput(date),
      name,
      amount,
      category,
      note,
    }
    setExpenses((prev) => [...prev, newExpense])
    pushToast(`Đã thêm "${name}"`)
  }

  const requestDelete = (item) => {
    setConfirmState({
      title: 'Xoá khoản chi',
      message: `Bạn có chắc muốn xoá "${item.name}"? Hành động này không thể hoàn tác.`,
      confirmLabel: 'Xoá',
      onConfirm: () => {
        setExpenses((prev) => prev.filter((e) => e.id !== item.id))
        pushToast(`Đã xoá "${item.name}"`)
        setConfirmState(null)
      },
    })
  }

  const handleSaveEdit = (updated) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === updated.id
          ? { ...e, ...updated, createdAt: timestampFromDateInput(updated.date) }
          : e
      )
    )
    setEditing(null)
    pushToast('Đã cập nhật khoản chi')
  }

  // ---------- Xuất / nhập dữ liệu ----------
  const exportJSON = () => {
    const data = {
      app: 'Expense Tracker',
      version: 1,
      exportedAt: new Date().toISOString(),
      expenses,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chi-tieu-${toDateKey(new Date())}.json`
    a.click()
    URL.revokeObjectURL(url)
    pushToast('Đã xuất dữ liệu JSON')
  }

  const exportCSV = () => {
    const header = ['Tên', 'Số tiền', 'Danh mục', 'Ngày', 'Ghi chú']
    const rows = expenses.map((item) => {
      const d = new Date(item.createdAt)
      const date = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
      return [
        `"${String(item.name).replace(/"/g, '""')}"`,
        item.amount,
        `"${getCategory(item.category).label}"`,
        `"${date}"`,
        `"${String(item.note || '').replace(/"/g, '""')}"`,
      ].join(',')
    })
    const csv = '\uFEFF' + [header.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chi-tieu-${toDateKey(new Date())}.csv`
    a.click()
    URL.revokeObjectURL(url)
    pushToast('Đã xuất dữ liệu CSV')
  }

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        const list = Array.isArray(data) ? data : data.expenses
        if (!Array.isArray(list)) throw new Error('Không tìm thấy danh sách chi tiêu')
        let count = 0
        const newItems = []
        list.forEach((item, index) => {
          const name = String(item.name || '').trim()
          const amount = Number(item.amount)
          if (!name || isNaN(amount) || amount <= 0) return
          newItems.push({
            id: item.id && typeof item.id === 'string'
              ? item.id
              : `import-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
            createdAt:
              item.createdAt || item.date
                ? timestampFromDateInput(
                    item.date ? String(item.date).slice(0, 10) : toDateKey(new Date(item.createdAt))
                  )
                : Date.now(),
            name,
            amount,
            category: getCategory(item.category).value,
            note: String(item.note || ''),
          })
          count += 1
        })
        if (newItems.length === 0) {
          throw new Error('Tệp không chứa khoản chi hợp lệ')
        }
        setExpenses((prev) => [...newItems, ...prev])
        pushToast(`Đã nhập ${count} khoản chi`)
      } catch (err) {
        pushToast(err.message || 'Tệp không hợp lệ', 'error')
      }
    }
    reader.onerror = () => pushToast('Không thể đọc tệp', 'error')
    reader.readAsText(file)
    e.target.value = ''
  }

  const confirmClearAll = () => {
    setConfirmState({
      title: 'Xoá tất cả dữ liệu',
      message: `Toàn bộ ${expenses.length} khoản chi sẽ bị xoá vĩnh viễn. Bạn có chắc chắn?`,
      confirmLabel: 'Xoá tất cả',
      onConfirm: () => {
        setExpenses([])
        pushToast('Đã xoá toàn bộ dữ liệu')
        setConfirmState(null)
      },
    })
  }

  return (
    <div className="min-h-screen relative px-2 md:px-4 py-6 md:py-10 overflow-hidden">
      {/* Nền */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "blur(10px)",
          transform: "scale(1.1)",
        }}
      />
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <div className="relative max-w-md lg:max-w-5xl mx-auto p-4 md:p-6 bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl text-white">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-xl shadow-lg shadow-blue-500/30">
              💰
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight">Expense Tracker</h1>
              <p className="text-xs text-white/50">Quản lý chi tiêu cá nhân</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={exportJSON}
              title="Xuất dữ liệu (JSON)"
              className="text-xs px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer"
            >
              ⬇️ JSON
            </button>
            <button
              onClick={exportCSV}
              title="Xuất dữ liệu (CSV)"
              className="text-xs px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer"
            >
              📄 CSV
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Nhập dữ liệu từ JSON"
              className="text-xs px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer"
            >
              ⬆️ Nhập
            </button>
            <button
              onClick={confirmClearAll}
              title="Xoá tất cả dữ liệu"
              className="text-xs px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 text-rose-200 transition cursor-pointer"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Cột trái */}
          <div className="lg:col-span-3">
            <StatsCards stats={stats} />
            <BudgetCard spent={monthTotal} budget={budget} onChange={setBudget} />
            <div className="mt-4">
              <FilterBar filters={filters} value={filterPeriod} onChange={setFilterPeriod} />
            </div>
            <ExpenseForm
              onAdd={handleAdd}
              suggestedName={suggestedName}
              onConsumeSuggested={() => setSuggestedName('')}
            />
            <ListToolbar
              search={search}
              onSearchChange={setSearch}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
            />
            <ExpenseList
              expenses={filteredExpenses}
              total={total}
              onEdit={setEditing}
              onDelete={requestDelete}
            />
          </div>

          {/* Cột phải */}
          <div className="lg:col-span-2">
            <TrendChart expenses={expenses} />
            <ExpenseChart chartData={chartData} total={total} />
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-6">
          💾 Dữ liệu được lưu tự động trên trình duyệt của bạn
        </p>
      </div>

      {/* File input ẩn cho nhập JSON */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* Modals & toast */}
      {editing && (
        <EditExpenseModal item={editing} onSave={handleSaveEdit} onClose={() => setEditing(null)} />
      )}
      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        onConfirm={confirmState?.onConfirm}
        onCancel={() => setConfirmState(null)}
      />
      <ToastContainer toasts={toasts} />
    </div>
  )
}

export default App
