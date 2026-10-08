# 🚀 Quick Start - Deploy in 30 Minutes

Follow these steps to deploy your project to the internet **for FREE!**

---

## Step 1: MongoDB Atlas (5 minutes) ☁️

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster (choose FREE M0)
4. Create database user with password
5. Allow network access: 0.0.0.0/0
6. Get connection string (replace `<password>` with your password)
7. **SAVE THIS:** `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/...`

---

## Step 2: Deploy Backend to Render (10 minutes) 🔧

1. Go to https://dashboard.render.com
2. Sign up/login with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository: `AI-BASED-CROP-DISEASE-DETECTION-SYSTEM`
5. Configure:
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `gunicorn --chdir backend --bind 0.0.0.0:$PORT app:app --timeout 120 --workers 2`
   - **Instance Type:** Free
6. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `MONGO_DB`: `agroguard_db`
   - `PLANT_CONFIDENCE_THRESHOLD`: `0.50`
   - `DISEASE_CONFIDENCE_THRESHOLD`: `0.50`
7. Click "Create Web Service"
8. Wait 5-10 minutes
9. **SAVE YOUR URL:** `https://your-backend.onrender.com`

**Test it:** Visit `https://your-backend.onrender.com/api/health`

---

## Step 3: Deploy Frontend to Vercel (5 minutes) 🌐

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New..." → "Project"
4. Import repository: `AI-BASED-CROP-DISEASE-DETECTION-SYSTEM`
5. Configure:
   - **Root Directory:** Click "Edit" → Select `frontend-react`
   - **Framework:** Vite (auto-detected)
6. Add environment variable:
   - **Key:** `VITE_API_URL`
   - **Value:** Your Render URL (from Step 2)
7. Click "Deploy"
8. Wait 2-3 minutes
9. **SAVE YOUR URL:** `https://your-project.vercel.app`

**Test it:** Visit your Vercel URL and try uploading an image!

---

## Step 4: Test Everything (5 minutes) ✅

Visit your Vercel URL and:
- ✅ Register account
- ✅ Login
- ✅ Upload plant image
- ✅ Check disease detection works
- ✅ Test chatbot
- ✅ Test voice assistant

---

## 🎉 Done! Your app is live on the internet!

**Share your URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.onrender.com`

---

## Need detailed instructions?

See **DEPLOYMENT_GUIDE.md** for complete step-by-step guide with screenshots and troubleshooting.

See **DEPLOYMENT_CHECKLIST.md** for a detailed checklist of every step.

---

## Costs

**Everything is FREE!** ✅

- Render: Free tier (with sleep after 15 min)
- Vercel: Free tier (always-on)
- MongoDB: Free tier (512MB)

**Total: $0/month** 🎉
