/**
 * Client-side helpers. Users and detection history now live in MongoDB
 * (via the Flask API); the browser only keeps the auth token, a cached copy
 * of the user for instant paint, and UI settings.
 */

const TOKEN_KEY = 'agroguard_token'
const USER_KEY = 'user'
const SETTINGS_KEY = 'agroguard_settings'

/* -------------------------------- Token --------------------------------- */

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch (e) {
    console.warn('Token storage failed:', e)
  }
}

/* --------------------------- Cached user (UX) ---------------------------- */

export function getCachedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCachedUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch (e) {
    console.warn('User cache failed:', e)
  }
}

export function clearAuth() {
  setToken(null)
  setCachedUser(null)
}

/* ------------------------------ Settings -------------------------------- */

export const DEFAULT_SETTINGS = {
  defaultCity: 'New Delhi',
  confidenceThreshold: 60,
  saveHistory: true,
  emailAlerts: false,
  units: 'metric',
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...readJSON(SETTINGS_KEY, {}) }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (e) {
    console.warn('Settings storage failed:', e)
  }
}
