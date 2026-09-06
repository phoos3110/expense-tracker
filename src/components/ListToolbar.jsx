import { categories, getCategory, sortOptions } from "../data/constants"

export default function ListToolbar({ search, onSearchChange, sortBy, onSortChange, categoryFilter, onCategoryFilterChange }) {
  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Tìm theo tên, ghi chú hoặc danh mục…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
            aria-label="Xoá tìm kiếm"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="flex-1 bg-zinc-900/80 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 cursor-pointer"
          aria-label="Sắp xếp"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="flex-1 bg-zinc-900/80 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 cursor-pointer"
          aria-label="Lọc danh mục"
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
          ))}
        </select>
      </div>
      {categoryFilter !== 'all' && (
        <span className="text-xs text-white/50">
          Đang lọc theo: {getCategory(categoryFilter).icon} {getCategory(categoryFilter).label}
        </span>
      )}
    </div>
  )
}
