import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import * as api from '../lib/api'
import {
  getToken, setToken, getCachedUser, setCachedUser, clearAuth,
  getSettings, saveSettings as persistSettings, DEFAULT_SETTINGS,
} from '../lib/storage'
import { getCropFromDisease, getStatus, getPreventionTips } from '../lib/diseaseInfo'

const AppContext = createContext(null)

/** Ensure a detection record has all display fields, deriving any that are missing. */
function enrich(record = {}) {
  const disease = record.disease || ''
  return {
    ...record,
    id: record.id || record._id || Math.random().toString(36).slice(2, 11),
    crop: record.crop || getCropFromDisease(disease),
    status: record.status || getStatus(disease),
    prevention: record.prevention?.length ? record.prevention : getPreventionTips(disease),
    treatment: record.treatment || [],
    weatherAdvice: record.weatherAdvice || [],
    timestamp: record.timestamp || record.createdAt || new Date().toISOString(),
  }
}

export function AppProvider({ children }) {
  // Initialize synchronously from the cached session so protected routes
  // resolve on first paint; the token is re-validated in the background.
  const [user, setUser] = useState(() => (getToken() ? getCachedUser() : null))
  const [detections, setDetections] = useState([])
  const [settings, setSettings] = useState(() => getSettings())
  const [initializing, setInitializing] = useState(() => !!getToken())

  const loadDetections = useCallback(async () => {
    if (!getToken()) return
    try {
      const { detections: list } = await api.fetchDetections()
      setDetections((list || []).map(enrich))
    } catch {
      /* keep whatever we have */
    }
  }, [])

  // Validate the cached session and load history on mount
  useEffect(() => {
    let active = true
    async function restore() {
      if (!getToken()) {
        if (active) setInitializing(false)
        return
      }
      try {
        const { user: me } = await api.fetchMe()
        if (!active) return
        setUser(me)
        setCachedUser(me)
        await loadDetections()
      } catch {
        if (!active) return
        // Token invalid or backend down -> clear the stale session
        clearAuth()
        setUser(null)
        setDetections([])
      } finally {
        if (active) setInitializing(false)
      }
    }
    restore()
    return () => { active = false }
  }, [loadDetections])

  const register = useCallback(async ({ name, email, password }) => {
    try {
      const { token, user: created } = await api.register(name, email, password)
      setToken(token)
      setCachedUser(created)
      setUser(created)
      setDetections([])
      return { success: true }
    } catch (error) {
      return { success: false, error: api.errorMessage(error) }
    }
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const { token, user: logged } = await api.login(email, password)
      setToken(token)
      setCachedUser(logged)
      setUser(logged)
      await loadDetections()
      return { success: true }
    } catch (error) {
      return { success: false, error: api.errorMessage(error) }
    }
  }, [loadDetections])

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
    setDetections([])
  }, [])

  const updateProfile = useCallback(async (updates) => {
    try {
      const { user: updated } = await api.updateProfile(updates.name)
      setUser(updated)
      setCachedUser(updated)
      return { success: true }
    } catch (error) {
      return { success: false, error: api.errorMessage(error) }
    }
  }, [])

  /**
   * Persist a prediction to MongoDB (when signed in) and return the enriched
   * record for immediate display. Falls back to a local record if the save
   * fails so the user still sees their result.
   */
  const savePrediction = useCallback(async (raw, imageDataUrl) => {
    const local = enrich({
      ...raw,
      weatherAdvice: raw.weather_advice,
      imageDataUrl,
      timestamp: new Date().toISOString(),
    })

    if (!getToken() || !settings.saveHistory) {
      setDetections((prev) => [local, ...prev].slice(0, 100))
      return local
    }

    try {
      const { detection } = await api.createDetection(local)
      const saved = enrich(detection)
      setDetections((prev) => [saved, ...prev].slice(0, 100))
      return saved
    } catch {
      setDetections((prev) => [local, ...prev].slice(0, 100))
      return local
    }
  }, [settings.saveHistory])

  const clearHistory = useCallback(async () => {
    setDetections([])
    if (getToken()) {
      try { await api.clearDetections() } catch { /* already cleared locally */ }
    }
  }, [])

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates }
      persistSettings(next)
      return next
    })
  }, [])

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    initializing,
    detections,
    settings,
    register,
    login,
    logout,
    updateProfile,
    savePrediction,
    clearHistory,
    updateSettings,
  }), [user, initializing, detections, settings, register, login, logout, updateProfile, savePrediction, clearHistory, updateSettings])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}

export { DEFAULT_SETTINGS }
