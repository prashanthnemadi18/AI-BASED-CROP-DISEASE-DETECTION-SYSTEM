import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, RefreshCw, Loader2 } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function ChatbotPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [quickQuestions, setQuickQuestions] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Load quick questions
    loadQuickQuestions()
    
    // Welcome message
    setMessages([{
      role: 'bot',
      content: 'Hello! 👋 I\'m AgroGuard AI Assistant. I can help you with:\n\n🌱 Crop disease information\n💊 Treatment and prevention advice\n🚜 Farming tips (watering, fertilization, pests)\n📸 Using the disease detection system\n\nHow can I help you today?',
      timestamp: new Date().toISOString(),
      suggestions: [
        'What diseases can you detect?',
        'How to treat tomato blight?',
        'When should I water plants?',
        'How to prevent pests?'
      ]
    }])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        role: 'bot',
        content: '❌ Sorry, I encountered an error. Please make sure the backend is running and try again.',
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

  const clearChat = () => {
    setMessages([{
      role: 'bot',
      content: 'Chat cleared! How can I help you?',
      timestamp: new Date().toISOString()
    }])
  }

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">AgroGuard AI Assistant</h2>
            <p className="text-xs sm:text-sm text-green-100">Ask me anything about farming & crop diseases</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 hover:bg-white/10 rounded-lg transition"
          aria-label="Clear chat"
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-green-600" />
                </div>
              )}
              
              <div className={`max-w-[80%] sm:max-w-[70%] ${message.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-2xl p-3 sm:p-4 ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm sm:text-base whitespace-pre-line leading-relaxed">{message.content}</p>
                </div>
                
                {/* Suggestions */}
                {message.role === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs sm:text-sm px-3 py-1.5 bg-white border border-green-200 text-green-700 rounded-full hover:bg-green-50 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5">
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
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-green-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4">
              <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && quickQuestions.length > 0 && (
        <div className="px-4 sm:px-6 py-3 bg-green-50 border-t border-green-100">
          <p className="text-xs sm:text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Quick Questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.slice(0, 4).map((q) => (
              <button
                key={q.id}
                onClick={() => handleQuickQuestion(q.question)}
                className="text-xs sm:text-sm px-3 py-2 bg-white text-green-700 rounded-xl hover:bg-green-100 transition border border-green-200 flex items-center gap-1.5"
              >
                <span>{q.icon}</span>
                <span className="hidden sm:inline">{q.question}</span>
                <span className="sm:hidden">{q.question.split(' ').slice(0, 3).join(' ')}...</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about farming, diseases, or treatment..."
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  )
}
