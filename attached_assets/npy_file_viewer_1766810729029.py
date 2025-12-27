"""import numpy as np
import matplotlib.pyplot as plt
import os
import random

def view_random_npy(sample_images=5):
    folder_path = os.path.dirname(os.path.abspath(__file__))  # same folder as script
    npy_files = [f for f in os.listdir(folder_path) if f.endswith(".npy")]
    
    if not npy_files:
        print("[ERROR] No .npy files found in this folder.")
        return

    # Pick a random .npy file
    file_name = random.choice(npy_files)
    file_path = os.path.join(folder_path, file_name)
    print(f"[INFO] Randomly selected file: {file_name}")

    # Load .npy file
    data = np.load(file_path)
    print(f"Shape: {data.shape}")
    print(f"Dtype: {data.dtype}")

    # Visualize first few samples if possible
    if data.ndim >= 2 and sample_images > 0:
        num_samples = min(sample_images, data.shape[0])
        print(f"\nShowing first {num_samples} samples:")
        for i in range(num_samples):
            sample = data[i]
            if sample.ndim == 1:
                plt.figure()
                plt.plot(sample)
                plt.title(f"Sample {i} (1D)")
                plt.show()
            elif sample.ndim in [2,3]:
                plt.figure()
                if sample.ndim == 3 and sample.shape[2] in [1,3]:
                    plt.imshow(sample.squeeze(), cmap='gray')
                else:
                    plt.imshow(sample, cmap='gray')
                plt.title(f"Sample {i}")
                plt.axis('off')
                plt.show()
            else:
                print(f"Sample {i} has shape {sample.shape}, cannot visualize")

if __name__ == "__main__":
    view_random_npy()"""

import os
import cv2
import pydicom
import matplotlib.pyplot as plt

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

print(f"\n[INFO] Scanning root directory:\n{ROOT_DIR}\n")

preview_count = 0
MAX_PREVIEWS = 5

for folder in sorted(os.listdir(ROOT_DIR)):
    folder_path = os.path.join(ROOT_DIR, folder)

    if not os.path.isdir(folder_path):
        continue

    files = os.listdir(folder_path)
    if not files:
        print(f"[EMPTY] {folder_path}")
        continue

    file_name = files[0]
    file_path = os.path.join(folder_path, file_name)

    status = ""
    img = None

    try:
        if file_name.lower().endswith(".dcm"):
            ds = pydicom.dcmread(file_path)
            img = ds.pixel_array
            status = f"DICOM OK | shape={img.shape} dtype={img.dtype}"

        else:
            img = cv2.imread(file_path, cv2.IMREAD_UNCHANGED)
            if img is None:
                status = "OPENCV FAILED"
            else:
                status = f"IMG OK | shape={img.shape} dtype={img.dtype}"

    except Exception as e:
        status = f"ERROR: {str(e)}"

    print(f"Folder: {folder}")
    print(f" File: {file_name}")
    print(f" Status: {status}\n")

    # Preview a few images only
    if img is not None and preview_count < MAX_PREVIEWS:
        preview_count += 1
        plt.figure(figsize=(3, 3))
        plt.imshow(img, cmap="gray")
        plt.title(file_name)
        plt.axis("off")
        plt.show()


