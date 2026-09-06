import { getCategory, dayLabel, formatCurrency } from "../data/constants"

function ExpenseItem({ item, onEdit, onDelete }) {
  const catInfo = getCategory(item.category)
  return (
    <div
      className="group flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl p-3 hover:bg-white/15 transition animate-fade-in-up"
    >
      <span
        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl text-lg"
        style={{ backgroundColor: `${catInfo.hex}26` }}
      >
        {catInfo.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white truncate">{item.name}</span>
          <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60">{catInfo.label}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5">
          <span>{dayLabel(item.createdAt)}</span>
          {item.note && (
            <>
              <span className="opacity-40">•</span>
              <span className="truncate italic">“{item.note}”</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-red-300 font-semibold mr-1">-{formatCurrency(item.amount)}</span>
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(item)}
            title="Sửa khoản chi"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-blue-500/30 text-white/70 hover:text-white text-xs transition cursor-pointer"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(item)}
            title="Xoá khoản chi"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-rose-500/30 text-white/70 hover:text-rose-200 text-xs transition cursor-pointer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ExpenseList({ expenses, total, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-white/5 border border-dashed border-white/10 rounded-2xl">
        <span className="text-4xl mb-2">🪙</span>
        <p className="text-gray-300 text-sm">Chưa có khoản chi nào</p>
        <p className="text-gray-500 text-xs mt-1">Thêm khoản chi đầu tiên của bạn ở trên nhé!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs text-white/60 font-medium">
          {expenses.length} khoản chi
        </span>
        <span className="text-xs text-white/60 font-medium">
          Tổng: <span className="text-red-300">-{formatCurrency(total)}</span>
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {expenses.map((item) => (
          <ExpenseItem key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

