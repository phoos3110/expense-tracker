import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency } from "../data/constants"

export default function ExpenseChart({ chartData, total }) {
  if (chartData.length === 0) {
    return (
      <div className="bg-white/10 border border-white/10 rounded-2xl p-4 h-full min-h-[320px] flex flex-col items-center justify-center text-center text-gray-400 text-sm">
        <span className="text-4xl mb-3">📈</span>
        Chưa có dữ liệu để hiển thị biểu đồ
      </div>
    )
  }

  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
      <p className="text-sm font-semibold text-white/90 mb-1">Phân bổ theo danh mục</p>
      <p className="text-xs text-white/50 mb-3">Tỷ trọng chi tiêu từng danh mục</p>
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              stroke="rgba(0,0,0,0.4)"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.hex} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => {
                const pct = total ? ((Number(value) / total) * 100).toFixed(1) : 0
                return [`${formatCurrency(value)} (${pct}%)`, name]
              }}
              contentStyle={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-col gap-1.5 mt-3">
        {chartData.map((c) => {
          const pct = total ? ((c.value / total) * 100).toFixed(1) : 0
          return (
            <li key={c.name} className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.hex }} />
              <span className="text-white/70 truncate">{c.name}</span>
              <span className="ml-auto text-white/50 text-xs">{pct}%</span>
              <span className="font-medium text-white w-24 text-right">{formatCurrency(c.value)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
