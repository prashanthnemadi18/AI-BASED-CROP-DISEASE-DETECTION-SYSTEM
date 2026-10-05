# Deployment Checklist - Two-Stage Validation

## ✅ Pre-Deployment Steps

### 1. Train Plant Validator Model

```bash
cd backend
python train_plant_validator.py
```

**Expected files created:**
- ✅ `model/plant_validator.h5` (~5-10 MB)
- ✅ `model/plant_classes.json`
- ✅ `plant_dataset/train/` (folders for Pepper_bell, Potato, Tomato)
- ✅ `plant_dataset/test/` (folders for Pepper_bell, Potato, Tomato)
- ✅ `model/plant_validator_curves.png`

**Verify accuracy:** Should be >95%

### 2. Test the Implementation

```bash
python test_two_stage_validation.py
```

**Expected result:** All tests pass ✅

### 3. Update Environment Configuration

Copy `.env.example` to `.env` if not done:
```bash
cp .env.example .env
```

**Configure thresholds in `.env`:**
```bash
PLANT_CONFIDENCE_THRESHOLD=0.70
DISEASE_CONFIDENCE_THRESHOLD=0.70
```

### 4. Verify Model Files Exist

```bash
# Check disease model (should already exist)
ls -lh model/crop_disease_model.h5
ls -lh model/class_names.json

# Check plant validator (newly created)
ls -lh model/plant_validator.h5
ls -lh model/plant_classes.json
```

**All 4 files must exist!**

### 5. Test Backend Health

Start the backend:
```bash
python app.py
```

Check health endpoint:
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
  "database": "connected",
  "plant_confidence_threshold": 0.7,
  "disease_confidence_threshold": 0.7
}
```

**Critical checks:**
- ✅ `model_loaded: true`
- ✅ `plant_validator_loaded: true`
- ✅ `classes: 15`
- ✅ `plant_classes: 3`

### 6. Test API with Sample Images

#### Test 1: Supported plant (should classify)

```bash
# Use an image from your test dataset
curl -X POST \
  -F "image=@../dataset/test/Tomato_Early_blight/image001.jpg" \
  -F "city=New Delhi" \
  http://localhost:5000/api/predict
```

**Expected:**
```json
{
  "success": true,
  "status": "classified",
  "plant": "Tomato",
  "disease": "Tomato_Early_blight",
  "confidence": 90.5,
  ...
}
```

#### Test 2: Test with Frontend

1. Start frontend dev server
2. Navigate to Detect page
3. Upload a tomato leaf image
4. Should see disease classification ✅
5. Upload a random object image
6. Should see error message ❌

## 📦 Files to Deploy

### Required Model Files (Total ~55-60 MB)

```
backend/model/
├── crop_disease_model.h5       (~50 MB) - Disease classifier
├── class_names.json            (1 KB)   - Disease classes
├── plant_validator.h5          (~5-10 MB) - Plant validator
└── plant_classes.json          (1 KB)   - Plant classes
```

### Required Code Files

```
backend/
├── app.py                      (modified)
├── config.py                   (NEW)
├── plant_validator.py          (NEW)
├── database.py                 (unchanged)
├── requirements.txt            (unchanged)
└── .env                        (configure)
```

### Optional Files (Not Required for Production)

```
backend/
├── train_model.py              (training script - not needed in prod)
├── train_plant_validator.py    (training script - not needed in prod)
├── test_two_stage_validation.py (testing script - optional)
├── evaluate_model.py           (evaluation script - optional)
└── plant_dataset/              (training data - not needed in prod)
```

## 🚀 Deployment Steps

### Option 1: Local/Development Deployment

1. ✅ Train plant validator
2. ✅ Test implementation
3. ✅ Start backend: `python app.py`
4. ✅ Start frontend: `npm run dev`
5. ✅ Test with real images

### Option 2: Production Deployment

1. **Copy required files to server:**
   ```bash
   # Copy model files
   scp -r backend/model/ user@server:/app/backend/
   
   # Copy backend code
   scp backend/{app.py,config.py,plant_validator.py,database.py,requirements.txt} user@server:/app/backend/
   
   # Copy .env
   scp backend/.env user@server:/app/backend/
   ```

2. **On server, install dependencies:**
   ```bash
   cd /app/backend
   pip install -r requirements.txt
   ```

3. **Verify model files:**
   ```bash
   ls -lh model/
   # Should see all 4 files
   ```

4. **Start with gunicorn (production):**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

5. **Test health endpoint:**
   ```bash
   curl http://your-server:5000/api/health
   ```

## ⚠️ Common Issues

### Issue: "Plant validator not loaded"

**Cause:** `plant_validator.h5` not found

**Solution:**
```bash
# On deployment server
cd backend
python train_plant_validator.py

# OR copy from local machine
scp backend/model/plant_validator.h5 user@server:/app/backend/model/
scp backend/model/plant_classes.json user@server:/app/backend/model/
```

### Issue: Too many rejections in production

**Cause:** Thresholds too high

**Solution:** Adjust in `.env`:
```bash
PLANT_CONFIDENCE_THRESHOLD=0.60
DISEASE_CONFIDENCE_THRESHOLD=0.60
```

Restart backend to apply changes.

### Issue: Frontend showing errors

**Cause:** Frontend not updated or API URL wrong

**Check:**
1. Frontend code includes error handling for `success: false`
2. API URL is correct in frontend `.env`
3. CORS is enabled in backend

## 🔍 Monitoring

### Health Checks

Set up periodic health checks:
```bash
# Every 5 minutes
*/5 * * * * curl -f http://localhost:5000/api/health || alert
```

### Key Metrics to Monitor

1. **API Response Time**
   - Target: <500ms per request
   - Includes plant validation + disease classification

2. **Rejection Rate**
   - Track `status: "unsupported"` responses
   - High rate might indicate threshold issues

3. **Error Rate**
   - Track `status: "error"` responses
   - Should be <1%

4. **Confidence Distribution**
   - Track average confidence scores
   - Low averages might indicate model degradation

### Logging

Backend logs key events:
```
INFO: Plant validation: Tomato (94.5%)
INFO: ✓ Plant validation passed: Tomato
INFO: ✓ Disease validation passed: Tomato_Early_blight (91.2%)
```

Monitor logs for patterns:
```bash
# Check for unsupported plant rejections
grep "unsupported" backend.log

# Check for validation failures
grep "validation failed" backend.log
```

## 📊 Success Criteria

After deployment, verify:

1. ✅ Health endpoint shows all models loaded
2. ✅ Supported plants get classified correctly
3. ✅ Unsupported plants get rejected (not misclassified)
4. ✅ API response time <500ms
5. ✅ No error spikes in logs
6. ✅ Frontend displays results and errors correctly

## 🎯 Rollback Plan

If issues occur:

### Option 1: Disable Plant Validation (Emergency)

Edit `plant_validator.py`, change `load_plant_validator()`:
```python
def load_plant_validator():
    # Temporarily disabled
    return False
```

This allows disease classification without plant validation.

### Option 2: Full Rollback

1. Restore old `app.py` from git history
2. Remove plant validator imports
3. Restart backend

## 📞 Support

If you encounter issues:

1. Check `backend/TWO_STAGE_VALIDATION_README.md` for detailed docs
2. Run `python test_two_stage_validation.py` to diagnose
3. Check `backend.log` for error messages
4. Verify all 4 model files exist and are readable

## ✅ Final Checklist

Before going live:

- [ ] Plant validator trained and tested
- [ ] All 4 model files exist
- [ ] Health endpoint returns correct status
- [ ] Tested with supported plant images (classify ✅)
- [ ] Tested with unsupported plant images (reject ❌)
- [ ] Tested with invalid images (reject ❌)
- [ ] Frontend handles all response statuses
- [ ] Thresholds configured appropriately
- [ ] Monitoring and logging set up
- [ ] Rollback plan documented

**Status: Ready for production** ✅
