import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Minimize2, Maximize2 } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [quickQuestions, setQuickQuestions] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Load quick questions
    loadQuickQuestions()
  }, [])

  useEffect(() => {
    // Initialize welcome message when chatbot opens for the first time
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'bot',
        content: '👋 Hello! I\'m your AgroGuard AI Assistant.\n\nI can help you with:\n\n🔐 **Account Help** - Login, registration & profile\n🌱 **Crop Diseases** - Information about tomato, potato & pepper diseases\n💊 **Treatment & Prevention** - How to treat and prevent diseases\n🚜 **Farming Tips** - Watering, fertilization, pest control\n📸 **System Guide** - How to use the detection system\n🌤️ **Weather Advice** - Location-based farming guidance\n\nHow can I help you today?',
        timestamp: new Date().toISOString(),
        suggestions: [
          'How do I login?',
          'How to create an account?',
          'What diseases can you detect?',
          'How to use disease detection?'
        ]
      }])
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Reset unread count when chatbot is opened
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadQuickQuestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/chatbot/quick-questions`)
      if (response.data.success) {
        setQuickQuestions(response.data.questions)
      }
    } catch (error) {
      console.error('Error loading quick questions:', error)
    }
  }

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || loading) return

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/chatbot/message`, {
        message: messageText
      })

      if (response.data.success) {
        const botMessage = {
          role: 'bot',
          content: response.data.response,
          timestamp: response.data.timestamp,
          suggestions: response.data.suggestions || []
        }
        setMessages(prev => [...prev, botMessage])
        
        // Increment unread count if chatbot is minimized or closed
        if (!isOpen || isMinimized) {
          setUnreadCount(prev => prev + 1)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        role: 'bot',
        content: '❌ Sorry, I encountered an error. Please make sure the backend is running on port 5000 and try again.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickQuestion = (question) => {
    sendMessage(question)
  }

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion)
  }

  const toggleChatbot = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
      setUnreadCount(0)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
    if (isMinimized) {
      setUnreadCount(0)
    }
  }

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
            onClick={toggleChatbot}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-green-500/50 transition-all duration-300"
            aria-label="Open chatbot"
          >
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            
            {/* Unread Badge */}
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
            
            {/* Pulse Animation */}
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
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
                : 'bottom-6 right-6 w-[95vw] sm:w-[450px] h-[85vh] sm:h-[650px] max-h-[85vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">AgroGuard AI Assistant</h3>
                  {!isMinimized && (
                    <p className="text-xs text-green-100">Always here to help 🌱</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMinimize}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={toggleChatbot}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                  aria-label="Close chatbot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-180px)] bg-gray-50">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'bot' && (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                        
                        <div className={`max-w-[85%] ${message.role === 'user' ? 'order-first' : ''}`}>
                          <div
                            className={`rounded-2xl p-3 text-sm ${
                              message.role === 'user'
                                ? 'bg-green-600 text-white rounded-tr-none'
                                : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100'
                            }`}
                          >
                            <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                          </div>
                          
                          {/* Suggestions */}
                          {message.role === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {message.suggestions.slice(0, 3).map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs px-2.5 py-1 bg-white border border-green-200 text-green-700 rounded-full hover:bg-green-50 transition shadow-sm"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>

                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-100">
                        <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length === 1 && quickQuestions.length > 0 && (
                  <div className="px-4 py-2 bg-green-50 border-t border-green-100">
                    <p className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Quick Questions:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickQuestions.slice(0, 4).map((q) => (
                        <button
                          key={q.id}
                          onClick={() => handleQuickQuestion(q.question)}
                          className="text-xs px-2.5 py-1.5 bg-white text-green-700 rounded-lg hover:bg-green-100 transition border border-green-200 flex items-center gap-1"
                        >
                          <span>{q.icon}</span>
                          <span className="truncate max-w-[150px]">{q.question}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
