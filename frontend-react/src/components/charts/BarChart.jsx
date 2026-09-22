import { motion } from 'framer-motion'

/**
 * Horizontal bar chart built with divs (responsive, animated).
 * data: [{ label, value, color? }] color = tailwind gradient classes.
 */
export default function BarChart({ data = [], suffix = '' }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  if (data.length === 0) {
    return <p className="text-sm text-gray-400">No data yet</p>
  }

  return (
    <div className="space-y-4">
      {data.map((item, idx) => (
        <div key={idx}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-medium text-gray-700 truncate pr-2">{item.label}</span>
            <span className="text-sm font-semibold text-gray-900 shrink-0">
              {item.value}{suffix}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${item.color || 'from-emerald-500 to-green-600'}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${(item.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: idx * 0.08, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
