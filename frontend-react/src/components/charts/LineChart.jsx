import { motion } from 'framer-motion'

/**
 * Lightweight SVG area/line chart for trends over time.
 * data: [{ label, value }]
 */
export default function LineChart({ data = [], height = 220, color = '#10b981' }) {
  const width = 600
  const padding = { top: 20, right: 20, bottom: 30, left: 34 }

  if (data.length === 0) {
    return <p className="text-sm text-gray-400">No data yet</p>
  }

  const maxVal = Math.max(...data.map((d) => d.value), 1)
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0

  const points = data.map((d, i) => {
    const x = padding.left + (data.length > 1 ? i * stepX : innerW / 2)
    const y = padding.top + innerH - (d.value / maxVal) * innerH
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + innerH} L${points[0].x},${padding.top + innerH} Z`
  const gridLines = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[420px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {gridLines.map((g, i) => {
          const y = padding.top + innerH * g
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#eef2f1" strokeWidth="1" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                {Math.round(maxVal * (1 - g))}
              </text>
            </g>
          )
        })}

        <motion.path
          d={areaPath} fill="url(#areaFill)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        />
        <motion.path
          d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: 'easeOut' }}
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke={color} strokeWidth="2.5" />
            {(data.length <= 10 || i % Math.ceil(data.length / 8) === 0) && (
              <text x={p.x} y={height - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
