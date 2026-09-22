import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Sprout, ScanSearch, TrendingUp, Award, BarChart3 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { computeAnalytics } from '../../lib/analytics'
import { formatDisease } from '../../lib/diseaseInfo'
import StatCard from '../../components/StatCard'
import DonutChart from '../../components/charts/DonutChart'
import BarChart from '../../components/charts/BarChart'
import LineChart from '../../components/charts/LineChart'

export default function AnalyticsPage() {
  const { detections } = useApp()
  const stats = useMemo(() => computeAnalytics(detections), [detections])

  const hasData = stats.total > 0

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Activity className="w-6 h-6" />} label="Total Images Analyzed" value={stats.total} accent="blue" />
        <StatCard icon={<ScanSearch className="w-6 h-6" />} label="Diseases Detected" value={stats.diseased} accent="amber" delay={0.05} />
        <StatCard icon={<Sprout className="w-6 h-6" />} label="Healthy Plants" value={stats.healthy} accent="emerald" delay={0.1} />
        <StatCard icon={<Award className="w-6 h-6" />} label="Avg. Confidence" value={`${stats.avgConfidence}%`} accent="green" delay={0.15} />
      </div>

      {!hasData ? (
        <EmptyState />
      ) : (
        <>
          {/* Most frequent + distribution */}
          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" /> Most Frequent Disease
              </h3>
              {stats.mostFrequent ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-white">{stats.mostFrequent.count}</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{stats.mostFrequent.disease}</p>
                  <p className="text-sm text-gray-500 mt-1">occurrences recorded</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No data</p>
              )}
            </motion.div>

            <motion.div
              className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" /> Disease Distribution by Crop
              </h3>
              <DonutChart data={stats.cropDistribution} />
            </motion.div>
          </div>

          {/* Trend + top diseases */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" /> Detection Trend (Last 14 Days)
              </h3>
              <LineChart data={stats.trend} />
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" /> Top Detected Diseases
              </h3>
              <BarChart data={stats.topDiseases} />
            </motion.div>
          </div>

          {/* Recent detections table */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <h3 className="font-bold text-gray-900 mb-4">Recent Detections</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-2.5 pr-4 font-semibold">Disease</th>
                    <th className="py-2.5 pr-4 font-semibold">Crop</th>
                    <th className="py-2.5 pr-4 font-semibold">Confidence</th>
                    <th className="py-2.5 pr-4 font-semibold">Status</th>
                    <th className="py-2.5 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recent.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/60">
                      <td className="py-3 pr-4 font-medium text-gray-900">{formatDisease(d.disease)}</td>
                      <td className="py-3 pr-4 text-gray-600">{d.crop}</td>
                      <td className="py-3 pr-4">
                        <span className="font-semibold text-green-600">{d.confidence}%</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          d.status === 'Healthy Plant' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>{d.status}</span>
                      </td>
                      <td className="py-3 text-gray-500">{new Date(d.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-14 text-center">
      <BarChart3 className="w-14 h-14 text-gray-200 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-700">No analytics data yet</h3>
      <p className="text-gray-500 mt-1 max-w-sm mx-auto">
        Your charts and statistics will appear here once you run disease detections.
      </p>
      <Link to="/dashboard/detect" className="inline-block mt-5 px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
        Run Your First Scan
      </Link>
    </div>
  )
}
