import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import PrivateRoute from './components/PrivateRoute'
import DashboardLayout from './components/DashboardLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardHome from './pages/dashboard/DashboardHome'
import DetectPage from './pages/dashboard/DetectPage'
import AnalyticsPage from './pages/dashboard/AnalyticsPage'
import HistoryPage from './pages/dashboard/HistoryPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import FloatingChatbot from './components/FloatingChatbot'
import HeyAgriVoiceAssistant from './components/HeyAgriVoiceAssistant'

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected dashboard (sidebar layout + nested pages) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="detect" element={<DetectPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Global Floating Chatbot - Available on all pages */}
        <FloatingChatbot />
        
        {/* Hey Agri Kannada Voice Assistant - Available on all pages */}
        <HeyAgriVoiceAssistant />
      </Router>
    </AppProvider>
  )
}
