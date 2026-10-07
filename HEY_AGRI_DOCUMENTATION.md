# 🎙️ Hey Agri - Kannada Voice Assistant

## Complete Documentation

**Version:** 1.0.0  
**Date:** December 2024  
**Integration:** AI-Based Crop Disease Detection System

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [How It Works](#how-it-works)
6. [User Guide](#user-guide)
7. [Technical Implementation](#technical-implementation)
8. [Browser Compatibility](#browser-compatibility)
9. [Troubleshooting](#troubleshooting)
10. [Future Enhancements](#future-enhancements)

---

## 🌟 Overview

**Hey Agri** is a Kannada-language voice assistant integrated into the AI-Based Crop Disease Detection System. It helps farmers who:

- Have difficulty reading
- Don't understand technical English terms
- Need help navigating the application
- Want natural voice interaction in Kannada

### Key Capabilities

✅ Wake word activation: "Hey Agri"  
✅ Kannada speech recognition  
✅ Context-aware responses  
✅ Application guidance (Login → Logout)  
✅ Disease information in Kannada  
✅ Kannada text-to-speech responses  
✅ Mixed Kannada-English support  

---

## ✨ Features

### 1. **Voice Interaction**
- Wake word detection ("Hey Agri")
- Continuous listening for user queries
- Natural Kannada speech recognition
- Text-to-speech Kannada responses

### 2. **Application Knowledge**
The assistant understands and helps with:

#### Account Management
- How to login
- How to register
- Password recovery
- Profile management
- Logout

#### Disease Detection
- How to upload images
- How to use camera
- What crops are supported (Tomato, Potato, Pepper)
- Understanding results
- Confidence scores
- Disease information

#### Navigation
- Dashboard overview
- Prediction history
- Treatment recommendations
- Profile settings

#### Disease Information
Provides Kannada explanations for:
- Tomato Early Blight
- Tomato Late Blight
- Potato Early Blight
- Bacterial Spot
- And more...

### 3. **Context Awareness**

The assistant is aware of:
- Current page/route
- Last prediction result
- Login status

**Example:**
```
User on Prediction Result Page: "ಇದು ಏನು?" (What is this?)
Assistant: "ನಿಮ್ಮ ಚಿತ್ರದಲ್ಲಿ AI ಗುರುತಿಸಿರುವ ರೋಗ: Tomato_Early_blight. 
           Confidence: 92%..."
```

### 4. **Fallback Integration**
When the voice assistant can't answer, it falls back to the existing English chatbot with a Kannada wrapper.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │   HeyAgriVoiceAssistant Component                  │    │
│  │   • Web Speech API (Speech Recognition)            │    │
│  │   • Wake Word Detection (Local)                    │    │
│  │   • Speech Synthesis (TTS)                         │    │
│  │   • State Management                               │    │
│  │   • Context Collection                             │    │
│  └────────────────────────────────────────────────────┘    │
│                           ↓                                  │
│                      HTTP Request                            │
│                    /api/voice/process                        │
│                           ↓                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Backend (Flask)                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │   voice_assistant.py                               │    │
│  │   • KannadaVoiceAssistant Class                    │    │
│  │   • Kannada Knowledge Base (KANNADA_RESPONSES)     │    │
│  │   • Query Processing Logic                         │    │
│  │   • Context-Aware Response Generation              │    │
│  └────────────────────────────────────────────────────┘    │
│                           ↓                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │   chatbot.py (Fallback)                            │    │
│  │   • FarmingChatbot                                 │    │
│  │   • English Knowledge Base                         │    │
│  └────────────────────────────────────────────────────┘    │
│                           ↓                                  │
│                   Kannada Response JSON                      │
└─────────────────────────────────────────────────────────────┘

                           ↓

┌─────────────────────────────────────────────────────────────┐
│                   Frontend Rendering                         │
│   • Display Kannada text response                           │
│   • Text-to-Speech in Kannada (kn-IN)                      │
│   • Show suggestions                                        │
│   • Update UI state                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- MongoDB
- Modern browser (Chrome/Edge recommended)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Verify new files exist:**
- `voice_assistant.py` ✓
- Updated `app.py` with voice endpoints ✓

4. **Start the backend:**
```bash
python app.py
```

Backend should start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend-react
```

2. **Install dependencies (if not already done):**
```bash
npm install
```

3. **Verify new files exist:**
- `src/components/HeyAgriVoiceAssistant.jsx` ✓
- Updated `src/App.jsx` ✓

4. **Start the development server:**
```bash
npm run dev
```

Frontend should start on `http://localhost:5173`

---

## 🎯 How It Works

### Step-by-Step Flow

#### 1. **Opening the Assistant**
- User clicks the purple floating microphone button (bottom-right)
- Assistant window opens
- State: `WAKE_WORD_LISTENING`

#### 2. **Wake Word Detection**
- Browser's Speech Recognition starts (Kannada: `kn-IN`)
- Listens continuously for "Hey Agri"
- Local wake word detection (no API call)

#### 3. **Activation**
```
User says: "Hey Agri"
         ↓
Wake word detected!
         ↓
State: ACTIVATED
         ↓
GET /api/voice/wake-word-response
         ↓
Response: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?"
         ↓
Speak response (TTS)
         ↓
State: LISTENING
```

#### 4. **Query Processing**
```
User asks: "ನಾನು ಹೇಗೆ login ಮಾಡಬೇಕು?"
         ↓
Speech Recognition → Text
         ↓
Collect Context:
  - currentPage: "/dashboard"
  - isLoggedIn: false
  - prediction: null
         ↓
POST /api/voice/process
  {
    "text": "ನಾನು ಹೇಗೆ login ಮಾಡಬೇಕು?",
    "context": {...}
  }
         ↓
Backend Processing (voice_assistant.py)
  - Parse query
  - Match keywords
  - Check context
  - Generate Kannada response
         ↓
Response:
  {
    "success": true,
    "response": "Login ಪುಟಕ್ಕೆ ಹೋಗಿ. ನಿಮ್ಮ registered email ಮತ್ತು password ನಮೂದಿಸಿ...",
    "language": "kn",
    "suggestions": ["Account ಹೇಗೆ create?", ...]
  }
         ↓
State: SPEAKING
         ↓
Text-to-Speech (Kannada)
         ↓
State: IDLE → Back to WAKE_WORD_LISTENING
```

### 5. **Context-Aware Example**

**Scenario:** User is on prediction result page with disease: "Tomato_Early_blight", confidence: 92%

```
User: "ಇದು ಏನು?" (What is this?)
       ↓
Context includes:
  prediction: {
    disease: "Tomato_Early_blight",
    confidence: 92,
    crop: "Tomato"
  }
       ↓
Assistant understands "ಇದು" refers to current prediction
       ↓
Response: "ನಿಮ್ಮ ಚಿತ್ರದಲ್ಲಿ AI ಗುರುತಿಸಿರುವ ರೋಗ: Tomato_Early_blight. 
          Confidence: 92%. ಈ result ಆಧಾರದ ಮೇಲೆ ಸಾಮಾನ್ಯ ಮಾಹಿತಿ ಮಾತ್ರ..."
```

---

## 👨‍🌾 User Guide

### For Farmers

#### **How to Use:**

1. **Open the Assistant**
   - Look for the **purple microphone button** at the bottom-right corner
   - Click it

2. **Say the Wake Word**
   - Say: **"Hey Agri"** (English) or **"ಹೇ ಆಗ್ರಿ"** (Kannada)
   - Wait for the welcome message

3. **Ask Your Question**
   - Speak naturally in Kannada
   - Examples:
     - "ನಾನು ಹೇಗೆ login ಮಾಡಬೇಕು?"
     - "Photo upload ಹೇಗೆ ಮಾಡೋದು?"
     - "ಈ disease ಏನು?"

4. **Listen to Response**
   - The assistant will speak in Kannada
   - You'll also see the text on screen

5. **Continue Conversation**
   - Say "Hey Agri" again to ask another question
   - Or click one of the suggestion buttons

#### **Common Questions You Can Ask:**

**Login & Registration:**
- "ನಾನು ಹೇಗೆ login ಮಾಡಬೇಕು?"
- "Account ಹೇಗೆ create ಮಾಡೋದು?"
- "Password forgot ಮಾಡಿದ್ದೇನೆ"

**Image Upload:**
- "Photo upload ಹೇಗೆ ಮಾಡೋದು?"
- "Camera ಇಂದ photo ತೆಗೆಯಬಹುದಾ?"
- "ಯಾವ plants support ಇದೆ?"

**Disease Detection:**
- "ಯಾವ diseases detect ಮಾಡಬಹುದು?"
- "ಇದು ಏನು?" (when on result page)
- "Confidence ಅಂದರೇನು?"

**Navigation:**
- "Dashboard ಎಲ್ಲಿದೆ?"
- "History ಹೇಗೆ ನೋಡೋದು?"
- "Profile update ಹೇಗೆ ಮಾಡೋದು?"

**App Information:**
- "ಈ app ಏನು ಮಾಡುತ್ತದೆ?"
- "ಇದು free ಇದೆಯಾ?"
- "System ಎಷ್ಟು accurate?"

---

## 🔧 Technical Implementation

### Frontend Component: `HeyAgriVoiceAssistant.jsx`

#### Key Technologies:
- **Web Speech API**
  - `SpeechRecognition` for speech-to-text
  - `SpeechSynthesis` for text-to-speech
- **Language:** `kn-IN` (Kannada - India)
- **React Hooks:** `useState`, `useEffect`, `useRef`
- **Framer Motion:** Smooth animations
- **Axios:** HTTP requests

#### States:
```javascript
const STATES = {
  IDLE: 'idle',
  WAKE_WORD_LISTENING: 'wake_word_listening',
  ACTIVATED: 'activated',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  SPEAKING: 'speaking',
  ERROR: 'error'
}
```

#### Wake Word Detection:
```javascript
// Runs locally in the browser
recognition.onresult = (event) => {
  const text = event.results[0][0].transcript.toLowerCase()
  
  if (text.includes('hey') || text.includes('agri')) {
    // Wake word detected!
    activateAssistant()
  }
}
```

#### Context Collection:
```javascript
const getApplicationContext = () => {
  return {
    currentPage: location.pathname,
    isLoggedIn: !!localStorage.getItem('token'),
    prediction: JSON.parse(localStorage.getItem('lastPrediction'))
  }
}
```

### Backend Module: `voice_assistant.py`

#### Key Classes:

**1. `KannadaVoiceAssistant`**
```python
class KannadaVoiceAssistant:
    def __init__(self):
        self.chatbot = FarmingChatbot()  # Fallback
        self.wake_word = "hey agri"
    
    def process_voice_query(self, query: str, context: Optional[Dict] = None) -> Dict:
        # Main processing logic
        # Returns Kannada response
```

**2. Knowledge Base: `KANNADA_RESPONSES`**
```python
KANNADA_RESPONSES = {
    "greeting": {...},
    "login": {...},
    "register": {...},
    "upload": {...},
    "detection": {...},
    "diseases": {...},
    ...
}
```

#### Processing Flow:
```python
def process_voice_query(query, context):
    # 1. Check greetings
    if is_greeting(query):
        return greeting_response()
    
    # 2. Check login/register
    if "login" in query:
        return login_help()
    
    # 3. Check image upload
    if "upload" or "photo" in query:
        return upload_help()
    
    # 4. Check context-aware queries
    if context and "ಇದು" in query:
        # User asking about current result
        return result_help(context['prediction'])
    
    # 5. Fallback to chatbot
    return fallback_response(query)
```

### API Endpoints

#### 1. **POST /api/voice/process**
Process voice input and return Kannada response.

**Request:**
```json
{
  "text": "ನಾನು ಹೇಗೆ login ಮಾಡಬೇಕು?",
  "context": {
    "currentPage": "/dashboard",
    "isLoggedIn": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "text": "ನಾನು ಹೇಗೆ login ಮಾಡಬೇಕು?",
  "response": "Login ಪುಟಕ್ಕೆ ಹೋಗಿ. ನಿಮ್ಮ registered email ಮತ್ತು password ನಮೂದಿಸಿ...",
  "language": "kn",
  "suggestions": ["Account ಹೇಗೆ create?", "Dashboard ಎಲ್ಲಿದೆ?"],
  "type": "help",
  "timestamp": "2024-12-07T10:30:00.000Z"
}
```

#### 2. **GET /api/voice/wake-word-response**
Get the wake word welcome message.

**Response:**
```json
{
  "success": true,
  "response": "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?",
  "language": "kn"
}
```

---

## 🌐 Browser Compatibility

### ✅ Fully Supported:
- **Google Chrome** (Desktop & Mobile)
- **Microsoft Edge** (Desktop & Mobile)
- **Samsung Internet** (Mobile)

### ⚠️ Partially Supported:
- **Safari** (Limited voice support, may require user interaction)
- **Firefox** (No Web Speech API support in some versions)

### Browser Requirements:
- **Speech Recognition:** `window.SpeechRecognition` or `window.webkitSpeechRecognition`
- **Speech Synthesis:** `window.speechSynthesis`
- **Microphone Permission:** Required

### Language Support:
- The browser must support Kannada (`kn-IN`) for speech recognition
- Most modern browsers with Google's speech services support it

---

## 🐛 Troubleshooting

### Issue 1: "Voice features not supported"

**Solution:**
- Use Google Chrome or Microsoft Edge
- Update browser to latest version
- Check if microphone is available

### Issue 2: "Microphone permission denied"

**Solution:**
1. Click the lock icon in browser address bar
2. Find "Microphone" permission
3. Change to "Allow"
4. Refresh the page

### Issue 3: Wake word not detected

**Solution:**
- Speak clearly: "Hey Agri"
- Check if microphone is working
- Grant microphone permission
- Try clicking "Ask Now" button to bypass wake word

### Issue 4: No speech output

**Solution:**
- Check if browser tab is muted
- Check system volume
- Click the speaker icon to unmute
- Try a different browser

### Issue 5: Network error

**Solution:**
- Ensure backend is running on port 5000
- Check if frontend is connecting to correct API URL
- Verify MongoDB is running
- Check browser console for errors

### Issue 6: Kannada text not displaying correctly

**Solution:**
- Ensure system has Kannada fonts installed
- Most modern OSes (Windows 10+, macOS, Android, iOS) support Kannada by default
- Use Chrome/Edge for best font rendering

---

## 🔮 Future Enhancements

### Planned Features:

1. **Offline Wake Word Detection**
   - Use lightweight ML model (e.g., Porcupine)
   - Better battery efficiency
   - No continuous API calls

2. **Multi-Language Support**
   - Hindi
   - Telugu
   - Tamil
   - Marathi

3. **Voice Commands**
   - "Open detection page"
   - "Show my history"
   - "Take a photo"

4. **Improved TTS**
   - Higher quality Kannada voice
   - Emotion in responses
   - Adjustable speed

5. **Conversation Memory**
   - Remember previous questions in session
   - More natural follow-up questions

6. **Smart Suggestions**
   - AI-powered contextual suggestions
   - Based on user behavior

7. **Voice Shortcuts**
   - "Quick scan" - Direct to camera
   - "Last result" - Show previous prediction
   - "Help me" - Show tutorial

---

## 📊 Testing Checklist

### Manual Testing:

- [ ] Open voice assistant
- [ ] Say "Hey Agri" - verify activation
- [ ] Ask login question in Kannada
- [ ] Ask upload question
- [ ] Navigate to detection page, upload image
- [ ] Ask "ಇದು ಏನು?" on result page
- [ ] Verify context-aware response
- [ ] Check suggestions work
- [ ] Test mute/unmute
- [ ] Test minimize/maximize
- [ ] Test close and reopen
- [ ] Verify TTS in Kannada
- [ ] Test on mobile device
- [ ] Test microphone permission flow
- [ ] Test error handling (network failure)

---

## 🤝 Integration with Existing Features

### No Breaking Changes:
✅ Existing text chatbot still works  
✅ All disease detection features intact  
✅ Authentication unchanged  
✅ Database operations unchanged  

### New Additions:
✅ Voice assistant component  
✅ Voice processing backend  
✅ Context saving in localStorage  
✅ Two new API endpoints  

---

## 📝 Developer Notes

### File Structure:
```
backend/
├── voice_assistant.py          # NEW: Kannada voice processing
├── app.py                       # MODIFIED: Added voice endpoints
├── chatbot.py                   # UNCHANGED: Used as fallback
└── requirements.txt             # UNCHANGED: No new dependencies

frontend-react/
├── src/
│   ├── components/
│   │   ├── HeyAgriVoiceAssistant.jsx  # NEW: Voice assistant UI
│   │   └── FloatingChatbot.jsx        # UNCHANGED
│   ├── pages/
│   │   └── dashboard/
│   │       └── DetectPage.jsx          # MODIFIED: Save prediction context
│   └── App.jsx                         # MODIFIED: Added voice assistant
```

### Key Design Decisions:

1. **Why Browser Speech APIs?**
   - No additional server costs
   - Real-time processing
   - Works offline (wake word detection)
   - Good Kannada support

2. **Why Local Wake Word Detection?**
   - No continuous API calls
   - Privacy-friendly
   - Low latency
   - Battery efficient

3. **Why Context in localStorage?**
   - Persists across page navigation
   - Simple implementation
   - No server-side session needed
   - Fast access

4. **Why Reuse Existing Chatbot?**
   - Avoid duplication
   - Consistent knowledge base
   - Easier maintenance

---

## 🎓 Summary

**Hey Agri** successfully integrates a production-quality Kannada voice assistant into the existing crop disease detection system without breaking any features.

### What Works:
✅ Wake word activation  
✅ Kannada speech recognition  
✅ Context-aware responses  
✅ Complete application guidance  
✅ Disease information  
✅ Text-to-speech in Kannada  
✅ Fallback to English chatbot  
✅ Mobile-friendly UI  

### What's Next:
Farmers can now interact with the application naturally using voice in Kannada, making the system more accessible and user-friendly.

---

**Built with ❤️ for Indian Farmers** 🌾
