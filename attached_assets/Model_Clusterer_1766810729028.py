import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from tqdm import tqdm

from sklearn.decomposition import PCA
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import pairwise_distances


EMBEDDINGS_PATH = "CNN Output/enhanced_embeddings.npy"
META_PATH = "CNN Output/enhanced_embeddings_metadata.csv"
OUT_DIR = "analysis"
os.makedirs(OUT_DIR, exist_ok=True)

PCA_COMPONENTS = 50
VIS_DIMS = 2
KMEANS_MAX_K = 10


print("[INFO] Loading embeddings and metadata...")
X = np.load(EMBEDDINGS_PATH)
meta = pd.read_csv(META_PATH)

print(f"[INFO] Embeddings shape: {X.shape}")


print("[INFO] Standardizing embeddings...")
X_scaled = StandardScaler().fit_transform(X)


print("[INFO] Running PCA...")
pca = PCA(n_components=PCA_COMPONENTS, random_state=42)
X_pca = pca.fit_transform(X_scaled)

plt.figure(figsize=(8,5))
plt.plot(np.cumsum(pca.explained_variance_ratio_))
plt.xlabel("PCA Components")
plt.ylabel("Cumulative Explained Variance")
plt.title("PCA Variance Explained")
plt.grid(True)
plt.savefig(f"{OUT_DIR}/pca_variance.png")
plt.close()

X_vis = PCA(n_components=VIS_DIMS, random_state=42).fit_transform(X_scaled)


print("[INFO] Computing KMeans elbow curve...")
inertias = []

for k in tqdm(range(2, KMEANS_MAX_K+1), desc="KMeans Elbow"):
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    km.fit(X_pca)
    inertias.append(km.inertia_)

plt.figure(figsize=(7,5))
plt.plot(range(2, KMEANS_MAX_K+1), inertias, marker="o")
plt.xlabel("k")
plt.ylabel("Inertia")
plt.title("KMeans Elbow Method")
plt.grid(True)
plt.savefig(f"{OUT_DIR}/elbow_curve.png")
plt.close()

BEST_K = np.argmin(np.diff(inertias)) + 3
print(f"[INFO] Selected K = {BEST_K}")

kmeans = KMeans(n_clusters=BEST_K, n_init=20, random_state=42)
meta["kmeans_cluster"] = kmeans.fit_predict(X_pca)


print("[INFO] Running DBSCAN clustering...")
dbscan = DBSCAN(eps=1.5, min_samples=10, n_jobs=-1)
meta["dbscan_cluster"] = dbscan.fit_predict(X_pca)


print("[INFO] Running Hierarchical clustering...")
hier = AgglomerativeClustering(n_clusters=BEST_K, linkage="ward")
meta["hier_cluster"] = hier.fit_predict(X_pca)


def plot_clusters(labels, title, fname):
    plt.figure(figsize=(8,6))
    scatter = plt.scatter(
        X_vis[:,0], X_vis[:,1],
        c=labels,
        cmap="tab20",
        s=6,
        alpha=0.8
    )
    plt.title(title)
    plt.colorbar(scatter)
    plt.tight_layout()
    plt.savefig(f"{OUT_DIR}/{fname}")
    plt.close()

plot_clusters(meta["kmeans_cluster"], "KMeans Clustering (PCA-2D)", "kmeans_clusters.png")
plot_clusters(meta["dbscan_cluster"], "DBSCAN Clustering (Noise = -1)", "dbscan_clusters.png")
plot_clusters(meta["hier_cluster"], "Hierarchical Clustering", "hierarchical_clusters.png")


print("[INFO] Computing ambiguity scores...")

centroids = kmeans.cluster_centers_
dists = pairwise_distances(X_pca, centroids)
meta["cluster_distance"] = np.min(dists, axis=1)

threshold = meta["cluster_distance"].quantile(0.95)
meta["ambiguous"] = meta["cluster_distance"] > threshold

ambiguous_df = meta[meta["ambiguous"]]
ambiguous_df.to_csv(f"{OUT_DIR}/ambiguous_images.csv", index=False)

meta.to_csv(f"{OUT_DIR}/clustering_results.csv", index=False)

print("\n[INFO] Clustering analysis complete.")
print(f"[INFO] Ambiguous images: {len(ambiguous_df)}")
print("[INFO] Outputs saved to /analysis")
