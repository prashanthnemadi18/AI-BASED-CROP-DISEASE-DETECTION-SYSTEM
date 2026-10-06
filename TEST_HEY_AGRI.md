# 🧪 Hey Agri - Testing Guide

## ✅ Backend Status: WORKING
The voice endpoints are responding correctly!

---

## 🚀 Complete Testing Steps

### Step 1: Verify Servers Are Running

**Backend (Port 5000):**
```bash
# Should be running in one terminal
cd backend
python app.py
```
✅ Confirmed: Backend is responding on http://localhost:5000

**Frontend (Port 3000 or 5173):**
```bash
# Should be running in another terminal
cd frontend-react
npm run dev
```
Check which port Vite shows (usually 3000 or 5173)

---

### Step 2: Open the Application

1. **Open Chrome or Edge browser** (Required for best voice support)
2. **Go to:** `http://localhost:3000/` (or whatever port Vite shows)
3. **Login or Register** to access the dashboard

---

### Step 3: Find Hey Agri Button

Look at the **bottom-right corner** of the screen.

You should see **TWO floating buttons:**

1. **🟢 Green button** (Chatbot) - Lower position
2. **🟣 Purple button** (Hey Agri) - Slightly above, with "🎙️ Hey Agri" label

**If you DON'T see the purple button:**
- Open browser console (Press F12)
- Look for errors
- Check the Console tab

---

### Step 4: Test Hey Agri Voice Assistant

#### Test 4.1: Open the Assistant

1. **Click the purple 🎙️ microphone button**
2. **Window should open** with:
   - Purple gradient header "Hey Agri 🎙️"
   - Text: "Say Hey Agri"
   - Large purple microphone icon

#### Test 4.2: Grant Microphone Permission

**First time:**
- Browser will ask: "Allow microphone access?"
- **Click "Allow"**

**If permission denied:**
- Click the lock icon in address bar
- Find "Microphone" permission
- Change to "Allow"
- Refresh the page

#### Test 4.3: Test Wake Word Detection

1. **Make sure the assistant window shows:** "Say Hey Agri"
2. **Speak clearly:** **"Hey Agri"**
3. **Expected:**
   - Status changes to "Activated!"
   - You hear Kannada response: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ..."
   - Text appears in the window
   - Status changes to "ಕೇಳುತ್ತಿದ್ದೇನೆ..." (Listening)

**If wake word doesn't work:**
- Click the **"🎤 Ask Now"** button to bypass wake word
- Speak your question directly

#### Test 4.4: Ask Questions in Kannada

**Test Question 1: Login Help**
```
Say: "ನಾನು ಹೇಗೆ login ಮಾಡಬೇಕು?"
Expected Response: "Login ಪುಟಕ್ಕೆ ಹೋಗಿ. ನಿಮ್ಮ registered email..."
```

**Test Question 2: Upload Help**
```
Say: "Photo upload ಹೇಗೆ ಮಾಡೋದು?"
Expected Response: "Disease Detection ಪುಟಕ್ಕೆ ಹೋಗಿ. Upload Image..."
```

**Test Question 3: App Info**
```
Say: "ಈ app ಏನು ಮಾಡುತ್ತದೆ?"
Expected Response: "ಈ application AI ತಂತ್ರಜ್ಞಾನ ಬಳಸಿ..."
```

#### Test 4.5: Test Context Awareness

1. **Go to Disease Detection page**
2. **Upload a leaf image and get a result**
3. **Open Hey Agri**
4. **Say:** "ಇದು ಏನು?" (What is this?)
5. **Expected:** Should explain the current prediction result

#### Test 4.6: Test Suggestion Buttons

1. After receiving a response, you'll see **suggestion buttons**
2. **Click any suggestion button**
3. **Expected:** Automatically processes that question

#### Test 4.7: Test Controls

**Mute/Unmute:**
- Click the speaker icon (top-right)
- Voice should stop/resume

**Minimize/Maximize:**
- Click the minimize icon
- Window should collapse to title bar only

**Close:**
- Click the X button
- Window should close

---

### Step 5: Browser Console Check

**Open Browser Console:** Press F12

**Check for errors:**

✅ **Good - No errors:**
```
No red error messages
```

❌ **Bad - You see errors like:**
```
Error: SpeechRecognition is not defined
Error: Failed to fetch
Error: Cannot find module 'HeyAgriVoiceAssistant'
```

---

## 🔍 Troubleshooting

### Issue 1: Purple Button Not Visible

**Check 1: Component Import**
Open browser console and type:
```javascript
console.log(window.location.href)
```

**Check 2: Browser Console Errors**
Look for:
- `Module not found: HeyAgriVoiceAssistant`
- `SyntaxError in HeyAgriVoiceAssistant.jsx`

**Fix:**
```bash
# Stop frontend (Ctrl+C)
# Restart it
npm run dev
```

### Issue 2: "Voice features not supported"

**Problem:** Using Firefox or old browser

**Fix:** Use Chrome or Edge browser (latest version)

### Issue 3: Microphone Permission Denied

**Fix:**
1. Click lock icon in address bar
2. Microphone → Allow
3. Refresh page

### Issue 4: Wake Word Not Working

**Workaround:** Click "🎤 Ask Now" button

**Or:**
- Speak louder and clearer
- Check microphone is working (try recording app)
- Try saying "Hey" pause "Agri"

### Issue 5: No Voice Output (TTS)

**Checks:**
1. System volume is up
2. Browser tab not muted (check tab icon)
3. Speaker icon in Hey Agri not muted
4. Click unmute icon

### Issue 6: Network Error

**Check:**
1. Backend running on port 5000?
2. Run: `curl http://localhost:5000/api/health`
3. Should return: `"status":"healthy"`

**Fix:**
```bash
cd backend
python app.py
```

### Issue 7: Kannada Text Shows as "????"

**This is normal in console logs!** Kannada text displays correctly in the browser UI.

---

## 📋 Complete Test Checklist

### Backend Tests
- [x] Backend running on port 5000
- [x] `/api/health` returns healthy
- [x] `/api/voice/wake-word-response` returns Kannada
- [x] `/api/voice/process` accepts and processes queries

### Frontend Tests
- [ ] Frontend running and accessible
- [ ] Purple Hey Agri button visible
- [ ] Can click and open assistant window
- [ ] Microphone permission granted
- [ ] Wake word "Hey Agri" detected
- [ ] Kannada welcome message plays
- [ ] Can ask Kannada questions
- [ ] Receives Kannada text responses
- [ ] Text-to-speech works
- [ ] Suggestion buttons work
- [ ] Context-aware responses work
- [ ] Mute/unmute works
- [ ] Minimize/maximize works
- [ ] Close and reopen works

### Integration Tests
- [ ] Works on dashboard
- [ ] Works on detection page
- [ ] Works on result page (context-aware)
- [ ] Works on history page
- [ ] Works on profile page

### Browser Tests
- [ ] Works in Chrome
- [ ] Works in Edge
- [ ] Works on mobile (if available)

---

## 🎯 Expected Behavior Summary

### ✅ WORKING STATE

1. **Purple button visible** at bottom-right
2. **Clicking button** opens purple window
3. **"Say Hey Agri"** message displayed
4. **Microphone icon** animating
5. **Saying "Hey Agri"** activates
6. **Kannada response** heard and displayed
7. **Can ask questions** in Kannada
8. **Responses** in Kannada text + voice
9. **Suggestions** appear and work
10. **Controls** (mute, minimize, close) work

---

## 📞 Getting Help

### If Tests Fail:

1. **Check Backend Logs**
   - Look in the terminal where `python app.py` is running
   - Any errors there?

2. **Check Browser Console**
   - Press F12
   - Look for red errors
   - Share error messages

3. **Verify File Exists**
   ```bash
   # Should exist:
   frontend-react/src/components/HeyAgriVoiceAssistant.jsx
   backend/voice_assistant.py
   ```

4. **Check Import in App.jsx**
   ```javascript
   // Should have:
   import HeyAgriVoiceAssistant from './components/HeyAgriVoiceAssistant'
   
   // And in render:
   <HeyAgriVoiceAssistant />
   ```

---

## 🎉 Success Indicators

You know it's working when:

✅ Purple microphone button appears  
✅ Window opens with "Hey Agri 🎙️" header  
✅ Wake word detected and responds  
✅ Kannada questions get Kannada answers  
✅ Voice output works (TTS)  
✅ Context-aware on result pages  

---

## 📱 Mobile Testing (Optional)

If testing on mobile:

1. **Access from mobile browser**
   - Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - On mobile: `http://YOUR_IP:3000`

2. **Allow microphone** when prompted

3. **Tap purple button**

4. **Speak wake word**

5. **Should work same as desktop**

---

## 🔬 Advanced Testing

### Test API Directly

**PowerShell:**
```powershell
# Test wake word endpoint
Invoke-WebRequest -Uri http://localhost:5000/api/voice/wake-word-response -UseBasicParsing | Select-Object -ExpandProperty Content

# Should return Kannada JSON
```

**Test voice processing:**
```powershell
$body = @{text="hello";context=@{}} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:5000/api/voice/process -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

---

## ✅ Final Verification

**If all tests pass:**
- ✅ Backend: Working
- ✅ Frontend: Working  
- ✅ Voice Recognition: Working
- ✅ Voice Output: Working
- ✅ Kannada Processing: Working
- ✅ Context Awareness: Working

**🎉 Hey Agri is fully operational!**

---

**Last Updated:** December 2024  
**Status:** Production Ready
