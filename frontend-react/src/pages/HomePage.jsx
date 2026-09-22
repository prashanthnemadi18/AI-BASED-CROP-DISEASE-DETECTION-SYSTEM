import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Leaf, Camera, Upload, ScanSearch, Zap, BookOpen, History, BarChart3,
  Sprout, Clock, Smile, Cpu, ShieldCheck, Globe, Menu, X, Heart,
} from 'lucide-react'
import { useState } from 'react'

const FEATURES = [
  { icon: Cpu, title: 'AI Disease Detection', desc: 'A deep-learning CNN model identifies crop diseases from a single leaf image with high accuracy.' },
  { icon: Upload, title: 'Upload Crop Images', desc: 'Upload PNG, JPG, JPEG or WEBP photos of leaves and get an instant diagnosis.' },
  { icon: Camera, title: 'Capture with Camera', desc: 'Use your device camera to capture the affected leaf directly in the field.' },
  { icon: Zap, title: 'Fast Prediction', desc: 'Results in seconds — no waiting, no lab tests, right from your browser.' },
  { icon: BookOpen, title: 'Info & Recommendations', desc: 'Clear symptoms, treatment steps and prevention tips for every detected disease.' },
  { icon: BarChart3, title: 'History & Analytics', desc: 'Track every scan with detection history, charts and trends over time.' },
]

const STEPS = [
  { icon: Upload, title: 'Upload or Capture', desc: 'Add a crop/leaf image by uploading a file or using your camera.' },
  { icon: ScanSearch, title: 'AI Analyzes', desc: 'The image is preprocessed and passed through the trained AI model.' },
  { icon: Leaf, title: 'Disease Detected', desc: 'The system predicts the most likely disease with a confidence score.' },
  { icon: BookOpen, title: 'Results & Advice', desc: 'View symptoms, recommended treatment and prevention tips.' },
  { icon: History, title: 'View History', desc: 'Every analysis is saved so you can review trends and past results.' },
]

const ADVANTAGES = [
  { icon: Sprout, title: 'Early Disease Detection', desc: 'Catch infections before they spread across your field.' },
  { icon: Clock, title: 'Saves Farmer Time', desc: 'No travel to labs — diagnose in seconds from anywhere.' },
  { icon: Smile, title: 'Easy to Use', desc: 'A simple interface anyone can use without technical knowledge.' },
  { icon: Cpu, title: 'AI-Powered Analysis', desc: 'Consistent, data-driven predictions backed by machine learning.' },
  { icon: ShieldCheck, title: 'Reduces Crop Loss', desc: 'Timely treatment helps protect yield and income.' },
  { icon: Globe, title: 'Web Accessible', desc: 'Works on desktop, tablet and mobile through a simple web app.' },
]

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/85 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-700 rounded-xl">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="leading-tight">
              <span className="block text-sm sm:text-base font-extrabold text-green-800 tracking-tight">
                AI-BASED CROP DISEASE
              </span>
              <span className="block text-[11px] sm:text-xs font-semibold text-green-600 tracking-wide">
                DETECTION SYSTEM
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <a href="#features" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-green-700">Features</a>
            <a href="#how" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-green-700">How It Works</a>
            <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transition text-sm">
              <Leaf className="w-4 h-4" /> Login
            </Link>
          </div>

          <button className="md:hidden p-2 text-gray-700" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
            <a href="#features" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg">Features</a>
            <a href="#how" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg">How It Works</a>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 bg-green-600 text-white rounded-lg font-semibold text-center">Login</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 -left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.span variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <Sprout className="w-4 h-4" /> AI-Powered Agriculture
            </motion.span>
            <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              AI-Based Crop <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Disease Detection</span> System
            </motion.h1>
            <motion.p variants={item} className="text-lg text-gray-600 mb-8 max-w-xl">
              Protect your harvest with instant, AI-driven diagnosis. Upload or capture a leaf image
              to detect diseases, get treatment recommendations and track your field health over time.
            </motion.p>
            <motion.div variants={item} className="flex flex-wrap gap-4">
              <Link to="/login" className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-xl transition transform hover:scale-105">
                Get Started
              </Link>
              <Link to="/register" className="px-8 py-3.5 border-2 border-green-600 text-green-700 rounded-xl font-semibold hover:bg-green-50 transition">
                Create Account
              </Link>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-3 gap-4 mt-10 max-w-md">
              {[{ n: '15+', l: 'Disease Classes' }, { n: '85%', l: 'Accuracy' }, { n: '3', l: 'Crops' }].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-green-700">{s.n}</p>
                  <p className="text-xs text-gray-500">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero illustration */}
          <motion.div
            className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 2px, transparent 2px), radial-gradient(circle at 70% 60%, #fff 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
              <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
                <ScanSearch className="w-24 h-24 mx-auto mb-4 opacity-90" />
              </motion.div>
              <p className="text-2xl font-bold">Scan · Detect · Protect</p>
              <p className="text-green-50 mt-2 max-w-xs">Point your camera at a leaf and let AI do the rest.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Features" title="Everything You Need to Protect Crops" subtitle="Powerful tools designed for real-world farming." />
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            {FEATURES.map((f, i) => (
              <motion.div key={i} variants={item} whileHover={{ y: -6 }} className="p-7 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="How It Works" title="Five Simple Steps" subtitle="From photo to diagnosis in under a minute." />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white rounded-2xl p-6 shadow-sm border border-green-100 text-center"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="w-12 h-12 mx-auto rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3 mt-2">
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Advantages" title="Why Farmers Choose Us" subtitle="Real benefits that protect your yield and income." />
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            {ADVANTAGES.map((a, i) => (
              <motion.div key={i} variants={item} className="flex gap-4 p-6 rounded-2xl hover:bg-green-50 transition-colors">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center">
                  <a.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{a.title}</h3>
                  <p className="text-sm text-gray-600">{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-5xl mx-auto bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Leaf className="w-40 h-40 absolute -top-8 -right-8 opacity-10" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative">Ready to Protect Your Crops?</h2>
          <p className="text-green-100 mb-8 text-lg relative">Create a free account and start detecting diseases today.</p>
          <div className="flex flex-wrap gap-4 justify-center relative">
            <Link to="/register" className="px-8 py-3.5 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition transform hover:scale-105">
              Create Account
            </Link>
            <Link to="/login" className="px-8 py-3.5 border-2 border-white/60 text-white rounded-xl font-semibold hover:bg-white/10 transition">
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-500" />
            <span className="font-semibold text-white">AI-Based Crop Disease Detection System</span>
          </div>
          <p className="text-sm flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} AgroGuard AI. Built with
            <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for farmers.
          </p>
        </div>
      </footer>
    </div>
  )
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      className="text-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <span className="text-sm font-bold uppercase tracking-wider text-green-600">{eyebrow}</span>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-3">{title}</h2>
      <p className="text-gray-600 text-lg">{subtitle}</p>
    </motion.div>
  )
}
