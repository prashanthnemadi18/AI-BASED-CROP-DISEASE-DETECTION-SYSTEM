# 🚀 How to Start the Backend Server

## Problem
Voice assistant showing: **"Network error. Internet connection ಪರಿಶೀಲಿಸಿ"**

## Root Cause
The backend server is **not running**. The frontend (localhost:3000) cannot connect to the backend API (localhost:5000).

---

## ✅ Solution: Start Backend Server

### Option 1: Using Command Prompt (Recommended)
```cmd
cd "d:\Prashanth_N_projects\Final year project\AI-BASED CROP DISEASE DETECTION SYSTEM\backend"
python app.py
```

### Option 2: Using PowerShell
```powershell
cd "d:\Prashanth_N_projects\Final year project\AI-BASED CROP DISEASE DETECTION SYSTEM\backend"
python app.py
```

---

## 📋 Step-by-Step Instructions

### Step 1: Open New Terminal
1. Press `Ctrl + Shift + ` ` (backtick) in VS Code
2. Or use Windows Terminal / Command Prompt

### Step 2: Navigate to Backend Folder
```cmd
cd "d:\Prashanth_N_projects\Final year project\AI-BASED CROP DISEASE DETECTION SYSTEM\backend"
```

### Step 3: Start the Server
```cmd
python app.py
```

### Step 4: Verify Server is Running
You should see output like:
```
 * Serving Flask app 'app'
 * Debug mode: off
WARNING: This is a development server.
 * Running on http://0.0.0.0:5000
Press CTRL+C to quit
```

---

## ✅ After Starting Backend

1. **Keep the terminal window open** (don't close it!)
2. Go back to your browser at `http://localhost:3000`
3. Try the voice assistant again - it should work now! ✨

---

## 🔍 Troubleshooting

### Error: "Address already in use"
Port 5000 is occupied. Kill the process:
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Error: "No module named 'flask'"
Install dependencies:
```cmd
pip install -r requirements.txt
```

### Error: "MongoDB connection failed"
Start MongoDB service:
```cmd
net start MongoDB
```
Or use MongoDB Atlas (cloud) connection string in `.env` file.

---

## 📱 For Production Deployment

For Render deployment, the server starts automatically using:
- `Procfile`: Defines the start command
- `render.yaml`: Deployment configuration

Local testing is just for development!

---

## 💡 Quick Test

After starting backend, test the API:
```
Open browser: http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "ok",
  "model_loaded": true,
  "classes": 15,
  "database": "connected"
}
```

---

## ⚠️ Important Notes

1. **Keep backend running** while using the application
2. Backend terminal must stay open
3. Frontend runs on port 3000, Backend on port 5000
4. Both must be running simultaneously

---

## 🎯 Summary

**Voice assistant works when:**
✅ Backend server is running on port 5000
✅ Frontend can reach http://localhost:5000
✅ MongoDB is running/connected

**Voice assistant fails when:**
❌ Backend server is not started
❌ Port 5000 is blocked/occupied
❌ MongoDB is not connected
