import os
import numpy as np
import pandas as pd
from tqdm import tqdm
import cv2
import tensorflow as tf
from tensorflow.keras.applications import DenseNet121
from tensorflow.keras.applications.densenet import preprocess_input
from tensorflow.keras.models import Model

IMG_DIR = "xrays_processed"
ACQ_CSV = "updated_csvs/image_acquisition_metrics_updated.csv"
OUTPUT_EMBEDDINGS = "xrays_embeddings.npy"
OUTPUT_META = "embeddings_metadata.csv"
BATCH_SIZE = 32
IMG_SIZE = (224, 224)
SAVE_GRADCAM = True
GRADCAM_DIR = "gradcam_previews"
os.makedirs(GRADCAM_DIR, exist_ok=True)

acq_df = pd.read_csv(ACQ_CSV)
filenames = acq_df['image'].tolist()
print(f"[INFO] Loaded {len(filenames)} images from {ACQ_CSV}")

base_model = DenseNet121(weights='imagenet', include_top=False, input_shape=(224,224,3))
gap_layer = tf.keras.layers.GlobalAveragePooling2D()(base_model.output)
model = Model(inputs=base_model.input, outputs=gap_layer)
print("[INFO] DenseNet121 loaded for feature extraction.")

conv_layers = [l.name for l in base_model.layers if 'conv' in l.name]
last_conv_layer_name = conv_layers[-1]
print(f"[INFO] Using last conv layer for Grad-CAM: {last_conv_layer_name}")


def preprocess_image(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, IMG_SIZE)
    img = np.stack([img]*3, axis=-1)  
    img = preprocess_input(img.astype(np.float32))
    return img


def compute_gradcam(img_array, model, last_conv_layer_name):
    try:
        grad_model = tf.keras.models.Model(
            [model.inputs],
            [model.get_layer(last_conv_layer_name).output, model.output]
        )
        img_tensor = tf.convert_to_tensor(np.expand_dims(img_array, axis=0), dtype=tf.float32)
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(img_tensor)
            loss = tf.reduce_mean(predictions)
        grads = tape.gradient(loss, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0,1,2))
        conv_outputs = conv_outputs[0]
        heatmap = tf.reduce_sum(tf.multiply(conv_outputs, pooled_grads), axis=-1)
        heatmap = tf.maximum(heatmap, 0)
        heatmap /= tf.reduce_max(heatmap) + 1e-8
        return heatmap.numpy()
    except Exception as e:
        return None


embeddings = []
meta_records = []

for i in tqdm(range(0, len(filenames), BATCH_SIZE), desc="Extracting embeddings"):
    batch_files = filenames[i:i+BATCH_SIZE]
    batch_imgs = np.array([preprocess_image(os.path.join(IMG_DIR,f)) for f in batch_files])
    batch_embeddings = model.predict(batch_imgs)
    embeddings.append(batch_embeddings)

    for j, f in enumerate(batch_files):
        record = acq_df[acq_df['image']==f].to_dict(orient='records')[0]
        record['embedding_idx'] = i + j
        meta_records.append(record)

        if SAVE_GRADCAM and (i+j) % 200 == 0:
            heatmap = compute_gradcam(batch_imgs[j], model, last_conv_layer_name)
            if heatmap is not None:
                img_orig = cv2.imread(os.path.join(IMG_DIR,f), cv2.IMREAD_GRAYSCALE)
                img_orig = cv2.resize(img_orig, IMG_SIZE)
                heatmap = cv2.resize(heatmap, (IMG_SIZE[1], IMG_SIZE[0]))
                heatmap_color = cv2.applyColorMap(np.uint8(255*heatmap), cv2.COLORMAP_JET)
                superimposed = cv2.addWeighted(cv2.cvtColor(img_orig, cv2.COLOR_GRAY2BGR), 0.6, heatmap_color, 0.4, 0)
                cv2.imwrite(os.path.join(GRADCAM_DIR, f"gradcam_{f}"), superimposed)


embeddings = np.vstack(embeddings)
meta_df = pd.DataFrame(meta_records)

from sklearn.preprocessing import normalize
embeddings_norm = normalize(embeddings)

np.save(OUTPUT_EMBEDDINGS, embeddings_norm)
meta_df.to_csv(OUTPUT_META, index=False)

print("[INFO] Feature extraction complete.")
print(f"Embeddings shape: {embeddings_norm.shape}")
print(f"Metadata saved to {OUTPUT_META}")
