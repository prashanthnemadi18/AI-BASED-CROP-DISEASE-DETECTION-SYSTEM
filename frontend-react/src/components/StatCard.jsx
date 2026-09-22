import { motion } from 'framer-motion'

/**
 * Statistic card used across the dashboard and analytics pages.
 */
export default function StatCard({ icon, label, value, sub, accent = 'emerald', delay = 0 }) {
  const accents = {
    emerald: 'bg-emerald-50 text-emerald-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    slate: 'bg-slate-100 text-slate-600',
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${accents[accent] || accents.emerald}`}>{icon}</div>
        {sub && <span className="text-xs font-medium text-gray-400">{sub}</span>}
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </motion.div>
  )
}
