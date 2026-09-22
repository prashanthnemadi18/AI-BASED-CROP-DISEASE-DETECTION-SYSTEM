import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, ScanSearch, BarChart3, History, User, Settings, LogOut, Leaf, X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export const NAV_ITEMS = [
  { to: '/dashboard', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/detect', label: 'Disease Detection', icon: ScanSearch },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/history', label: 'Detection History', icon: History },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onClose?.()
    navigate('/')
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        className={`fixed z-50 top-0 left-0 h-full w-72 bg-gradient-to-b from-green-800 to-green-950 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Leaf className="w-7 h-7 text-green-300" />
            <div className="leading-tight">
              <p className="font-bold text-sm">AgroGuard AI</p>
              <p className="text-[11px] text-green-200/70">Crop Disease System</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-green-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white shadow-inner'
                    : 'text-green-100/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-green-300/20 flex items-center justify-center font-bold text-green-200">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-green-200/70 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-200 hover:bg-red-500/20 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  )
}
