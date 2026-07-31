import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

export default function ExpenseChart({ chartData }) {
  if (chartData.length === 0) {
    return (
      <div className="hidden lg:flex items-center justify-center h-full text-gray-400 text-sm">
        Chưa có dữ liệu để hiển thị biểu đồ
      </div>
    )
  }

  return (
    <div className="bg-white/10 border border-white/10 rounded-lg p-4" style={{ height: 320 }}>
      <p className="text-sm font-medium text-gray-300 mb-2">Phân bổ theo danh mục</p>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label={{ fill: '#fff' }}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.hex} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value.toLocaleString()}đ`}
            contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: 8, color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}