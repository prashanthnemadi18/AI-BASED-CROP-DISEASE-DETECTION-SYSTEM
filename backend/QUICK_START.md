# Quick Start Guide - Two-Stage Validation

## Step 1: Train the Plant Validator (Required)

```bash
cd backend
python train_plant_validator.py
```

**Expected output:**
```
Creating plant-level dataset from disease dataset...
✅ Plant dataset created successfully!
✅ Found 3 plant classes: ['Pepper_bell', 'Potato', 'Tomato']
🚀 Starting Plant Validator Training...
✅ Test Accuracy: 97.5%
✅ Model saved to model/plant_validator.h5
```

**Time:** ~5-10 minutes

## Step 2: Test the Implementation (Optional but Recommended)

```bash
cd backend
python test_two_stage_validation.py
```

**Expected output:**
```
✅ Disease model loaded
✅ Plant validator loaded
✅ Plant classes: ['Pepper_bell', 'Potato', 'Tomato']

TEST 1: Pepper_bell_Bacterial_spot
Status: classified
✅ Expected: classified, Got: classified

TEST 2: Potato_Early_blight
Status: classified
✅ Expected: classified, Got: classified

Passed: 3/3
🎉 All tests passed!
```

## Step 3: Start the Backend Server

```bash
cd backend
python app.py
```

**Expected output:**
```
Model loaded successfully
15 classes loaded
Plant validator model loaded successfully
Plant validator classes loaded: ['Pepper_bell', 'Potato', 'Tomato']
* Running on http://0.0.0.0:5000
```

## Step 4: Test with API

### Test 1: Supported Plant (Should Classify)

```bash
# Upload a tomato leaf image
curl -X POST -F "image=@path/to/tomato_leaf.jpg" -F "city=New Delhi" http://localhost:5000/api/predict
```

**Expected response:**
```json
{
  "success": true,
  "status": "classified",
  "plant": "Tomato",
  "disease": "Tomato_Early_blight",
  "confidence": 94.5,
  "severity": "Moderate",
  ...
}
```

### Test 2: Unsupported Plant (Should Reject)

```bash
# Upload a mango/banana/other plant leaf
curl -X POST -F "image=@path/to/unsupported_leaf.jpg" http://localhost:5000/api/predict
```

**Expected response:**
```json
{
  "success": false,
  "status": "unsupported",
  "plant": null,
  "disease": null,
  "message": "Could not identify plant with sufficient confidence. Please upload a clear Pepper, Potato, or Tomato leaf image."
}
```

### Test 3: Check Health Status

```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "plant_validator_loaded": true,
  "classes": 15,
  "plant_classes": 3,
  "plant_confidence_threshold": 0.7,
  "disease_confidence_threshold": 0.7
}
```

## Configuration (Optional)

Edit `backend/.env`:

```bash
# Adjust thresholds (0.0 to 1.0)
PLANT_CONFIDENCE_THRESHOLD=0.70
DISEASE_CONFIDENCE_THRESHOLD=0.70
```

## Troubleshooting

### "Plant validator not loaded"

**Solution:** Train the plant validator (Step 1)

### "Too many images rejected"

**Solution:** Lower thresholds in `.env`:
```bash
PLANT_CONFIDENCE_THRESHOLD=0.60
```

### "Plant validator model file not found"

**Solution:** Make sure you ran `train_plant_validator.py` and check that `model/plant_validator.h5` exists

## What's Next?

1. ✅ Plant validator trained
2. ✅ Backend server running
3. ✅ API endpoints working

Now update your frontend to handle the new API response statuses:
- `classified` - Show disease results
- `unsupported` - Show error message
- `uncertain` - Show warning
- `invalid` - Show error

See `TWO_STAGE_VALIDATION_README.md` for detailed frontend integration guide.
