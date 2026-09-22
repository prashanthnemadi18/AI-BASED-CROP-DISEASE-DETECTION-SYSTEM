import { motion } from 'framer-motion'

/**
 * Lightweight SVG donut chart (no external chart library).
 * data: [{ label, value, color }]  color = any valid SVG stroke color.
 */
export default function DonutChart({ data = [], size = 200, thickness = 26 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius

  let offset = 0
  const segments = total > 0 ? data.map((d) => {
    const fraction = d.value / total
    const seg = { ...d, fraction, dash: fraction * circumference, offset }
    offset += fraction * circumference
    return seg
  }) : []

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#e5e7eb" strokeWidth={thickness}
          />
          {segments.map((seg, i) => (
            <motion.circle
              key={i}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke={seg.color} strokeWidth={thickness}
              strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="butt"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${seg.dash} ${circumference - seg.dash}` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{total}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Total</span>
        </div>
      </div>

      <ul className="space-y-2 w-full sm:w-auto">
        {segments.length === 0 && <li className="text-sm text-gray-400">No data yet</li>}
        {segments.map((seg, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-gray-700 flex-1">{seg.label}</span>
            <span className="font-semibold text-gray-900">{seg.value}</span>
            <span className="text-gray-400 w-12 text-right">{Math.round(seg.fraction * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
