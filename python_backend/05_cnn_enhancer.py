import os
import cv2
import numpy as np
import pandas as pd
from tqdm import tqdm

import tensorflow as tf
from tensorflow.keras.applications import DenseNet121
from tensorflow.keras.applications.densenet import preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.layers import GlobalAveragePooling2D
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import normalize

IMG_DIR = "xrays_processed"
CSV_PATH = "updated_csvs/image_acquisition_metrics_updated.csv"
OUTPUT_DIR = "output"
OUTPUT_EMBEDDINGS = os.path.join(OUTPUT_DIR, "enhanced_embeddings.npy")
OUTPUT_META = os.path.join(OUTPUT_DIR, "enhanced_embeddings_metadata.csv")

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
FINE_TUNE_LAYERS = 30  
EPOCHS = 2            
LEARNING_RATE = 1e-5

os.makedirs(OUTPUT_DIR, exist_ok=True)

df = pd.read_csv(CSV_PATH)
all_files = df["image"].tolist()

valid_files = []
for f in all_files:
    path = os.path.join(IMG_DIR, f)
    if os.path.exists(path):
        valid_files.append(f)

print(f"[INFO] Valid images found: {len(valid_files)} / {len(all_files)}")

if len(valid_files) == 0:
    raise RuntimeError("No valid images found. Check IMG_DIR path.")


def preprocess_image(path):
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return None

    img = cv2.resize(img, IMG_SIZE)
    img = np.stack([img] * 3, axis=-1)  
    img = preprocess_input(img)
    return img


base_model = DenseNet121(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

x = GlobalAveragePooling2D()(base_model.output)
model = Model(inputs=base_model.input, outputs=x)


for layer in base_model.layers:
    layer.trainable = False


for layer in base_model.layers[-FINE_TUNE_LAYERS:]:
    layer.trainable = True

model.compile(
    optimizer=Adam(learning_rate=LEARNING_RATE),
    loss="mse"  
)

print(f"[INFO] Fine-tuning last {FINE_TUNE_LAYERS} layers.")


train_images = []

for f in tqdm(valid_files[:512], desc="Preparing fine-tuning subset"):
    img = preprocess_image(os.path.join(IMG_DIR, f))
    if img is not None:
        train_images.append(img)

train_images = np.array(train_images)

model.fit(
    train_images,
    model.predict(train_images, verbose=0),
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    verbose=1
)

print("[INFO] Fine-tuning complete.")

embeddings = []
metadata = []

for i in tqdm(range(0, len(valid_files), BATCH_SIZE), desc="Extracting enhanced embeddings"):
    batch_files = valid_files[i:i+BATCH_SIZE]
    batch_imgs = []

    for f in batch_files:
        img = preprocess_image(os.path.join(IMG_DIR, f))
        if img is not None:
            batch_imgs.append(img)

    if len(batch_imgs) == 0:
        continue

    batch_imgs = np.array(batch_imgs)
    batch_emb = model.predict(batch_imgs, verbose=0)

    embeddings.append(batch_emb)

    for f in batch_files:
        row = df[df["image"] == f].iloc[0].to_dict()
        metadata.append(row)


embeddings = np.vstack(embeddings)
embeddings = normalize(embeddings)

np.save(OUTPUT_EMBEDDINGS, embeddings)
pd.DataFrame(metadata).to_csv(OUTPUT_META, index=False)

print("[SUCCESS]")
print(f"Enhanced embeddings shape: {embeddings.shape}")
print(f"Saved to: {OUTPUT_EMBEDDINGS}")
