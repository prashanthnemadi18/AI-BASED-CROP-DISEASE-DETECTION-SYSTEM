import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Leaf, Sprout, ShieldCheck, BarChart3 } from 'lucide-react'

/**
 * Shared split-screen shell for the Login and Register pages.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #fff 2px, transparent 2px)', backgroundSize: '48px 48px' }} />
        <Leaf className="w-64 h-64 absolute -bottom-10 -left-10 opacity-10" />

        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="p-2 bg-white/15 rounded-xl"><Leaf className="w-6 h-6" /></div>
          <div className="leading-tight">
            <p className="font-bold">AgroGuard AI</p>
            <p className="text-xs text-green-200/80">Crop Disease Detection</p>
          </div>
        </Link>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold mb-4 leading-snug">
            Smart disease detection for healthier harvests.
          </h2>
          <ul className="space-y-4 mt-8">
            {[
              { icon: Sprout, text: 'Detect crop diseases from a single photo' },
              { icon: ShieldCheck, text: 'Get treatment & prevention guidance' },
              { icon: BarChart3, text: 'Track history and analytics over time' },
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <f.icon className="w-5 h-5" />
                </span>
                <span className="text-green-50">{f.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="text-sm text-green-200/70 relative z-10">
          &copy; {new Date().getFullYear()} AI-Based Crop Disease Detection System
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-green-50/50 to-white">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="p-2 bg-green-600 rounded-xl"><Leaf className="w-6 h-6 text-white" /></div>
            <span className="font-bold text-green-800">AgroGuard AI</span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{title}</h1>
          <p className="text-gray-500 mb-8">{subtitle}</p>

          {children}

          {footer && <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>}
        </motion.div>
      </div>
    </div>
  )
}
