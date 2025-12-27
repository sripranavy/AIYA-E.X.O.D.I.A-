import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import gaussian_kde
from tqdm import tqdm
import os

CSV_FILE = "image_acquisition_metrics.csv"
OUTPUT_DIR = "final_visualizations"
os.makedirs(OUTPUT_DIR, exist_ok=True)

METRICS = ["blur", "brightness", "contrast", "entropy"]
BINS = 40
sns.set_style("whitegrid")

df = pd.read_csv(CSV_FILE)
print(f"[INFO] Loaded {len(df)} rows from {CSV_FILE}")

fig, axes = plt.subplots(2, 2, figsize=(14,10))
axes = axes.flatten()

for i, metric in enumerate(tqdm(METRICS, desc="Generating combined histograms")):
    values = df[metric].dropna().values
    ax = axes[i]

    counts, bins_edges, patches = ax.hist(values, bins=BINS, alpha=0.6, edgecolor='black')
    for j, patch in enumerate(patches):
        patch.set_facecolor(plt.cm.viridis(j / len(patches)))

    kde = gaussian_kde(values)
    x_grid = np.linspace(min(values), max(values), 1000)
    ax2 = ax.twinx()
    ax2.plot(x_grid, kde(x_grid)*len(values)*(bins_edges[1]-bins_edges[0]), color='red', lw=2)
    ax2.set_ylim(0, max(counts)*1.1)
    ax2.get_yaxis().set_visible(False)

    ax.set_title(f"{metric.capitalize()} Distribution", fontsize=14, weight='bold')
    ax.set_xlabel(metric.capitalize())
    ax.set_ylabel("Count")
    ax.grid(alpha=0.3)

plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "combined_histograms.png"), dpi=200)
plt.close(fig)

fig, ax = plt.subplots(figsize=(10,6))
sns.boxplot(data=df[METRICS], palette="Set2", ax=ax)
ax.set_title("Boxplots of Acquisition Metrics", fontsize=16, weight='bold')
plt.xticks(fontsize=12)
plt.ylabel("Value")
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "metrics_boxplot.png"), dpi=200)
plt.close(fig)

if 'AQI' in df.columns:
    fig, ax = plt.subplots(figsize=(10,6))
    sns.histplot(df['AQI'], bins=40, kde=True, color='purple', alpha=0.7)
    ax.set_title("Acquisition Quality Index (AQI) Distribution", fontsize=16, weight='bold')
    ax.set_xlabel("AQI")
    ax.set_ylabel("Number of Images")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "AQI_distribution.png"), dpi=200)
    plt.close(fig)

if 'AQI' in df.columns and 'acquisition_ambiguity' in df.columns:
    plt.figure(figsize=(8,6))
    hb = plt.hexbin(df['AQI'], df['acquisition_ambiguity'],
                    gridsize=50, cmap='coolwarm', mincnt=1)
    plt.colorbar(hb, label='Count')
    plt.xlabel("AQI")
    plt.ylabel("Acquisition Ambiguity")
    plt.title("AQI vs Acquisition Ambiguity Heatmap", fontsize=14, weight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "AQI_vs_ambiguity_heatmap.png"), dpi=200)
    plt.close()

plt.figure(figsize=(8,6))
corr = df[METRICS].corr()
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", square=True, cbar=True)
plt.title("Correlation Heatmap of Acquisition Metrics", fontsize=14, weight='bold')
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "correlation_heatmap.png"), dpi=200)
plt.close()

print(f"[INFO] All visualizations saved in '{OUTPUT_DIR}'")
