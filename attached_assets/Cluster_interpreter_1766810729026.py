import os
import numpy as np
import pandas as pd
from tqdm import tqdm
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

EMBEDDINGS_PATH = "CNN Output/enhanced_embeddings.npy"
CSV_PATH = "analysis/clustering_results.csv"
OUTPUT_DIR = "INTERPRETER Output/Cluster_interpretation"
PCA_COMPONENTS = 2

os.makedirs(OUTPUT_DIR, exist_ok=True)
sns.set(style="whitegrid")

print("[INFO] Loading embeddings and clustering results...")

embeddings = np.load(EMBEDDINGS_PATH)
df = pd.read_csv(CSV_PATH)

print(f"[INFO] Embeddings shape: {embeddings.shape}")
print(f"[INFO] CSV columns detected: {list(df.columns)}")


possible_cluster_cols = [
    "cluster",
    "kmeans_cluster",
    "dbscan_cluster",
    "hierarchical_cluster",
    "final_cluster",
    "cluster_label"
]

CLUSTER_COL = None
for col in possible_cluster_cols:
    if col in df.columns:
        CLUSTER_COL = col
        break

if CLUSTER_COL is None:
    raise ValueError(
        "❌ No cluster column found. Expected one of: "
        f"{possible_cluster_cols}"
    )

print(f"[INFO] Using cluster column: '{CLUSTER_COL}'")

print("[INFO] Performing PCA dimensionality reduction...")

scaler = StandardScaler()
embeddings_scaled = scaler.fit_transform(embeddings)

pca = PCA(n_components=PCA_COMPONENTS, random_state=42)
pca_result = pca.fit_transform(embeddings_scaled)

df["pca_1"] = pca_result[:, 0]
df["pca_2"] = pca_result[:, 1]

print("[INFO] PCA variance explained:", pca.explained_variance_ratio_)


plt.figure(figsize=(10, 8))
sns.scatterplot(
    data=df,
    x="pca_1",
    y="pca_2",
    hue=CLUSTER_COL,
    palette="tab10",
    s=45,
    alpha=0.85
)
plt.title("PCA Projection of Image Clusters")
plt.legend(title="Cluster", bbox_to_anchor=(1.05, 1), loc="upper left")
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "pca_clusters.png"))
plt.close()

if "cluster_distance" in df.columns:
    plt.figure(figsize=(10, 6))
    sns.boxplot(
        data=df,
        x=CLUSTER_COL,
        y="cluster_distance",
        hue=CLUSTER_COL,
        palette="Set2",
        legend=False
    )
    plt.title("Cluster Compactness (Distance to Centroid)")
    plt.xlabel("Cluster ID")
    plt.ylabel("Distance")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "cluster_compactness.png"))
    plt.close()


print("[INFO] Computing cluster stability metrics...")

stability_df = (
    df.groupby(CLUSTER_COL)["cluster_distance"]
    .agg(["mean", "std", "count"])
    .reset_index()
)

stability_df["stability_score"] = 1 / (1 + stability_df["std"])

stability_df.to_csv(
    os.path.join(OUTPUT_DIR, "cluster_stability_metrics.csv"),
    index=False
)

plt.figure(figsize=(10, 6))
sns.barplot(
    data=stability_df,
    x=CLUSTER_COL,
    y="stability_score",
    hue=CLUSTER_COL,
    palette="viridis",
    legend=False
)
plt.title("Cluster Stability Score")
plt.ylabel("Stability (Higher = Better)")
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "cluster_stability.png"))
plt.close()

df_sorted = df.sort_values("cluster_distance").reset_index(drop=True)
df_sorted["sample_index"] = df_sorted.index

plt.figure(figsize=(12, 6))
sns.lineplot(
    data=df_sorted,
    x="sample_index",
    y="cluster_distance",
    hue=CLUSTER_COL,
    palette="tab10",
    linewidth=1
)
plt.title("Cluster Distance Stability Across Dataset")
plt.xlabel("Sample Index")
plt.ylabel("Distance to Cluster Center")
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "stability_timeseries.png"))
plt.close()


print("[INFO] Generating AI-style cluster interpretation...")

interpretations = []

for _, row in stability_df.iterrows():
    stability = row["stability_score"]

    if stability > 0.7:
        verdict = "Highly stable cluster – consistent, high-confidence images"
    elif stability > 0.4:
        verdict = "Moderately stable cluster – contains ambiguous samples"
    else:
        verdict = "Unstable cluster – likely poor-quality or outlier images"

    interpretations.append({
        CLUSTER_COL: row[CLUSTER_COL],
        "mean_distance": row["mean"],
        "std_distance": row["std"],
        "stability_score": stability,
        "interpretation": verdict
    })

interpretation_df = pd.DataFrame(interpretations)

interpretation_df.to_csv(
    os.path.join(OUTPUT_DIR, "ai_cluster_interpretation.csv"),
    index=False
)

print("\n[SUMMARY]")
print(interpretation_df)
print("\n[INFO] Cluster interpretation pipeline complete.")
