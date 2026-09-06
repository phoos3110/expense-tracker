export default function FilterBar({ filters, value, onChange }) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`text-sm px-3.5 py-1.5 rounded-full transition cursor-pointer ${
            value === f.value
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
              : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/10'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
