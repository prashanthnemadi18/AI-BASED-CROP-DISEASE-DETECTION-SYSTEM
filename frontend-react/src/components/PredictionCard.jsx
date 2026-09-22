import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, AlertTriangle, Leaf, Activity, Stethoscope, ShieldCheck, Check } from 'lucide-react'
import { formatDisease, severityTheme } from '../lib/diseaseInfo'

/**
 * Detection result card. Accepts an enriched detection record:
 * { crop, disease, confidence, severity, status, description, symptoms,
 *   treatment[], prevention[], imageDataUrl? }
 */
export default function PredictionCard({ prediction }) {
  if (!prediction) return null

  const theme = severityTheme(prediction.severity)
  const healthy = prediction.status === 'Healthy Plant'

  const StatusIcon = healthy ? CheckCircle : prediction.severity === 'High' || prediction.severity === 'Very High' ? AlertTriangle : AlertCircle

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header banner */}
      <div className={`bg-gradient-to-r ${theme.gradient} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 flex items-center gap-1.5">
              <Leaf className="w-4 h-4" /> Crop / Plant
            </p>
            <p className="text-xl font-semibold">{prediction.crop || 'Unknown'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Status</p>
            <p className="flex items-center gap-1.5 font-semibold justify-end">
              <StatusIcon className="w-5 h-5" /> {prediction.status}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Disease + confidence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Detected Disease
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme.badge}`}>
              {prediction.severity} severity
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatDisease(prediction.disease)}</p>

          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Confidence</span>
              <span className="font-bold text-gray-900">{prediction.confidence}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${theme.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${prediction.confidence}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {prediction.description && (
          <Section title="Description">{prediction.description}</Section>
        )}

        {prediction.symptoms && (
          <Section title="Possible Symptoms" icon={<Stethoscope className="w-4 h-4" />}>
            {prediction.symptoms}
          </Section>
        )}

        {prediction.treatment?.length > 0 && (
          <Section title="Recommended Treatment" icon={<Stethoscope className="w-4 h-4" />}>
            <ul className="space-y-1.5">
              {prediction.treatment.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className={theme.text}>•</span>
                  <span className="text-gray-600">{t}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {prediction.prevention?.length > 0 && (
          <Section title="Prevention Tips" icon={<ShieldCheck className="w-4 h-4" />}>
            <ul className="space-y-1.5">
              {prediction.prevention.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600">{t}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </motion.div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
        {icon} {title}
      </p>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  )
}
