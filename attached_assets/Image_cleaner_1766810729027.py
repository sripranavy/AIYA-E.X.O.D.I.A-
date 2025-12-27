import os
import cv2
import numpy as np
import pydicom
import random


INPUT_DIR = "xrays"
OUTPUT_DIR = "xrays_processed"
EXTENSION = ".dcm"
LOG_INTERVAL = 500
SAMPLE_SIZE = 10000  

os.makedirs(OUTPUT_DIR, exist_ok=True)
print("[INFO] Starting DICOM preprocessing pipeline")


image_paths = []
for root, _, files in os.walk(INPUT_DIR):
    for file in files:
        if file.lower().endswith(EXTENSION):
            image_paths.append(os.path.join(root, file))

if not image_paths:
    raise ValueError("[ERROR] No DICOM files found.")

total_files = len(image_paths)
print(f"[INFO] Found {total_files} DICOM files")

if total_files > SAMPLE_SIZE:
    image_paths = random.sample(image_paths, SAMPLE_SIZE)
    print(f"[INFO] Randomly sampled {SAMPLE_SIZE} images for preprocessing.")
else:
    print(f"[INFO] Total files ({total_files}) <= SAMPLE_SIZE; processing all.")

total_files = len(image_paths)

min_h, min_w = np.inf, np.inf
print("[INFO] Scanning image resolutions...")
for i, path in enumerate(image_paths):
    try:
        ds = pydicom.dcmread(path)
        img = ds.pixel_array
        h, w = img.shape[:2]
        min_h = min(min_h, h)
        min_w = min(min_w, w)
    except Exception:
        print(f"[WARNING] Skipped unreadable DICOM: {path}")
        continue

    if (i + 1) % LOG_INTERVAL == 0 or (i + 1) == total_files:
        percent = ((i + 1) / total_files) * 100
        print(f"[INFO] Resolution scan progress: {percent:.1f}%")

min_h, min_w = int(min_h), int(min_w)
print(f"[INFO] Target resolution set to {min_w} x {min_h}")

print("[INFO] Beginning image preprocessing...")
for i, path in enumerate(image_paths):
    try:
        ds = pydicom.dcmread(path)
        img = ds.pixel_array.astype(np.float32)

        img -= img.min()
        img /= (img.max() + 1e-8)
        img = (img * 255).astype(np.uint8)

        img = cv2.resize(img, (min_w, min_h), interpolation=cv2.INTER_AREA)

        base_name = os.path.splitext(os.path.basename(path))[0]
        output_filename = f"{base_name}_{i}.png"
        output_path = os.path.join(OUTPUT_DIR, output_filename)

        cv2.imwrite(output_path, img)

    except Exception as e:
        print(f"[WARNING] Failed processing {path}: {e}")

    if (i + 1) % LOG_INTERVAL == 0 or (i + 1) == total_files:
        percent = ((i + 1) / total_files) * 100
        print(f"[INFO] Processing progress: {percent:.1f}%")

print("[INFO] DICOM preprocessing complete")
