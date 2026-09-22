import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Loader2, Info, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const registered = location.state?.registered

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotMsg, setForgotMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)

    const result = await login(email.trim(), password)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  const handleForgot = (e) => {
    e.preventDefault()
    setForgotMsg(`If an account exists for ${email || 'that email'}, a reset link has been sent.`)
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to access your crop disease dashboard."
      footer={
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="text-green-600 font-semibold hover:text-green-700">
            Create Account
          </Link>
        </p>
      }
    >
      {registered && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          Account created successfully! You can now log in.
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          label="Username / Email"
          icon={Mail}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="farmer@example.com"
          autoComplete="username"
        />
        <FormField
          label="Password"
          icon={Lock}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowForgot(!showForgot)}
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            Forgot Password?
          </button>
        </div>

        <AnimatePresence>
          {showForgot && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="flex items-center gap-2 text-sm text-blue-800 font-medium mb-2">
                  <Info className="w-4 h-4" /> Reset your password
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your account email"
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={handleForgot}
                  className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Send Reset Link
                </button>
                {forgotMsg && <p className="mt-2 text-xs text-blue-700">{forgotMsg}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Logging in...</> : 'Login'}
        </button>
      </form>

      <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
        New here? Click <strong>Create Account</strong> below to register first, then log in with your credentials.
      </div>
    </AuthLayout>
  )
}
