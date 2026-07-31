import { useEffect, useRef, useState } from "react"

export default function CategoryDropdown({ categories, value, onChange }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef()
  const selected = categories.find(c => c.value === value) || categories[0]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((o) => !o)
    }
  }

  return (
    <div className="relative flex-1" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between border border-white/20 rounded-lg px-3 py-2 bg-white/10 text-white focus:outline-none focus:border-blue-400 cursor-pointer"
      >
        <span>{selected.icon} {selected.label}</span>
        <span className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 w-full rounded-lg bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {categories.map((cat) => (
            <li
              key={cat.value}
              role="option"
              aria-selected={cat.value === value}
              onClick={() => { onChange(cat.value); setOpen(false) }}
              className={`px-3 py-2 cursor-pointer hover:bg-white/20 transition list-none ${
                cat.value === value ? 'bg-white/10' : ''
              }`}
            >
              {cat.icon} {cat.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}