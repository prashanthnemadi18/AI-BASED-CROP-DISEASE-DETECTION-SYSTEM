import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import { useApp } from '../context/AppContext'

export default function RegisterPage() {
  const { register } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.password) errs.password = 'Password is required.'
    else if (form.password.length < 6) errs.password = 'Use at least 6 characters.'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)

    const result = await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
    setLoading(false)
    if (result.success) {
      // Registration also signs the user in (token issued by the API).
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join free and start protecting your crops with AI."
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:text-green-700">
            Login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Full Name"
          icon={User}
          value={form.name}
          onChange={update('name')}
          placeholder="John Farmer"
          error={errors.name}
          autoComplete="name"
        />
        <FormField
          label="Username / Email"
          icon={Mail}
          type="email"
          value={form.email}
          onChange={update('email')}
          placeholder="farmer@example.com"
          error={errors.email}
          autoComplete="username"
        />
        <FormField
          label="Password"
          icon={Lock}
          type="password"
          value={form.password}
          onChange={update('password')}
          placeholder="At least 6 characters"
          error={errors.password}
          autoComplete="new-password"
        />
        <FormField
          label="Confirm Password"
          icon={CheckCircle2}
          type="password"
          value={form.confirm}
          onChange={update('confirm')}
          placeholder="Re-enter your password"
          error={errors.confirm}
          autoComplete="new-password"
        />

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
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  )
}
