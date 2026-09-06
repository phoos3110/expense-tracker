export const categories = [
  { value: 'food', label: 'Ăn uống', icon: '🍔', hex: '#f97316' },
  { value: 'transport', label: 'Di chuyển', icon: '🚗', hex: '#3b82f6' },
  { value: 'shopping', label: 'Mua sắm', icon: '🛍️', hex: '#ec4899' },
  { value: 'bills', label: 'Hóa đơn & tiện ích', icon: '💡', hex: '#eab308' },
  { value: 'health', label: 'Sức khỏe', icon: '💊', hex: '#10b981' },
  { value: 'education', label: 'Giáo dục', icon: '📚', hex: '#6366f1' },
  { value: 'entertainment', label: 'Giải trí', icon: '🎮', hex: '#a855f7' },
  { value: 'other', label: 'Khác', icon: '📦', hex: '#6b7280' },
]

export const DEFAULT_CATEGORY_VALUE = 'other'

export const filters = [
  { value: 'all', label: 'Tất cả' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'year', label: 'Năm nay' },
]

export const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'highest', label: 'Cao → thấp' },
  { value: 'lowest', label: 'Thấp → cao' },
]

export const STORAGE_KEYS = {
  expenses: 'expenses',
  budget: 'budget',
}

export function getCategory(value) {
  return (
    categories.find((c) => c.value === value) ||
    categories.find((c) => c.value === DEFAULT_CATEGORY_VALUE)
  )
}

export function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')}đ`
}

// Chuẩn hoá chuỗi để tìm kiếm không phân biệt dấu/hoa thường
export function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// Trả về chuỗi "yyyy-mm-dd" theo múi giờ địa phương
export function toDateKey(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayInputValue() {
  return toDateKey(new Date())
}

// Chuyển giá trị input[type=date] thành timestamp (12h trưa để tránh lệch múi giờ)
export function timestampFromDateInput(value) {
  const [y, m, d] = String(value || '').split('-').map(Number)
  if (!y || !m || !d) return Date.now()
  return new Date(y, m - 1, d, 12, 0, 0, 0).getTime()
}

export function formatDateLong(ts) {
  return new Date(ts).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function dayLabel(ts) {
  const today = startOfDay(new Date())
  const d = startOfDay(new Date(ts))
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Hôm nay'
  if (diff === 1) return 'Hôm qua'
  return new Date(ts).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
