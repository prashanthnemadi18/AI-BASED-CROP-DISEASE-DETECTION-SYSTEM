# How to Start the Application

## Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- Required packages installed

## Step-by-Step Instructions

### 1️⃣ Start Backend (Flask Server)

Open **Terminal 1** and run:

```cmd
cd backend
python app.py
```

**You should see:**
```
* Running on http://127.0.0.1:5000
* Running on http://localhost:5000
```

**Keep this terminal running!** ✅

---

### 2️⃣ Start Frontend (Vite Development Server)

Open **Terminal 2** (new terminal) and run:

```cmd
cd frontend-react
npm run dev
```

**You should see:**
```
VITE v5.4.21  ready in 5178 ms
➜  Local:   http://localhost:3000/
```

**Keep this terminal running too!** ✅

---

### 3️⃣ Access the Application

Open your browser and go to:
```
http://localhost:3000/
```

---

## Testing Voice Assistant

1. Click the **"Hey Agri"** floating button (purple microphone icon at bottom-right)
2. **Allow microphone permission** when browser asks
3. Say **"Hey Agri"** or click the **"🎤 Ask Now"** button
4. Ask your question in English or Kannada

---

## Troubleshooting

### ❌ "Network error" in voice assistant
**Problem:** Backend is not running  
**Solution:** Make sure Terminal 1 (backend) is running `python app.py`

### ❌ "Microphone permission denied"
**Problem:** Browser blocked microphone  
**Solution:** 
1. Click the 🔒 lock icon in browser address bar
2. Find "Microphone" setting
3. Change to "Allow"
4. Refresh the page

### ❌ "Port 5000 already in use"
**Problem:** Another app is using port 5000  
**Solution:** Stop other apps or change port in `backend/app.py` and `frontend-react/.env`

### ❌ Frontend shows blank page
**Problem:** Dependencies not installed  
**Solution:** Run `npm install` in `frontend-react` folder

---

## Quick Commands Summary

```cmd
# Terminal 1 - Backend
cd "D:\Prashanth_N_projects\Final year project\AI-BASED CROP DISEASE DETECTION SYSTEM\backend"
python app.py

# Terminal 2 - Frontend  
cd "D:\Prashanth_N_projects\Final year project\AI-BASED CROP DISEASE DETECTION SYSTEM\frontend-react"
npm run dev
```

**Both must run at the same time!** 🚀

---

## Features Available

✅ Crop disease detection (upload leaf images)  
✅ Kannada voice assistant (Hey Agri)  
✅ Text chatbot for farming questions  
✅ Weather information  
✅ Treatment recommendations  

---

**Made by:** Prashanth N  
**Project:** AI-Based Crop Disease Detection System  
**Final Year Project**
