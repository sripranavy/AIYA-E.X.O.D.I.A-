import os
import cv2
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from skimage.measure import shannon_entropy
from sklearn.preprocessing import MinMaxScaler
from tqdm import tqdm

IMG_DIR = "xrays_processed"
OUTPUT_CSV = "image_acquisition_metrics.csv"

METRICS = ["blur", "brightness", "contrast", "entropy"]
WEIGHTS = np.array([0.3, 0.2, 0.3, 0.2])

records = []

image_files = sorted(os.listdir(IMG_DIR))

print(f"[INFO] Processing {len(image_files)} images...")
for fname in tqdm(image_files, desc="Computing metrics"):
    path = os.path.join(IMG_DIR, fname)
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        continue

    blur = cv2.Laplacian(img, cv2.CV_64F).var()
    brightness = img.mean()
    contrast = img.std()
    entropy = shannon_entropy(img)

    records.append({
        "image": fname,
        "blur": blur,
        "brightness": brightness,
        "contrast": contrast,
        "entropy": entropy
    })

df = pd.DataFrame(records)

df[METRICS].hist(figsize=(10, 6), bins=40)
plt.suptitle("Acquisition Metric Distributions")
plt.tight_layout()
plt.show()

scaler = MinMaxScaler()
scaled = scaler.fit_transform(df[METRICS])
df["AQI"] = scaled @ WEIGHTS

q1 = df[METRICS].quantile(0.25)
q3 = df[METRICS].quantile(0.75)

for m in METRICS:
    df[f"{m}_tag"] = np.where(
        df[m] <= q1[m], "LOW",
        np.where(df[m] >= q3[m], "HIGH", "NORMAL")
    )

ambiguities = []
for m in METRICS:
    lower_mask = df[m] < q1[m]
    upper_mask = df[m] > q3[m]
    normal_mask = ~(lower_mask | upper_mask)

    amb = np.zeros(len(df))
    amb[lower_mask] = q1[m] - df.loc[lower_mask, m]
    amb[upper_mask] = df.loc[upper_mask, m] - q3[m]
    amb[normal_mask] = np.minimum(df.loc[normal_mask, m] - q1[m],
                                  q3[m] - df.loc[normal_mask, m])

    df[f"{m}_acq_ambiguity"] = amb
    ambiguities.append(amb)

df["acquisition_ambiguity"] = np.mean(ambiguities, axis=0)

df.to_csv(OUTPUT_CSV, index=False)
print(f"[INFO] Saved acquisition metrics to {OUTPUT_CSV}")

print("\n[INFO] Dataset summary:")
print("Total images:", len(df))
print("AQI range: {:.3f} → {:.3f}".format(df["AQI"].min(), df["AQI"].max()))
print("Acquisition ambiguity mean: {:.3f}".format(df["acquisition_ambiguity"].mean()))
