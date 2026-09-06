import { formatCurrency } from "../data/constants"

function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-white/60 font-medium">{label}</span>
      </div>
      <p className={`text-xl md:text-2xl font-bold ${accent}`}>{formatCurrency(value)}</p>
      {sub && <p className="text-[11px] text-white/50 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <StatCard label="Tổng chi tiêu" value={stats.total} icon="💸" accent="text-white" sub="Theo bộ lọc hiện tại" />
      <StatCard label="Số khoản chi" value={stats.count} icon="🧾" accent="text-white" sub="Giao dịch" />
      <StatCard label="Trung bình" value={stats.average} icon="📊" accent="text-white" sub="Mỗi khoản chi" />
      <StatCard label="Danh mục lớn nhất" value={stats.topCategoryAmount} icon={stats.topCategoryIcon} accent="text-rose-300" sub={stats.topCategoryLabel} />
    </div>
  )
}
