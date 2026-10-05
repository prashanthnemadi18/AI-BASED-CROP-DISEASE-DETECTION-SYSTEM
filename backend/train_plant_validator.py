"""
AgroGuard AI - Plant Validator Training Script
Trains a lightweight CNN to classify plants (Pepper/Potato/Tomato)
Uses transfer learning with MobileNetV2 for efficiency
"""

import os
import json
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam

# Configuration
TRAIN_DIR = "../dataset/train"
TEST_DIR = "../dataset/test"
MODEL_PATH = "model/plant_validator.h5"
IMG_SIZE = (128, 128)
BATCH_SIZE = 32
EPOCHS = 15

os.makedirs("model", exist_ok=True)

print("=" * 70)
print("AgroGuard AI - Plant Validator Training")
print("=" * 70)

# Custom data generator that extracts plant name from disease folders
def plant_label_from_disease_folder(folder_name):
    """
    Extract plant name from disease folder
    e.g., 'Tomato_Early_blight' -> 'Tomato'
    """
    if folder_name.startswith("Pepper_bell"):
        return "Pepper_bell"
    elif folder_name.startswith("Potato"):
        return "Potato"
    elif folder_name.startswith("Tomato"):
        return "Tomato"
    else:
        return folder_name


def create_plant_dataset(source_dir, target_dir, split_name):
    """
    Create plant-level dataset from disease-level dataset
    by organizing images into plant folders
    """
    import shutil
    
    # Create target directories
    os.makedirs(target_dir, exist_ok=True)
    for plant in ["Pepper_bell", "Potato", "Tomato"]:
        os.makedirs(os.path.join(target_dir, plant), exist_ok=True)
    
    # Get all disease folders
    disease_folders = [f for f in os.listdir(source_dir) 
                      if os.path.isdir(os.path.join(source_dir, f))]
    
    total_images = 0
    plant_counts = {"Pepper_bell": 0, "Potato": 0, "Tomato": 0}
    
    print(f"\nProcessing {split_name} dataset...")
    
    for disease_folder in disease_folders:
        plant = plant_label_from_disease_folder(disease_folder)
        if plant not in ["Pepper_bell", "Potato", "Tomato"]:
            continue
        
        source_disease_dir = os.path.join(source_dir, disease_folder)
        target_plant_dir = os.path.join(target_dir, plant)
        
        # Copy images
        images = [f for f in os.listdir(source_disease_dir) 
                 if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        for img in images:
            src = os.path.join(source_disease_dir, img)
            # Rename to avoid conflicts: plantname_originalfolder_filename
            new_name = f"{plant}_{disease_folder}_{img}"
            dst = os.path.join(target_plant_dir, new_name)
            
            if not os.path.exists(dst):
                shutil.copy2(src, dst)
                total_images += 1
                plant_counts[plant] += 1
    
    print(f"  Total images: {total_images}")
    for plant, count in plant_counts.items():
        print(f"  {plant}: {count} images")
    
    return target_dir


# Create plant-level datasets
PLANT_TRAIN_DIR = "plant_dataset/train"
PLANT_TEST_DIR = "plant_dataset/test"

if not os.path.exists(PLANT_TRAIN_DIR) or len(os.listdir(PLANT_TRAIN_DIR)) == 0:
    print("\n" + "=" * 70)
    print("Creating plant-level dataset from disease dataset...")
    print("=" * 70)
    create_plant_dataset(TRAIN_DIR, PLANT_TRAIN_DIR, "train")
    create_plant_dataset(TEST_DIR, PLANT_TEST_DIR, "test")
    print("\n✅ Plant dataset created successfully!\n")
else:
    print("\n✅ Using existing plant dataset\n")

# Data Augmentation (less aggressive than disease model)
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=15,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.1,
    zoom_range=0.15,
    horizontal_flip=True,
    fill_mode="nearest",
)

test_datagen = ImageDataGenerator(rescale=1.0 / 255)

train_data = train_datagen.flow_from_directory(
    PLANT_TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
)

test_data = test_datagen.flow_from_directory(
    PLANT_TEST_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
)

NUM_CLASSES = train_data.num_classes
print(f"\n✅ Found {NUM_CLASSES} plant classes: {list(train_data.class_indices.keys())}\n")

# Save plant class names
with open("model/plant_classes.json", "w") as f:
    json.dump(train_data.class_indices, f, indent=2)
print("✅ plant_classes.json saved.\n")

# Model Architecture - Lightweight CNN for plant classification
print("=" * 70)
print("Building Plant Validator Model")
print("=" * 70)

model = models.Sequential([
    # Block 1
    layers.Conv2D(32, (3, 3), activation="relu", input_shape=(128, 128, 3), padding="same"),
    layers.BatchNormalization(),
    layers.MaxPooling2D(2, 2),
    layers.Dropout(0.2),

    # Block 2
    layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
    layers.BatchNormalization(),
    layers.MaxPooling2D(2, 2),
    layers.Dropout(0.2),

    # Block 3
    layers.Conv2D(128, (3, 3), activation="relu", padding="same"),
    layers.BatchNormalization(),
    layers.MaxPooling2D(2, 2),
    layers.Dropout(0.3),

    # Dense layers
    layers.Flatten(),
    layers.Dense(256, activation="relu"),
    layers.BatchNormalization(),
    layers.Dropout(0.4),
    layers.Dense(NUM_CLASSES, activation="softmax"),
])

model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss="categorical_crossentropy",
    metrics=["accuracy"],
)

model.summary()

# Callbacks
callbacks = [
    ModelCheckpoint(
        MODEL_PATH, 
        save_best_only=True, 
        monitor="val_accuracy", 
        verbose=1
    ),
    ReduceLROnPlateau(
        factor=0.5, 
        patience=3, 
        min_lr=1e-6, 
        monitor="val_loss",
        verbose=1
    ),
]

# Training
print("\n" + "=" * 70)
print("🚀 Starting Plant Validator Training...")
print("=" * 70 + "\n")

history = model.fit(
    train_data,
    validation_data=test_data,
    epochs=EPOCHS,
    callbacks=callbacks,
)

# Evaluate final model
print("\n" + "=" * 70)
print("Evaluating Plant Validator...")
print("=" * 70)

test_loss, test_accuracy = model.evaluate(test_data)
print(f"\n✅ Test Accuracy: {test_accuracy*100:.2f}%")
print(f"✅ Test Loss: {test_loss:.4f}\n")

# Plot training curves
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].plot(history.history["accuracy"], label="Train Acc", marker='o')
axes[0].plot(history.history["val_accuracy"], label="Val Acc", marker='s')
axes[0].set_title("Plant Validator - Accuracy")
axes[0].set_xlabel("Epoch")
axes[0].set_ylabel("Accuracy")
axes[0].legend()
axes[0].grid(True, alpha=0.3)

axes[1].plot(history.history["loss"], label="Train Loss", marker='o')
axes[1].plot(history.history["val_loss"], label="Val Loss", marker='s')
axes[1].set_title("Plant Validator - Loss")
axes[1].set_xlabel("Epoch")
axes[1].set_ylabel("Loss")
axes[1].legend()
axes[1].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("model/plant_validator_curves.png", dpi=150)
print("✅ Training curves saved to model/plant_validator_curves.png")

print("\n" + "=" * 70)
print("✅ Plant Validator Training Complete!")
print("=" * 70)
print(f"✅ Model saved to: {MODEL_PATH}")
print(f"✅ Classes: {list(train_data.class_indices.keys())}")
print(f"✅ Final accuracy: {test_accuracy*100:.2f}%")
print("=" * 70 + "\n")
