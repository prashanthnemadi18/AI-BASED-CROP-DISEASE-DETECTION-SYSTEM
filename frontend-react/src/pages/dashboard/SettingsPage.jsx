import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, MapPin, SlidersHorizontal, Database, Bell, Server, Trash2, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { checkHealth } from '../../lib/api'

export default function SettingsPage() {
  const { settings, updateSettings, clearHistory, detections } = useApp()
  const [health, setHealth] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    checkHealth().then(setHealth)
  }, [])

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    updateSettings({ [key]: value })
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Backend status */}
      <motion.section
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-green-600" /> AI Backend Status
        </h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${health?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {health?.status === 'healthy' ? 'Connected' : 'Not reachable'}
              </p>
              <p className="text-xs text-gray-500">
                {health?.model_loaded ? `Model loaded · ${health.classes} classes` : 'Run "python app.py" in the backend folder'}
              </p>
            </div>
          </div>
          <button onClick={() => checkHealth().then(setHealth)} className="text-sm font-semibold text-green-600 hover:text-green-700">
            Refresh
          </button>
        </div>
      </motion.section>

      {/* Preferences */}
      <motion.section
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
      >
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-green-600" /> Preferences
        </h3>

        {/* Default city */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
            <MapPin className="w-4 h-4 text-gray-400" /> Default Location
          </label>
          <input
            type="text" value={settings.defaultCity} onChange={set('defaultCity')}
            className="w-full max-w-sm px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="City name"
          />
        </div>

        {/* Confidence threshold */}
        <div>
          <label className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-1.5">
            <span className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-gray-400" /> Minimum Confidence</span>
            <span className="text-green-600">{settings.confidenceThreshold}%</span>
          </label>
          <input
            type="range" min="0" max="100" value={settings.confidenceThreshold}
            onChange={set('confidenceThreshold')}
            className="w-full max-w-sm accent-green-600"
          />
          <p className="text-xs text-gray-400 mt-1">Results below this confidence will be flagged as low certainty.</p>
        </div>

        {/* Units */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Temperature Units</label>
          <div className="flex gap-2">
            {[{ v: 'metric', l: 'Celsius (°C)' }, { v: 'imperial', l: 'Fahrenheit (°F)' }].map((o) => (
              <button
                key={o.v}
                onClick={() => updateSettings({ units: o.v })}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                  settings.units === o.v ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <Toggle
          icon={<Database className="w-4 h-4" />}
          label="Save detection history"
          desc="Store each analysis so it appears in History and Analytics."
          checked={settings.saveHistory}
          onChange={() => updateSettings({ saveHistory: !settings.saveHistory })}
        />
        <Toggle
          icon={<Bell className="w-4 h-4" />}
          label="High-risk weather alerts"
          desc="Highlight alerts when humidity or temperature raises disease risk."
          checked={settings.emailAlerts}
          onChange={() => updateSettings({ emailAlerts: !settings.emailAlerts })}
        />
      </motion.section>

      {/* Danger zone */}
      <motion.section
        className="bg-white rounded-2xl shadow-sm border border-red-100 p-6"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <h3 className="font-bold text-red-600 mb-1 flex items-center gap-2">
          <Trash2 className="w-5 h-5" /> Danger Zone
        </h3>
        <p className="text-sm text-gray-500 mb-4">Permanently delete all {detections.length} saved detection records from this device.</p>
        {confirmClear ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => { clearHistory(); setConfirmClear(false) }}
              className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Yes, delete everything
            </button>
            <button onClick={() => setConfirmClear(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            disabled={detections.length === 0}
            className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Detection History
          </button>
        )}
      </motion.section>
    </div>
  )
}

function Toggle({ icon, label, desc, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 pt-2">
      <div>
        <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="text-gray-400">{icon}</span> {label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative shrink-0 w-12 h-6 rounded-full transition-colors ${checked ? 'bg-green-600' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow flex items-center justify-center transition-transform ${checked ? 'translate-x-6' : ''}`}>
          {checked && <Check className="w-3 h-3 text-green-600" />}
        </span>
      </button>
    </div>
  )
}
