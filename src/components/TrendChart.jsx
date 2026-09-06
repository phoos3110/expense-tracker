import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { formatCurrency, toDateKey } from "../data/constants"

export default function TrendChart({ expenses }) {
  const data = useMemo(() => {
    const days = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400000)
      days.push(d)
    }
    const totals = {}
    days.forEach((d) => { totals[toDateKey(d)] = 0 })
    expenses.forEach((e) => {
      const key = toDateKey(new Date(e.createdAt))
      if (key in totals) totals[key] += e.amount
    })
    return days.map((d) => ({
      day: d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit' }),
      total: totals[toDateKey(d)],
    }))
  }, [expenses])

  const hasData = data.some((d) => d.total > 0)

  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md mb-4">
      <p className="text-sm font-semibold text-white/90 mb-1">Xu hướng chi tiêu</p>
      <p className="text-xs text-white/50 mb-3">7 ngày gần nhất</p>
      {hasData ? (
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}tr` : v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                formatter={(value) => [formatCurrency(value), 'Chi tiêu']}
                contentStyle={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
          Chưa có giao dịch trong 7 ngày qua
        </div>
      )}
    </div>
  )
}
