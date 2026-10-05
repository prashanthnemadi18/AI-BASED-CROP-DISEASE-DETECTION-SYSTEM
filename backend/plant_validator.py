"""
AgroGuard AI - Plant Validation Module
Two-stage validation: Plant identification → Disease classification
Prevents unsupported plants from being classified as diseases
"""

import os
import json
import numpy as np
import cv2
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# Import config
import config

# Global variables for plant validator
plant_model = None
plant_classes = []


def load_plant_validator():
    """Load the plant validation model"""
    global plant_model, plant_classes
    
    try:
        if os.path.exists(config.PLANT_VALIDATOR_PATH):
            from tensorflow.keras.models import load_model
            plant_model = load_model(config.PLANT_VALIDATOR_PATH)
            logger.info("Plant validator model loaded successfully")
        else:
            logger.warning(f"Plant validator not found at {config.PLANT_VALIDATOR_PATH}")
            return False
            
        if os.path.exists(config.PLANT_CLASSES_PATH):
            with open(config.PLANT_CLASSES_PATH) as f:
                raw = json.load(f)
            plant_classes = [k for k, v in sorted(raw.items(), key=lambda x: x[1])]
            logger.info(f"Plant validator classes loaded: {plant_classes}")
        else:
            logger.warning("Plant classes file not found")
            return False
            
        return True
    except Exception as e:
        logger.error(f"Error loading plant validator: {str(e)}")
        return False


def check_image_quality(img_array):
    """
    Check basic image quality to detect invalid images
    Returns: (is_valid, reason)
    """
    try:
        # Convert to grayscale for analysis
        if len(img_array.shape) == 4:
            # Remove batch dimension
            img = img_array[0]
        else:
            img = img_array
            
        # Denormalize if needed (if values are 0-1)
        if img.max() <= 1.0:
            img_uint8 = (img * 255).astype(np.uint8)
        else:
            img_uint8 = img.astype(np.uint8)
            
        gray = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2GRAY)
        
        # Check 1: Variance (detect very dark, very light, or uniform images)
        variance = np.var(gray)
        if variance < config.MIN_IMAGE_VARIANCE:
            return False, "Image appears to be too dark, too light, or lacks detail"
        
        # Check 2: Edge detection (detect if image has meaningful content)
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / edges.size
        if edge_density < config.MIN_EDGE_DENSITY:
            return False, "Image does not appear to contain recognizable content"
        
        return True, "OK"
    except Exception as e:
        logger.error(f"Image quality check error: {str(e)}")
        return True, "OK"  # Allow image to proceed if quality check fails


def validate_plant(img_array):
    """
    Validate if the image belongs to a supported plant
    Returns: (plant_name, confidence, is_supported)
    """
    if plant_model is None or len(plant_classes) == 0:
        logger.warning("Plant validator not loaded - skipping plant validation")
        return None, 0.0, True  # Allow to proceed if validator not available
    
    try:
        # Predict plant
        predictions = plant_model.predict(img_array, verbose=0)[0]
        top_idx = int(np.argmax(predictions))
        confidence = float(predictions[top_idx])
        plant_name = plant_classes[top_idx]
        
        logger.info(f"Plant validation: {plant_name} ({confidence*100:.2f}%)")
        
        # Check if confidence is above threshold
        if confidence < config.PLANT_CONFIDENCE_THRESHOLD:
            return plant_name, confidence, False
        
        # Check if plant is in supported list
        is_supported = plant_name in config.SUPPORTED_PLANTS
        
        return plant_name, confidence, is_supported
        
    except Exception as e:
        logger.error(f"Error in validate_plant: {str(e)}")
        return None, 0.0, False


def extract_plant_from_disease(disease_label):
    """
    Extract plant name from disease label
    e.g., "Tomato_Early_blight" -> "Tomato"
    """
    for plant in config.SUPPORTED_PLANTS:
        if disease_label.startswith(plant):
            return plant
    return None


def validate_disease_for_plant(plant_name, disease_label):
    """
    Validate that the predicted disease matches the detected plant
    Returns: (is_valid, reason)
    """
    if plant_name not in config.PLANT_DISEASE_MAPPING:
        return False, f"Plant {plant_name} not in disease mapping"
    
    valid_diseases = config.PLANT_DISEASE_MAPPING[plant_name]
    
    if disease_label in valid_diseases:
        return True, "OK"
    else:
        return False, f"Disease {disease_label} does not match plant {plant_name}"


def preprocess_for_plant_validator(img_path):
    """
    Preprocess image for plant validator
    Uses same preprocessing as disease model for consistency
    """
    try:
        img = cv2.imread(img_path)
        if img is None:
            raise ValueError(f"Could not read image from {img_path}")
        
        # Resize to model input size
        img = cv2.resize(img, config.IMG_SIZE)
        img = img / 255.0  # Normalize
        
        return np.reshape(img, (1, *config.IMG_SIZE, 3))
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise


def two_stage_validation(img_path, disease_prediction_func):
    """
    Two-stage validation pipeline:
    1. Validate plant (is it Pepper/Potato/Tomato?)
    2. If valid, run disease classification
    3. Cross-check disease matches plant
    
    Args:
        img_path: Path to the uploaded image
        disease_prediction_func: Function that returns (disease_label, confidence)
    
    Returns:
        dict with keys: success, status, plant, disease, confidence, message
    """
    try:
        # Preprocess image
        img_array = preprocess_for_plant_validator(img_path)
        
        # Stage 0: Image quality check
        is_valid_image, quality_reason = check_image_quality(img_array)
        if not is_valid_image:
            return {
                "success": False,
                "status": "invalid",
                "plant": None,
                "disease": None,
                "confidence": None,
                "message": f"Invalid image: {quality_reason}. Please upload a clear leaf image."
            }
        
        # Stage 1: Plant Validation
        plant_name, plant_confidence, is_supported = validate_plant(img_array)
        
        if not is_supported:
            if plant_confidence < config.PLANT_CONFIDENCE_THRESHOLD:
                message = (
                    f"Could not identify plant with sufficient confidence "
                    f"({plant_confidence*100:.1f}% < {config.PLANT_CONFIDENCE_THRESHOLD*100:.0f}% threshold). "
                    f"Please upload a clear Pepper, Potato, or Tomato leaf image."
                )
            else:
                message = (
                    f"Unsupported plant detected: {plant_name}. "
                    f"This system only supports Pepper, Potato, and Tomato plants. "
                    f"Please upload a leaf from one of these plants."
                )
            
            return {
                "success": False,
                "status": "unsupported",
                "plant": plant_name,
                "disease": None,
                "confidence": plant_confidence,
                "message": message
            }
        
        logger.info(f"✓ Plant validation passed: {plant_name} ({plant_confidence*100:.2f}%)")
        
        # Stage 2: Disease Classification (only if plant is supported)
        disease_label, disease_confidence = disease_prediction_func(img_path)
        
        # Convert confidence to 0-1 range if it's in percentage
        if disease_confidence > 1.0:
            disease_confidence = disease_confidence / 100.0
        
        # Check disease confidence threshold
        if disease_confidence < config.DISEASE_CONFIDENCE_THRESHOLD:
            return {
                "success": False,
                "status": "uncertain",
                "plant": plant_name,
                "disease": disease_label,
                "confidence": disease_confidence,
                "message": (
                    f"Disease classification confidence is low "
                    f"({disease_confidence*100:.1f}% < {config.DISEASE_CONFIDENCE_THRESHOLD*100:.0f}% threshold). "
                    f"Please upload a clearer image or consult an expert."
                )
            }
        
        # Stage 3: Cross-validation (does disease match plant?)
        disease_plant = extract_plant_from_disease(disease_label)
        if disease_plant != plant_name:
            logger.warning(
                f"Plant-disease mismatch: plant={plant_name}, disease={disease_label}"
            )
            # This shouldn't happen often, but if it does, trust plant validator
            return {
                "success": False,
                "status": "uncertain",
                "plant": plant_name,
                "disease": disease_label,
                "confidence": disease_confidence,
                "message": (
                    f"Classification uncertainty detected. "
                    f"Please upload a clearer image for accurate diagnosis."
                )
            }
        
        logger.info(f"✓ Disease validation passed: {disease_label} ({disease_confidence*100:.2f}%)")
        
        # All validations passed
        return {
            "success": True,
            "status": "classified",
            "plant": plant_name,
            "disease": disease_label,
            "confidence": disease_confidence,
            "message": "Classification successful"
        }
        
    except Exception as e:
        logger.error(f"Error in two_stage_validation: {str(e)}")
        return {
            "success": False,
            "status": "error",
            "plant": None,
            "disease": None,
            "confidence": None,
            "message": f"Processing error: {str(e)}"
        }


# Initialize plant validator on module load
load_plant_validator()
