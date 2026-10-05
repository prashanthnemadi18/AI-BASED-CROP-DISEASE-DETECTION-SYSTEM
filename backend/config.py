"""
AgroGuard AI - Configuration
Centralized configuration for model paths and thresholds
"""

import os

# Model Paths
MODEL_DIR = "model"
DISEASE_MODEL_PATH = os.path.join(MODEL_DIR, "crop_disease_model.h5")
PLANT_VALIDATOR_PATH = os.path.join(MODEL_DIR, "plant_validator.h5")
CLASS_NAMES_PATH = os.path.join(MODEL_DIR, "class_names.json")
PLANT_CLASSES_PATH = os.path.join(MODEL_DIR, "plant_classes.json")

# Image Configuration
IMG_SIZE = (128, 128)
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

# Confidence Thresholds (configurable)
PLANT_CONFIDENCE_THRESHOLD = float(os.environ.get("PLANT_CONFIDENCE_THRESHOLD", "0.70"))
DISEASE_CONFIDENCE_THRESHOLD = float(os.environ.get("DISEASE_CONFIDENCE_THRESHOLD", "0.70"))

# Image Quality Thresholds
MIN_IMAGE_VARIANCE = 50.0  # Detect very dark/light/blurry images
MIN_EDGE_DENSITY = 0.01     # Minimum edge content (not blank images)

# Supported Plants
SUPPORTED_PLANTS = ["Pepper_bell", "Potato", "Tomato"]

# Plant to Disease Mapping (for validation)
PLANT_DISEASE_MAPPING = {
    "Pepper_bell": [
        "Pepper_bell_Bacterial_spot",
        "Pepper_bell_healthy"
    ],
    "Potato": [
        "Potato_Early_blight",
        "Potato_Late_blight",
        "Potato_healthy"
    ],
    "Tomato": [
        "Tomato_Bacterial_spot",
        "Tomato_Early_blight",
        "Tomato_Late_blight",
        "Tomato_Leaf_Mold",
        "Tomato_Mosaic_virus",
        "Tomato_Septoria_leaf_spot",
        "Tomato_Spider_mites",
        "Tomato_Target_Spot",
        "Tomato_YellowLeaf_Curl_Virus",
        "Tomato_healthy"
    ]
}
