import { categories as allCategories, DEFAULT_CATEGORY_VALUE } from "../data/constants"

export default function ExpenseList({ expenses, onDelete }) {
  const getCategoryInfo = (categoryValue) =>
    allCategories.find(c => c.value === categoryValue) ||
    allCategories.find(c => c.value === DEFAULT_CATEGORY_VALUE)

  const handleDelete = (id) => {
    const isConfirmed = window.confirm('Bạn có chắc muốn xóa khoản chi này ?')
    if (!isConfirmed) return
    onDelete(id)
  }

  if (expenses.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-4">Chưa có khoản chi nào</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {expenses.map((item) => {
        const catInfo = getCategoryInfo(item.category)
        return (
          <div key={item.id} className="flex justify-between items-center bg-white/10 border border-white/10 p-3 rounded-lg gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`${catInfo.color} text-white text-xs px-2 py-1 rounded-full shrink-0`}>
                {catInfo.icon}
              </span>
              <span className="truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-red-400 font-medium">-{item.amount.toLocaleString()}đ</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-400 hover:text-red-400 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}