"""
AgroGuard AI - Two-Stage Validation Testing Script
Tests the plant validation pipeline with various scenarios
"""

import os
import sys
import json
import numpy as np
import cv2
from pathlib import Path

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import config
import plant_validator
from tensorflow.keras.models import load_model

print("=" * 80)
print("AgroGuard AI - Two-Stage Validation Test Suite")
print("=" * 80)

# Load models
print("\n1. Loading models...")
try:
    disease_model = load_model(config.DISEASE_MODEL_PATH)
    print(f"✅ Disease model loaded: {config.DISEASE_MODEL_PATH}")
except Exception as e:
    print(f"❌ Error loading disease model: {e}")
    sys.exit(1)

try:
    with open(config.CLASS_NAMES_PATH) as f:
        raw = json.load(f)
    disease_classes = [k for k, v in sorted(raw.items(), key=lambda x: x[1])]
    print(f"✅ Disease classes loaded: {len(disease_classes)} classes")
except Exception as e:
    print(f"❌ Error loading disease classes: {e}")
    sys.exit(1)

# Check plant validator
if plant_validator.plant_model is None:
    print("⚠️  Plant validator not loaded. Please train it first:")
    print("   cd backend")
    print("   python train_plant_validator.py")
    sys.exit(1)
else:
    print(f"✅ Plant validator loaded: {config.PLANT_VALIDATOR_PATH}")
    print(f"✅ Plant classes: {plant_validator.plant_classes}")

print("\n" + "=" * 80)
print("Configuration")
print("=" * 80)
print(f"Plant confidence threshold: {config.PLANT_CONFIDENCE_THRESHOLD * 100:.0f}%")
print(f"Disease confidence threshold: {config.DISEASE_CONFIDENCE_THRESHOLD * 100:.0f}%")
print(f"Supported plants: {config.SUPPORTED_PLANTS}")

# Disease prediction function
def predict_disease_from_path(img_path):
    """Predict disease from image path"""
    img = cv2.imread(img_path)
    img = cv2.resize(img, config.IMG_SIZE)
    img = img / 255.0
    img_array = np.reshape(img, (1, *config.IMG_SIZE, 3))
    
    predictions = disease_model.predict(img_array, verbose=0)[0]
    top_idx = int(np.argmax(predictions))
    confidence = float(predictions[top_idx])
    label = disease_classes[top_idx]
    
    return label, confidence

# Test cases
print("\n" + "=" * 80)
print("Running Test Cases")
print("=" * 80)

test_results = []

def test_image(test_name, img_path, expected_status):
    """Test a single image"""
    print(f"\n{test_name}")
    print("-" * 80)
    
    if not os.path.exists(img_path):
        print(f"❌ Image not found: {img_path}")
        return
    
    result = plant_validator.two_stage_validation(img_path, predict_disease_from_path)
    
    print(f"Status: {result['status']}")
    print(f"Plant: {result['plant']}")
    print(f"Disease: {result['disease']}")
    if result['confidence'] is not None:
        print(f"Confidence: {result['confidence']*100:.2f}%" if result['confidence'] <= 1.0 
              else f"Confidence: {result['confidence']:.2f}%")
    print(f"Message: {result['message']}")
    
    passed = result['status'] == expected_status
    status_icon = "✅" if passed else "❌"
    print(f"\n{status_icon} Expected: {expected_status}, Got: {result['status']}")
    
    test_results.append({
        "test": test_name,
        "expected": expected_status,
        "actual": result['status'],
        "passed": passed
    })

# Test supported plants from dataset
print("\nTesting SUPPORTED PLANTS (should classify)")
print("=" * 80)

dataset_base = "../dataset/test"

# Test Pepper
pepper_dirs = ["Pepper_bell_Bacterial_spot", "Pepper_bell_healthy"]
for pepper_dir in pepper_dirs:
    full_path = os.path.join(dataset_base, pepper_dir)
    if os.path.exists(full_path):
        images = [f for f in os.listdir(full_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if images:
            test_image(
                f"TEST 1: {pepper_dir}",
                os.path.join(full_path, images[0]),
                "classified"
            )
            break

# Test Potato
potato_dirs = ["Potato_Early_blight", "Potato_Late_blight", "Potato_healthy"]
for potato_dir in potato_dirs:
    full_path = os.path.join(dataset_base, potato_dir)
    if os.path.exists(full_path):
        images = [f for f in os.listdir(full_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if images:
            test_image(
                f"TEST 2: {potato_dir}",
                os.path.join(full_path, images[0]),
                "classified"
            )
            break

# Test Tomato
tomato_dirs = ["Tomato_Early_blight", "Tomato_Late_blight", "Tomato_healthy"]
for tomato_dir in tomato_dirs:
    full_path = os.path.join(dataset_base, tomato_dir)
    if os.path.exists(full_path):
        images = [f for f in os.listdir(full_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if images:
            test_image(
                f"TEST 3: {tomato_dir}",
                os.path.join(full_path, images[0]),
                "classified"
            )
            break

print("\n\nTesting EDGE CASES")
print("=" * 80)
print("\nℹ️  To fully test unsupported plants, add sample images to 'backend/test_images/'")
print("   - test_images/mango.jpg")
print("   - test_images/banana.jpg")
print("   - test_images/random_object.jpg")
print("   - test_images/blurry.jpg")

test_images_dir = "test_images"
if os.path.exists(test_images_dir):
    for img_file in os.listdir(test_images_dir):
        if img_file.lower().endswith(('.jpg', '.jpeg', '.png')):
            img_path = os.path.join(test_images_dir, img_file)
            # Unsupported images should be rejected
            test_image(
                f"TEST: {img_file}",
                img_path,
                "unsupported"  # or "invalid" depending on image
            )

# Summary
print("\n" + "=" * 80)
print("Test Summary")
print("=" * 80)

passed = sum(1 for r in test_results if r['passed'])
total = len(test_results)

for result in test_results:
    icon = "✅" if result['passed'] else "❌"
    print(f"{icon} {result['test']}: {result['actual']}")

print(f"\nPassed: {passed}/{total}")

if passed == total:
    print("\n🎉 All tests passed!")
else:
    print(f"\n⚠️  {total - passed} test(s) failed")

print("\n" + "=" * 80)
print("Next Steps")
print("=" * 80)
print("1. Train the plant validator if not done:")
print("   python train_plant_validator.py")
print("\n2. Test with unsupported plant images:")
print("   - Add test images to backend/test_images/")
print("   - Run this script again")
print("\n3. Start the backend server:")
print("   python app.py")
print("\n4. Test via API:")
print("   curl -X POST -F 'image=@test.jpg' http://localhost:5000/api/predict")
print("=" * 80)
