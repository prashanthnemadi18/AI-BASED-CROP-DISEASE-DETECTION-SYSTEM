# 🌾 AgroGuard AI - Smart Crop Disease Detection System

AI-powered crop disease detection using CNN with intelligent image analysis.

## 📋 Project Overview

Crop diseases are a major challenge in agriculture, causing 20–40% crop loss worldwide every year. AgroGuard AI provides an intelligent solution by combining:

- Deep Learning for plant disease detection
- Computer Vision for leaf image analysis
- Voice Assistant (Hey Agri) with Kannada language support
- Intelligent Chatbot for farming guidance

## 📁 Project Structure

```
AgroGuard-AI/
├── frontend/              # Frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
│
├── backend/               # Backend (Flask API)
│   ├── app.py            # Main Flask application (Production-ready)
│   ├── train_model.py    # CNN training script
│   ├── prepare_dataset.py # Dataset preparation
│   ├── requirements.txt
│   ├── model/            # Trained model (generated)
│   └── uploads/          # Temporary uploads
│
└── dataset/              # Training data (generated)
    ├── train/
    └── test/
```

## 🚀 Quick Start

### Step 1: Prepare Dataset

```bash
cd AgroGuard-AI/backend
python prepare_dataset.py
```

This will organize images from the `archive/PlantVillage` folder into train/test splits.

### Step 2: Train the Model

```bash
python train_model.py
```

Training takes 15-30 minutes. Model will be saved to `backend/model/`.

### Step 3: Start Backend Server

```bash
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000`

### Step 4: Open Frontend

Open `frontend/index.html` in your browser or use a local server:

```bash
cd ../frontend
python -m http.server 8000
```

Visit `http://localhost:8000`

## 🦠 Supported Diseases

- Pepper Bell: Bacterial Spot, Healthy
- Potato: Early Blight, Late Blight, Healthy
- Tomato: Early Blight, Late Blight, Bacterial Spot, Leaf Mold, Septoria Leaf Spot, Target Spot, Mosaic Virus, Yellow Leaf Curl Virus, Spider Mites, Healthy

## 🛠️ Tech Stack

- Frontend: React.js with Vite, TailwindCSS, Framer Motion
- Backend: Flask, TensorFlow/Keras, MongoDB
- Model: CNN (Convolutional Neural Network) - Production-optimized
- Dataset: PlantVillage
- Voice: Web Speech API with Kannada support

## 📝 API Endpoints

- `GET /api/health` - Check server status
- `POST /api/predict` - Analyze crop image

## ⭐ Key Features

- 🌿 AI Crop Disease Detection using CNN
- 📷 Image upload and analysis
- 🎯 Disease prediction with confidence scores
- 💊 Treatment recommendations
- 🎤 Voice Assistant (Hey Agri) with Kannada support
- 💬 Intelligent Chatbot for farming guidance
- 👤 User Authentication and Profile Management
- 📊 Detection History and Analytics
- 🔒 Production-ready error handling
- ⚡ High-traffic support with thread-safe model access

## 🌍 Impact

AgroGuard AI helps:

- Farmers detect diseases early
- Reduce crop losses
- Improve agricultural productivity
- Promote AI-based smart farming solutions

Built with ❤️ for farmers
