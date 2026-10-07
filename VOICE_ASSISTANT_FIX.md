# Voice Assistant - Network Error Fix 🔧

## Problem
Voice assistant shows "Network error, internet connection ಸಮಸ್ಯೆಗಳು"

## Root Cause
The frontend was unable to connect to the backend API at `http://localhost:5000`

## Solution Steps

### ✅ Step 1: Verify Backend is Running
Your backend **IS running** on port 5000! ✓

To double-check, run:
```cmd
python test_backend.py
```

If not running, start it:
```cmd
cd backend
python app.py
```

### ✅ Step 2: Restart Frontend (IMPORTANT!)

The `.env` file was just created, so **you MUST restart** the Vite dev server:

**In your frontend terminal:**
1. Press **Ctrl+C** to stop
2. Run again:
   ```cmd
   npm run dev
   ```

### ✅ Step 3: Clear Browser Cache

1. Open browser DevTools (Press **F12**)
2. Go to **Application** tab
3. Click **Clear storage** 
4. Click **Clear site data**
5. Refresh page (**Ctrl+Shift+R** for hard refresh)

### ✅ Step 4: Test Voice Assistant

1. Go to `http://localhost:3000/`
2. Click the purple **"Hey Agri"** floating button
3. Allow microphone permission
4. Try saying "Hey Agri" or click "🎤 Ask Now"

## Why This Happened

1. **Environment Variables**: The frontend reads `VITE_API_URL` from `.env` file at **startup time only**
2. **File Created After Start**: The `.env` file was created AFTER the frontend was already running
3. **No Hot Reload for .env**: Vite's HMR doesn't watch `.env` files, so restart is required

## Files Created/Modified

✅ `frontend-react/.env` - Contains `VITE_API_URL=http://localhost:5000`  
✅ `START_SERVERS.md` - Complete startup guide  
✅ `test_backend.py` - Test script to verify backend connection  
✅ `test_voice_api.html` - Browser test for voice APIs  

## Technical Details

### Backend Configuration
- **URL**: `http://localhost:5000`
- **Port**: 5000 (verified as `Listen` state)
- **CORS**: Enabled for all origins (`origins: "*"`)
- **Endpoints**:
  - `GET /api/voice/wake-word-response` - Get welcome message
  - `POST /api/voice/process` - Process voice queries

### Frontend Configuration
- **URL**: `http://localhost:3000`
- **API URL**: Read from `VITE_API_URL` environment variable
- **Fallback**: `http://localhost:5000` if env var not set

## Troubleshooting

### Still Getting Network Error?

1. **Check both servers are running:**
   ```cmd
   # Check port 5000 (backend)
   Get-NetTCPConnection -LocalPort 5000
   
   # Check port 3000 (frontend)
   Get-NetTCPConnection -LocalPort 3000
   ```

2. **Check browser console for actual error:**
   - Press **F12** → **Console** tab
   - Look for red error messages
   - Share the exact error message

3. **Test backend directly:**
   - Open `test_voice_api.html` in browser
   - Click "Test Wake Word API" button
   - If this works, problem is in React component

4. **Firewall/Antivirus:**
   - Temporarily disable Windows Firewall
   - Check if antivirus is blocking localhost connections

5. **Port Already in Use:**
   ```cmd
   # If port 5000 is used by something else
   # Change port in backend/.env:
   PORT=5001
   
   # Also update frontend/.env:
   VITE_API_URL=http://localhost:5001
   ```

## Expected Behavior After Fix

1. **Open voice assistant** → Shows "Say 'Hey Agri'" with spinning microphone
2. **Click microphone permission** → Browser asks for mic access  
3. **Allow microphone** → Status changes to "Ready" or "ಕೇಳುತ್ತಿದ್ದೇನೆ..."
4. **Say "Hey Agri"** or click "🎤 Ask Now" → Gets welcome response in Kannada
5. **Ask question** → Gets answer with Kannada translation

## Quick Test Commands

```cmd
# Test 1: Backend health
curl http://localhost:5000/api/health

# Test 2: Wake word API
curl http://localhost:5000/api/voice/wake-word-response

# Test 3: Process API
curl -X POST http://localhost:5000/api/voice/process ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"what is tomato blight\",\"context\":{}}"
```

---

**Status**: Backend ✅ Running | Frontend ⚠️ Needs Restart  
**Next Step**: **Restart your frontend dev server** (Ctrl+C, then `npm run dev`)

---

Made by: Prashanth N  
Project: AI-Based Crop Disease Detection System
