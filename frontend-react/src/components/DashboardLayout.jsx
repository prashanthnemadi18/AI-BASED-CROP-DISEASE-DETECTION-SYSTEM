import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, Bell, Leaf } from 'lucide-react'
import Sidebar, { NAV_ITEMS } from './Sidebar'
import { useApp } from '../context/AppContext'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useApp()
  const location = useLocation()

  const current = NAV_ITEMS.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )
  const title = current?.label || 'Dashboard'

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content offset by sidebar width on large screens */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h1>
                <p className="hidden sm:block text-xs text-gray-500">
                  AI-Based Crop Disease Detection System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600" aria-label="Notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full" />
              </button>
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold">
                  {user?.name?.[0]?.toUpperCase() || <Leaf className="w-4 h-4" />}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-[11px] text-gray-500">Farmer</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
