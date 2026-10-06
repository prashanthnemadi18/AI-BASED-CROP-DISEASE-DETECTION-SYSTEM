import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, ScanSearch, MapPin, Download, Trash2, X, Loader2, AlertTriangle, Droplets, Thermometer, Snowflake, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { predictDisease } from '../../lib/api'
import { downloadReport } from '../../lib/pdf'
import PredictionCard from '../../components/PredictionCard'
import WeatherCard from '../../components/WeatherCard'

const ALLOWED = ['png', 'jpg', 'jpeg', 'webp']

export default function DetectPage() {
  const { savePrediction, settings } = useApp()

  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [city, setCity] = useState(settings.defaultCity || 'New Delhi')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)

  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Auto-detect city via geolocation once
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        const data = await res.json()
        const name = data.address?.city || data.address?.town || data.address?.village
        if (name) setCity(name)
      } catch { /* keep default city */ }
    }, () => { /* ignore */ })
  }, [])

  useEffect(() => () => stopCamera(), []) // cleanup stream on unmount

  const validateAndSet = (file) => {
    if (!file) return
    const ext = file.name ? file.name.split('.').pop().toLowerCase() : 'jpg'
    if (!ALLOWED.includes(ext) && file.type && !ALLOWED.some((e) => file.type.includes(e))) {
      setError('Unsupported file type. Please use PNG, JPG, JPEG or WEBP.')
      return
    }
    setError('')
    setResult(null)
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreviewUrl(e.target.result)
    reader.readAsDataURL(file)
  }

  const onFileChange = (e) => validateAndSet(e.target.files?.[0])

  const onDrop = (e) => {
    e.preventDefault()
    validateAndSet(e.dataTransfer.files?.[0])
  }

  const startCamera = async () => {
    try {
      // Request camera with mobile-optimized settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      })
      setCameraActive(true)
      setError('') // Clear any previous errors
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play() // Ensure video plays on mobile
        }
      }, 50)
    } catch (err) {
      console.error('Camera error:', err)
      setError('Camera access denied or unavailable. Please check your browser permissions.')
    }
  }

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        blob.name = `capture_${Date.now()}.jpg`
        validateAndSet(blob)
      }
      stopCamera()
    }, 'image/jpeg', 0.92)
  }

  function stopCamera() {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop())
    }
    setCameraActive(false)
  }

  const clearImage = () => {
    setImageFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAnalyze = async () => {
    if (!imageFile) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const raw = await predictDisease(imageFile, city)
      
      // Handle new validation statuses
      if (raw.success === false) {
        // Image was rejected (unsupported plant, uncertain, or invalid)
        if (raw.status === 'unsupported') {
          setError(`❌ ${raw.message || 'Unsupported plant detected. Please upload a Pepper, Potato, or Tomato leaf image.'}`)
        } else if (raw.status === 'uncertain') {
          setError(`⚠️ ${raw.message || 'Classification confidence is low. Please upload a clearer image.'}`)
        } else if (raw.status === 'invalid') {
          setError(`❌ ${raw.message || 'Invalid image. Please upload a clear leaf image.'}`)
        } else {
          setError(raw.message || raw.error || 'Unable to classify the image.')
        }
        return
      }
      
      // Success - save and display result
      const record = await savePrediction(raw, previewUrl)
      setResult(record)
      
      // Save to localStorage for voice assistant context
      localStorage.setItem('lastPrediction', JSON.stringify({
        disease: record.disease,
        crop: record.crop || 'Unknown',
        confidence: record.confidence,
        severity: record.severity,
        timestamp: new Date().toISOString()
      }))
    } catch (e) {
      setError('Could not reach the AI backend. Make sure it is running (python app.py in the backend folder, port 5000).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Left: input */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Detect Crop Disease</h2>
          <p className="text-sm text-gray-500 mb-5">Upload an image or capture one with your camera, then run the analysis.</p>

          {/* Input mode buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-green-200 text-green-700 font-semibold hover:bg-green-50 transition"
            >
              <Upload className="w-5 h-5" /> Upload Image
            </button>
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition ${
                cameraActive ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-blue-200 text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Camera className="w-5 h-5" /> {cameraActive ? 'Close Camera' : 'Use Camera'}
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.webp,image/*" onChange={onFileChange} className="hidden" />

          {/* Drop zone / preview */}
          <AnimatePresence mode="wait">
            {cameraActive ? (
              <motion.div key="cam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl bg-black" />
                <canvas ref={canvasRef} width={640} height={480} className="hidden" />
                <div className="flex gap-3">
                  <button onClick={capturePhoto} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
                    Capture Photo
                  </button>
                  <button onClick={stopCamera} className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition">
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : previewUrl ? (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                <img src={previewUrl} alt="Selected crop" className="w-full max-h-96 object-contain rounded-xl bg-gray-50 border border-gray-100" />
                <button onClick={clearImage} className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow hover:bg-white" aria-label="Remove image">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="drop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="border-2 border-dashed border-green-300 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50/50 transition"
              >
                <Upload className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-gray-700">Click to upload or drag &amp; drop</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG or WEBP (max 16MB)</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Location */}
          <div className="mt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location (for weather &amp; risk)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={!imageFile || loading}
            className="w-full mt-5 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing image...</> : <><ScanSearch className="w-5 h-5" /> Analyze Image</>}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> {error}
            </div>
          )}
        </div>
      </div>

      {/* Right: result */}
      <div className="lg:col-span-2 space-y-6">
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin mx-auto mb-3" />
            <p className="font-semibold text-gray-700">AI is analyzing your image…</p>
            <p className="text-sm text-gray-500 mt-1">This usually takes a few seconds.</p>
          </div>
        )}

        {!loading && !result && (
          <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-10 text-center">
            <ScanSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-600">No result yet</p>
            <p className="text-sm text-gray-400 mt-1">Select an image and click “Analyze Image” to see the diagnosis here.</p>
          </div>
        )}

        {result && (
          <>
            <PredictionCard prediction={result} />
            {result.weather?.city && <WeatherCard weather={result.weather} />}
            {result.weatherAdvice?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="font-semibold text-amber-800 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Weather Advice</p>
                <ul className="space-y-1.5 text-sm text-amber-900">
                  {result.weatherAdvice.map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AdviceIcon text={a} />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => downloadReport(result)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
                <Download className="w-5 h-5" /> Report
              </button>
              <button onClick={clearImage} className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">
                <Trash2 className="w-5 h-5" /> New Scan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** Pick a contextual icon for a weather-advice line (replaces emoji prefixes). */
function AdviceIcon({ text }) {
  const t = (text || '').toLowerCase()
  const cls = 'w-4 h-4 shrink-0 mt-0.5'
  if (t.includes('humid')) return <Droplets className={cls} />
  if (t.includes('cold')) return <Snowflake className={cls} />
  if (t.includes('temperature') || t.includes('irrigation')) return <Thermometer className={cls} />
  if (t.includes('favorable')) return <CheckCircle2 className={cls} />
  return <AlertTriangle className={cls} />
}
