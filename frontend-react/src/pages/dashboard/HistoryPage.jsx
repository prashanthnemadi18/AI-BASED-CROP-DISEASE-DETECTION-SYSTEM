import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Search, Eye, Download, Trash2, Sprout, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatDisease } from '../../lib/diseaseInfo'
import { downloadReport } from '../../lib/pdf'
import PredictionCard from '../../components/PredictionCard'

export default function HistoryPage() {
  const { detections, clearHistory } = useApp()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return detections
    return detections.filter((d) =>
      `${d.crop} ${d.disease} ${d.status}`.toLowerCase().includes(q)
    )
  }, [detections, query])

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by crop, disease or status…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>
        {detections.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-14 text-center">
          <History className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700">
            {detections.length === 0 ? 'No detection history yet' : 'No matches found'}
          </h3>
          <p className="text-gray-500 mt-1">
            {detections.length === 0 ? 'Your past analyses will appear here.' : 'Try a different search term.'}
          </p>
          {detections.length === 0 && (
            <Link to="/dashboard/detect" className="inline-block mt-5 px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
              Detect a Disease
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((d, i) => (
            <motion.div
              key={d.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
            >
              <div className="h-40 bg-gray-100 relative">
                {d.imageDataUrl ? (
                  <img src={d.imageDataUrl} alt={d.disease} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-50">
                    <Sprout className="w-12 h-12 text-green-300" />
                  </div>
                )}
                <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  d.status === 'Healthy Plant' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {d.confidence}%
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-gray-500">{d.crop}</p>
                <h3 className="font-bold text-gray-900 leading-snug mb-1">{formatDisease(d.disease)}</h3>
                <p className="text-xs text-gray-400 mb-3">{new Date(d.timestamp).toLocaleString()}</p>
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => setSelected(d)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-100 transition"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => downloadReport(d)}
                    className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                    aria-label="Download report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white shadow"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <PredictionCard prediction={selected} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear confirmation */}
      <AnimatePresence>
        {confirmClear && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-sm w-full p-6 text-center"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Clear all history?</h3>
              <p className="text-sm text-gray-500 mb-6">This will permanently remove all {detections.length} saved detections. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmClear(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">
                  Cancel
                </button>
                <button
                  onClick={() => { clearHistory(); setConfirmClear(false) }}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
