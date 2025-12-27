import pandas as pd
import os


CSV_FILE = "image_acquisition_metrics.csv"
OUTPUT_DIR = "updated_csvs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

df = pd.read_csv(CSV_FILE)
print(f"[INFO] Loaded {len(df)} images from {CSV_FILE}")


q1_aqi = df['AQI'].quantile(0.25)
q3_aqi = df['AQI'].quantile(0.75)

def aqi_tag(value):
    if value <= q1_aqi:
        return "LOW"
    elif value >= q3_aqi:
        return "HIGH"
    else:
        return "NORMAL"

df['AQI_tag'] = df['AQI'].apply(aqi_tag)

ambiguity_q3 = df['acquisition_ambiguity'].quantile(0.75)
df['high_ambiguity_flag'] = df['acquisition_ambiguity'] >= ambiguity_q3

df['extreme_and_ambiguous_flag'] = (
    ((df['AQI_tag'] == "LOW") | (df['AQI_tag'] == "HIGH")) &
    (df['high_ambiguity_flag'])
)

updated_csv_path = os.path.join(OUTPUT_DIR, "image_acquisition_metrics_updated.csv")
df.to_csv(updated_csv_path, index=False)
print(f"[INFO] Updated CSV saved to {updated_csv_path}")


low_quality_csv = os.path.join(OUTPUT_DIR, "low_quality_images.csv")
high_quality_csv = os.path.join(OUTPUT_DIR, "high_quality_images.csv")
high_ambiguity_csv = os.path.join(OUTPUT_DIR, "high_ambiguity_images.csv")
extreme_and_amb_csv = os.path.join(OUTPUT_DIR, "extreme_and_ambiguous_images.csv")

df[df['AQI_tag'] == "LOW"].to_csv(low_quality_csv, index=False)
df[df['AQI_tag'] == "HIGH"].to_csv(high_quality_csv, index=False)
df[df['high_ambiguity_flag']].to_csv(high_ambiguity_csv, index=False)
df[df['extreme_and_ambiguous_flag']].to_csv(extreme_and_amb_csv, index=False)

print("[INFO] Separate CSVs created for:")
print(f" - Low-quality images: {low_quality_csv}")
print(f" - High-quality images: {high_quality_csv}")
print(f" - High-ambiguity images: {high_ambiguity_csv}")
print(f" - Extreme + ambiguous images: {extreme_and_amb_csv}")
