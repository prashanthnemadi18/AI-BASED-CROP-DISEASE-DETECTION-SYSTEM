import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScanSearch, Activity, Sprout, TrendingUp, ArrowRight, History, Hand } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { computeAnalytics } from '../../lib/analytics'
import { formatDisease } from '../../lib/diseaseInfo'
import StatCard from '../../components/StatCard'

export default function DashboardHome() {
  const { user, detections } = useApp()
  const stats = computeAnalytics(detections)

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 text-white p-8"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10 max-w-lg">
          <p className="text-green-100 text-sm">Welcome back,</p>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            {user?.name || 'Farmer'} <Hand className="w-7 h-7 text-green-200" />
          </h2>
          <p className="text-green-50 mb-6">Monitor your crops and detect diseases early with AI-powered analysis.</p>
          <Link to="/dashboard/detect" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105">
            <ScanSearch className="w-5 h-5" /> Start New Detection
          </Link>
        </div>
        <ScanSearch className="w-52 h-52 absolute -bottom-8 -right-6 opacity-10" />
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Activity className="w-6 h-6" />} label="Total Scans" value={stats.total} accent="blue" delay={0} />
        <StatCard icon={<ScanSearch className="w-6 h-6" />} label="Diseases Detected" value={stats.diseased} accent="amber" delay={0.05} />
        <StatCard icon={<Sprout className="w-6 h-6" />} label="Healthy Plants" value={stats.healthy} accent="emerald" delay={0.1} />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Avg. Confidence" value={`${stats.avgConfidence}%`} accent="green" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent detections */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Detections</h3>
            <Link to="/dashboard/history" className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {stats.recent.length === 0 ? (
            <div className="text-center py-10">
              <History className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No detections yet</p>
              <p className="text-sm text-gray-400 mt-1">Run your first scan to see it here.</p>
              <Link to="/dashboard/detect" className="inline-block mt-4 px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                Detect a Disease
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats.recent.map((d) => (
                <li key={d.id} className="flex items-center gap-4 py-3">
                  {d.imageDataUrl ? (
                    <img src={d.imageDataUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                      <Sprout className="w-6 h-6 text-green-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">{formatDisease(d.disease)}</p>
                    <p className="text-xs text-gray-500">{d.crop} · {new Date(d.timestamp).toLocaleString()}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600 shrink-0">{d.confidence}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Most Frequent Disease</h3>
            {stats.mostFrequent ? (
              <div className="text-center py-4">
                <p className="text-2xl font-bold text-green-700">{stats.mostFrequent.disease}</p>
                <p className="text-sm text-gray-500 mt-1">Detected {stats.mostFrequent.count} time(s)</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-6 text-center">No data yet</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/dashboard/detect" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow transition">
                <ScanSearch className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">New Detection</span>
              </Link>
              <Link to="/dashboard/analytics" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow transition">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">View Analytics</span>
              </Link>
              <Link to="/dashboard/history" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow transition">
                <History className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Detection History</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
