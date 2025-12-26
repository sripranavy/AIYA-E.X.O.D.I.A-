# AI Model Backend Integration

This directory is reserved for your Python AI model and inference code. Once you upgrade to full-stack mode, you can add your pneumonia classification model here.

## Directory Structure

```
python_backend/
├── models/
│   ├── clustering_model.pkl      # Your unsupervised clustering model
│   ├── classifier_model.h5       # Your classification model
│   └── feature_extractor.pkl     # Feature extraction model
├── inference.py                   # Main inference script (see template below)
├── preprocessing.py               # Image preprocessing utilities
├── requirements.txt              # Python dependencies
└── config.py                     # Configuration and constants
```

## Expected Inference Function

Your `inference.py` should expose a function like:

```python
def analyze_xray(image_path):
    """
    Analyze X-ray image and return pneumonia classification.
    
    Args:
        image_path (str): Path to the X-ray image
    
    Returns:
        dict: {
            "probability": float (0-100),
            "phenotype": str ("Bacterial", "Viral", "Fungal", "Normal"),
            "severity": str ("Low", "Moderate", "Critical"),
            "findings": list of str,
            "clusters": list of cluster assignments,
            "heatmap_regions": list of {'x', 'y', 'intensity'}
        }
    """
    pass
```

## API Endpoints (Auto-Generated)

Once integrated, these endpoints will be available:

### POST /api/analyze
- Accepts X-ray image upload
- Returns analysis results with phenotype classification
- Uses unsupervised clustering for subphenotype detection

### GET /api/health
- Health check endpoint
- Returns model status

## Integration Steps (When Upgrading to Full-Stack)

1. Extract your AI files into this directory
2. Create `inference.py` with the analysis function
3. Add your model files to `models/`
4. List dependencies in `requirements.txt`
5. The frontend will automatically call `/api/analyze` endpoint

## Current Mockup Status

The frontend is currently using mock analysis data. Real integration happens at:
- `client/src/pages/Analysis.tsx` - Line ~101: `startAnalysis()` function
- This function will be updated to call the real API endpoint when backend is ready
