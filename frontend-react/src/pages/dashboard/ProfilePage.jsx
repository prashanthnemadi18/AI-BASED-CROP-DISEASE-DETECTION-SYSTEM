import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, CalendarDays, Save, Activity, Sprout, ScanSearch, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { computeAnalytics } from '../../lib/analytics'

export default function ProfilePage() {
  const { user, detections, updateProfile } = useApp()
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)
  const stats = computeAnalytics(detections)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const result = await updateProfile({ name: name.trim() })
    if (result.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—'

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Profile card */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-3xl font-bold mb-4">
          {user?.name?.[0]?.toUpperCase() || <User className="w-10 h-10" />}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
        <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
          <CalendarDays className="w-3.5 h-3.5" /> Joined {joined}
        </span>

        <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500">Scans</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{stats.diseased}</p>
            <p className="text-xs text-gray-500">Diseases</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.healthy}</p>
            <p className="text-xs text-gray-500">Healthy</p>
          </div>
        </div>
      </motion.div>

      {/* Edit form */}
      <motion.div
        className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <h3 className="font-bold text-gray-900 mb-5">Edit Profile</h3>
        <form onSubmit={handleSave} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email" value={user?.email || ''} disabled
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
              <Save className="w-4 h-4" /> Save Changes
            </button>
            {saved && <span className="text-sm text-green-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Profile updated</span>}
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 mb-3">Activity Summary</h4>
          <div className="grid sm:grid-cols-3 gap-3">
            <Summary icon={<Activity className="w-5 h-5" />} label="Total Analyzed" value={stats.total} />
            <Summary icon={<ScanSearch className="w-5 h-5" />} label="Diseases Found" value={stats.diseased} />
            <Summary icon={<Sprout className="w-5 h-5" />} label="Healthy Plants" value={stats.healthy} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Summary({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <span className="text-green-600">{icon}</span>
      <div>
        <p className="text-lg font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  )
}
