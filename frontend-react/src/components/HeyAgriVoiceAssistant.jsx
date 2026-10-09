import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, X, Minimize2, Maximize2, Volume2, VolumeX, Sparkles, Loader2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Assistant States
const STATES = {
  IDLE: 'idle',
  WAKE_WORD_LISTENING: 'wake_word_listening',
  ACTIVATED: 'activated',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  SPEAKING: 'speaking',
  ERROR: 'error'
}

export default function HeyAgriVoiceAssistant() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [state, setState] = useState(STATES.IDLE)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [showTextInput, setShowTextInput] = useState(false)
  const [textQuery, setTextQuery] = useState('')

  const recognitionRef = useRef(null)
  const speechSynthesisRef = useRef(null)

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const SpeechSynthesis = window.speechSynthesis
    
    if (!SpeechRecognition || !SpeechSynthesis) {
      setIsSupported(false)
      setError('ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ browser voice features ಅನ್ನು support ಮಾಡುತ್ತಿಲ್ಲ. Chrome ಅಥವಾ Edge browser ಬಳಸಿ.')
      return
    }

    // Check and request microphone permission
    const requestMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach(track => track.stop()) // Stop immediately after permission granted
        setPermissionGranted(true)
        setError('')
      } catch (err) {
        console.error('Microphone permission denied:', err)
        setPermissionGranted(false)
        setError('Voice Assistant ಬಳಸಲು microphone permission ಅಗತ್ಯವಿದೆ. Browser settings ನಲ್ಲಿ microphone permission ಅನ್ನು Allow ಮಾಡಿ.')
        setState(STATES.ERROR)
      }
    }

    // Initialize Speech Recognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US' // Use en-US instead of en-IN for better offline support
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      console.log('Speech recognition started')
      setError('')
    }

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      console.log('Recognized:', text)
      handleRecognizedText(text)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setPermissionGranted(false)
        setError('Microphone permission denied. ದಯವಿಟ್ಟು browser settings ನಲ್ಲಿ microphone permission ಅನ್ನು Allow ಮಾಡಿ.')
        setState(STATES.ERROR)
      } else if (event.error === 'no-speech') {
        // Only show error if not waiting for wake word
        if (state !== STATES.WAKE_WORD_LISTENING) {
          setError('ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಮಾತು ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.')
          setState(STATES.ERROR)
          setTimeout(() => {
            setState(STATES.IDLE)
            setError('')
          }, 3000)
        } else {
          // Silently restart for wake word listening
          setTimeout(() => startWakeWordListening(), 500)
        }
      } else if (event.error === 'network') {
        // Network error in speech recognition - Chrome needs internet
        console.warn('Speech recognition network error - Chrome needs internet for speech-to-text')
        
        // Automatically show text input instead of showing error
        setShowTextInput(true)
        setState(STATES.IDLE)
        setError('') // Clear error
        
        // Show a gentle notification instead
        setResponse('🌐 Speech recognition ಗೆ internet ಬೇಕು.\n\n✅ Type button ಬಳಸಿ ಪ್ರಶ್ನೆ ಕೇಳಿ!')
        
        // Don't restart speech recognition
        return
      } else if (event.error === 'aborted') {
        // Speech recognition was aborted - usually not a problem
        console.log('Speech recognition aborted')
        if (state === STATES.WAKE_WORD_LISTENING && isOpen) {
          // Silently restart
          setTimeout(() => startWakeWordListening(), 500)
        }
      } else if (event.error === 'audio-capture') {
        setError('Microphone ಸಿಗುತ್ತಿಲ್ಲ. Device microphone check ಮಾಡಿ.')
        setState(STATES.ERROR)
      } else if (event.error === 'service-not-allowed') {
        setError('Speech service blocked. Browser settings ಅಥವಾ privacy mode check ಮಾಡಿ.')
        setState(STATES.ERROR)
      } else {
        setError(`ಕ್ಷಮಿಸಿ, error: ${event.error}. Page refresh ಮಾಡಿ ಮತ್ತೆ try ಮಾಡಿ.`)
        setState(STATES.ERROR)
        setTimeout(() => {
          setState(STATES.IDLE)
          setError('')
        }, 3000)
      }
    }

    recognition.onend = () => {
      console.log('Speech recognition ended')
      if (state === STATES.WAKE_WORD_LISTENING && isOpen) {
        // Restart wake word listening
        setTimeout(() => {
          try {
            if (recognitionRef.current && isOpen) {
              recognition.start()
            }
          } catch (e) {
            console.error('Failed to restart recognition:', e)
            setError('ಮತ್ತೆ start ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.')
            setState(STATES.ERROR)
          }
        }, 500)
      }
    }

    recognitionRef.current = recognition
    speechSynthesisRef.current = window.speechSynthesis

    // Request microphone permission on init
    if (isOpen) {
      requestMicrophonePermission()
    }

    return () => {
      stopListening()
      stopSpeaking()
    }
  }, [])

  useEffect(() => {
    if (isOpen && state === STATES.IDLE && permissionGranted) {
      startWakeWordListening()
    }
  }, [isOpen])

  const startWakeWordListening = () => {
    try {
      setState(STATES.WAKE_WORD_LISTENING)
      setError('')
      setPermissionGranted(true)
      recognitionRef.current?.start()
    } catch (e) {
      console.error('Failed to start listening:', e)
    }
  }

  const stopListening = () => {
    try {
      recognitionRef.current?.stop()
    } catch (e) {
      console.error('Failed to stop listening:', e)
    }
  }

  const handleRecognizedText = async (text) => {
    const lowerText = text.toLowerCase()

    // Check for wake word
    if (state === STATES.WAKE_WORD_LISTENING) {
      if (lowerText.includes('hey') || lowerText.includes('agri') || 
          lowerText.includes('ಹೇ') || lowerText.includes('ಆಗ್ರಿ')) {
        // Wake word detected!
        setTranscript('Hey Agri')
        setState(STATES.ACTIVATED)
        
        // Get wake word response
        try {
          const response = await axios.get(`${API_URL}/api/voice/wake-word-response`)
          if (response.data.success) {
            const welcomeMsg = response.data.response
            setResponse(welcomeMsg)
            speak(welcomeMsg)
            
            // After speaking welcome, start listening for user query
            setTimeout(() => {
              setState(STATES.LISTENING)
              setTranscript('')
              recognitionRef.current?.start()
            }, 3000)
          }
        } catch (error) {
          console.error('Wake word response error:', error)
          setResponse('ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?')
          speak('ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?')
          setTimeout(() => {
            setState(STATES.LISTENING)
            setTranscript('')
            recognitionRef.current?.start()
          }, 3000)
        }
      } else {
        // Not wake word, keep listening
        startWakeWordListening()
      }
      return
    }

    // User query after activation
    if (state === STATES.LISTENING) {
      setTranscript(text)
      await processQuery(text)
    }
  }

  const processQuery = async (text) => {
    setState(STATES.PROCESSING)
    
    try {
      // Get application context
      const context = getApplicationContext()
      
      // Send to backend
      const response = await axios.post(`${API_URL}/api/voice/process`, {
        text: text,
        context: context
      })

      if (response.data.success) {
        const kannadaResponse = response.data.response
        const suggestions = response.data.suggestions || []
        
        setResponse(kannadaResponse)
        setSuggestions(suggestions)
        
        // Speak response
        speak(kannadaResponse)
      } else {
        setError('ಕ್ಷಮಿಸಿ, ಈಗ ಉತ್ತರಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.')
        setState(STATES.ERROR)
        setTimeout(() => {
          setState(STATES.IDLE)
          if (isOpen) startWakeWordListening()
        }, 2000)
      }
    } catch (error) {
      console.error('Query processing error:', error)
      
      // Better error messages based on error type
      let errorMsg = 'ಕ್ಷಮಿಸಿ, error ಆಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMsg = '❌ Backend server ಸಿಗುತ್ತಿಲ್ಲ!\n\n📌 Solution:\n1. Backend server start ಮಾಡಿ: cd backend → python app.py\n2. Check port 5000 ಖಾಲಿ ಇದೆಯೇ'
      } else if (error.response) {
        // Backend responded with error
        errorMsg = error.response.data?.error || 'Backend error. ಮತ್ತೆ try ಮಾಡಿ.'
      }
      
      setError(errorMsg)
      setState(STATES.ERROR)
      setTimeout(() => {
        setState(STATES.IDLE)
        if (isOpen) startWakeWordListening()
      }, 5000) // Longer timeout for error messages
    }
  }

  const speak = (text) => {
    if (isMuted) return

    stopSpeaking() // Stop any ongoing speech

    setState(STATES.SPEAKING)
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'kn-IN' // Kannada
    utterance.rate = 0.9
    utterance.pitch = 1.0

    utterance.onend = () => {
      setState(STATES.IDLE)
      // Restart wake word listening
      if (isOpen) {
        setTimeout(() => {
          startWakeWordListening()
        }, 500)
      }
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      setState(STATES.IDLE)
      if (isOpen) startWakeWordListening()
    }

    speechSynthesisRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    speechSynthesisRef.current?.cancel()
  }

  const getApplicationContext = () => {
    // Build context from current page and available data
    const context = {
      currentPage: location.pathname,
      isLoggedIn: !!localStorage.getItem('token')
    }

    // Try to get prediction data if on result page
    try {
      const predictionData = localStorage.getItem('lastPrediction')
      if (predictionData) {
        context.prediction = JSON.parse(predictionData)
      }
    } catch (e) {
      console.error('Failed to get prediction context:', e)
    }

    return context
  }

  const handleSuggestionClick = (suggestion) => {
    setTranscript(suggestion)
    processQuery(suggestion)
  }

  const handleTextSubmit = (e) => {
    e.preventDefault()
    if (textQuery.trim()) {
      setTranscript(textQuery)
      processQuery(textQuery)
      setTextQuery('')
      setShowTextInput(false)
    }
  }

  const toggleAssistant = async () => {
    if (isOpen) {
      // Close
      stopListening()
      stopSpeaking()
      setIsOpen(false)
      setState(STATES.IDLE)
      setTranscript('')
      setResponse('')
      setSuggestions([])
      setError('')
    } else {
      // Open and request permission
      setIsOpen(true)
      
      // Request microphone permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach(track => track.stop())
        setPermissionGranted(true)
        setError('')
        setState(STATES.IDLE)
      } catch (err) {
        console.error('Microphone permission error:', err)
        setPermissionGranted(false)
        setError('Microphone permission denied. ದಯವಿಟ್ಟು browser address bar ನಲ್ಲಿ 🔒 lock icon ಒತ್ತಿ, Microphone ಅನ್ನು "Allow" ಮಾಡಿ.')
        setState(STATES.ERROR)
      }
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const toggleMute = () => {
    if (!isMuted) {
      stopSpeaking()
    }
    setIsMuted(!isMuted)
  }

  const manualActivate = async () => {
    // Allow user to manually activate without saying "Hey Agri"
    // Check permission first
    if (!permissionGranted) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach(track => track.stop())
        setPermissionGranted(true)
      } catch (err) {
        setError('Microphone permission needed. Browser settings ನಲ್ಲಿ Allow ಮಾಡಿ.')
        setState(STATES.ERROR)
        return
      }
    }

    setState(STATES.LISTENING)
    setTranscript('')
    setResponse('ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳುತ್ತಿದ್ದೇನೆ...')
    setError('')
    
    try {
      recognitionRef.current?.start()
    } catch (e) {
      console.error('Failed to start recognition:', e)
      setError('ಕ್ಷಮಿಸಿ, microphone start ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. Page refresh ಮಾಡಿ ಮತ್ತೆ try ಮಾಡಿ.')
      setState(STATES.ERROR)
    }
  }

  const getStateDisplay = () => {
    switch (state) {
      case STATES.IDLE:
        return { text: 'Ready', icon: '🌱', color: 'text-gray-600' }
      case STATES.WAKE_WORD_LISTENING:
        return { text: 'Say "Hey Agri"', icon: '👂', color: 'text-blue-600' }
      case STATES.ACTIVATED:
        return { text: 'Activated!', icon: '✨', color: 'text-green-600' }
      case STATES.LISTENING:
        return { text: 'ಕೇಳುತ್ತಿದ್ದೇನೆ...', icon: '🎤', color: 'text-green-600 animate-pulse' }
      case STATES.PROCESSING:
        return { text: 'ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ...', icon: '🤔', color: 'text-yellow-600' }
      case STATES.SPEAKING:
        return { text: 'ಉತ್ತರ ನೀಡುತ್ತಿದ್ದೇನೆ...', icon: '🔊', color: 'text-green-600' }
      case STATES.ERROR:
        return { text: 'Error', icon: '⚠️', color: 'text-red-600' }
      default:
        return { text: 'Ready', icon: '🌱', color: 'text-gray-600' }
    }
  }

  if (!isSupported) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm"
      >
        <p className="text-sm text-gray-700">
          ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ browser voice features ಅನ್ನು support ಮಾಡುತ್ತಿಲ್ಲ. Chrome ಅಥವಾ Edge browser ಬಳಸಿ.
        </p>
      </motion.div>
    )
  }

  const stateDisplay = getStateDisplay()

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAssistant}
            className="fixed bottom-20 right-6 z-50 w-16 h-16 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-purple-500/50 transition-all duration-300"
            aria-label="Open Hey Agri Voice Assistant"
          >
            <Mic className="w-7 h-7" />
            <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20" />
            
            {/* "Hey Agri" Label */}
            <motion.span
              className="absolute -top-10 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              🎙️ Hey Agri
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Voice Assistant Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${
              isMinimized
                ? 'bottom-6 right-6 w-80 h-16'
                : 'bottom-6 right-6 w-[95vw] sm:w-[480px] h-[85vh] sm:h-[680px] max-h-[85vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                  animate={state === STATES.LISTENING ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: state === STATES.LISTENING ? Infinity : 0, duration: 1 }}
                >
                  <Mic className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Hey Agri 🎙️</h3>
                  {!isMinimized && (
                    <p className="text-xs text-purple-100">{stateDisplay.text}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleMinimize}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleAssistant}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <div className="flex flex-col h-[calc(100%-64px)]">
                {/* Main Display Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
                  <AnimatePresence mode="wait">
                    {/* State-based display */}
                    {state === STATES.WAKE_WORD_LISTENING && (
                      <motion.div
                        key="wake-word"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-6"
                      >
                        <motion.div
                          className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-xl"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Mic className="w-16 h-16 text-white" />
                        </motion.div>
                        
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Say "Hey Agri"
                          </h2>
                          <p className="text-gray-600">
                            "Hey Agri" ಅನ್ನು ಹೇಳಿ ನನ್ನನ್ನು activate ಮಾಡಿ
                          </p>
                        </div>

                        <button
                          onClick={manualActivate}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                          🎤 ಈಗಲೇ ಮಾತನಾಡಿ
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowTextInput(true)
                            setState(STATES.IDLE)
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                          ⌨️ Type ನಲ್ಲಿ ಬರೆಯಿರಿ
                        </button>
                      </motion.div>
                    )}

                    {/* Text Input Mode */}
                    {showTextInput && state !== STATES.ERROR && (
                      <motion.div
                        key="text-input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Type Your Question
                          </h3>
                          <p className="text-gray-600 text-sm">
                            ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ type ಮಾಡಿ
                          </p>
                        </div>
                        
                        <form onSubmit={handleTextSubmit} className="space-y-3">
                          <textarea
                            value={textQuery}
                            onChange={(e) => setTextQuery(e.target.value)}
                            placeholder="Example: How to login? / ನಾನು ಹೇಗೆ register ಮಾಡಬೇಕು?"
                            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                            rows="4"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={!textQuery.trim()}
                              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              ✅ Send Question
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowTextInput(false)}
                              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                            >
                              ✖️
                            </button>
                          </div>
                        </form>
                        
                        <div className="text-xs text-gray-500 text-center">
                          💡 You can ask in English or Kannada
                        </div>
                      </motion.div>
                    )}

                    {/* User Transcript */}
                    {transcript && state !== STATES.WAKE_WORD_LISTENING && (
                      <motion.div
                        key="transcript"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-4"
                      >
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-tr-none p-4 ml-auto max-w-[85%] shadow-lg">
                          <p className="text-sm">{transcript}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Assistant Response */}
                    {response && (
                      <motion.div
                        key="response"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-4"
                      >
                        <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-lg border border-gray-100 max-w-[90%]">
                          <div className="flex items-start gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-1" />
                            <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{response}</p>
                          </div>
                        </div>
                        
                        {/* Suggestions */}
                        {suggestions && suggestions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition border border-purple-200"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Processing State */}
                    {state === STATES.PROCESSING && (
                      <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-3 p-4"
                      >
                        <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                        <p className="text-gray-600">Processing...</p>
                      </motion.div>
                    )}

                    {/* Error State */}
                    {state === STATES.ERROR && error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <p className="text-sm text-red-700 mb-3 whitespace-pre-line">{error}</p>
                          
                          {!permissionGranted && (
                            <div className="space-y-2">
                              <button
                                onClick={async () => {
                                  try {
                                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                                    stream.getTracks().forEach(track => track.stop())
                                    setPermissionGranted(true)
                                    setError('')
                                    setState(STATES.IDLE)
                                  } catch (err) {
                                    setError('Permission denied. Browser settings ನಲ್ಲಿ manually allow ಮಾಡಿ.')
                                  }
                                }}
                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                              >
                                🎤 Allow Microphone
                              </button>
                              
                              <div className="text-xs text-gray-600 bg-white p-3 rounded border border-gray-200">
                                <p className="font-semibold mb-1">ಹೇಗೆ permission ಕೊಡೋದು:</p>
                                <ol className="list-decimal ml-4 space-y-1">
                                  <li>Browser address bar ನಲ್ಲಿ 🔒 lock icon ಒತ್ತಿ</li>
                                  <li>"Microphone" ಆಯ್ಕೆ ಹುಡುಕಿ</li>
                                  <li>"Allow" ಆಯ್ಕೆ ಮಾಡಿ</li>
                                  <li>Page refresh ಮಾಡಿ</li>
                                </ol>
                              </div>
                            </div>
                          )}
                          
                          {/* Text input fallback - ALWAYS show in error state */}
                          <div className="mt-3 space-y-2">
                            <button
                              onClick={() => {
                                setShowTextInput(!showTextInput)
                                setState(STATES.IDLE) // Clear error state
                                setError('')
                              }}
                              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-lg"
                            >
                              ⌨️ Type Your Question Instead
                            </button>
                            
                            {showTextInput && (
                              <form onSubmit={handleTextSubmit} className="space-y-2">
                                <input
                                  type="text"
                                  value={textQuery}
                                  onChange={(e) => setTextQuery(e.target.value)}
                                  placeholder="ಇಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ... (Type your question here)"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  autoFocus
                                />
                                <button
                                  type="submit"
                                  disabled={!textQuery.trim()}
                                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                  ✅ Send Question
                                </button>
                              </form>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Status Bar */}
                <div className="bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 px-6 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{stateDisplay.icon}</span>
                      <span className={`text-sm font-medium ${stateDisplay.color}`}>
                        {stateDisplay.text}
                      </span>
                    </div>
                    
                    {(state === STATES.IDLE || state === STATES.WAKE_WORD_LISTENING) && (
                      <button
                        onClick={manualActivate}
                        className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        🎤 Ask Now
                      </button>
                    )}
                    
                    {state === STATES.SPEAKING && (
                      <button
                        onClick={stopSpeaking}
                        className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        ⏸️ Stop
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
