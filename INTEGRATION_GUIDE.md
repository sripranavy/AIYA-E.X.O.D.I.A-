# PneumoScan AI - Integration Guide

## Overview

This project is a **frontend prototype** with placeholders ready for your Python AI model. The structure supports clustering-based pneumonia phenotype classification as described in your requirements.

---

## Current Setup

### ✅ Frontend (Ready)
- **Location:** `client/src/pages/Analysis.tsx`
- **Features:** Image upload, mock analysis, diagnostic report display
- **API Module:** `client/src/lib/api.ts` (currently returns mock data)

### 🔲 Backend (Ready for Python Code)
- **Location:** `python_backend/`
- **Structure:** Placeholder files for your AI model

---

## How It Works (Current Flow)

```
User uploads X-ray image
    ↓
Analysis.tsx calls analyzeXray() from api.ts
    ↓
api.ts returns mock data (2.5 second delay simulation)
    ↓
Results displayed with phenotype, severity, findings
```

---

## How It Will Work (After Integration)

```
User uploads X-ray image
    ↓
Analysis.tsx calls analyzeXray(imageFile)
    ↓
Frontend sends: POST /api/analyze with image
    ↓
Python backend receives image
    ↓
Your AI model:
  1. Preprocesses image
  2. Extracts features
  3. Performs unsupervised clustering (subphenotypes)
  4. Classifies pneumonia type
  5. Generates heatmap regions
    ↓
Backend returns: JSON with results
    ↓
Frontend displays real analysis
```

---

## Integration Steps (When Ready for Full-Stack)

### Step 1: Upgrade to Full-Stack
- Request the conversion from mockup to full-stack application
- This enables Python backend server support

### Step 2: Add Your AI Code
Extract your ZIP files and place them in `python_backend/`:

```
python_backend/
├── models/
│   ├── clustering_model.pkl      # Your clustering model
│   ├── classifier_model.h5       # Your classification model
│   └── feature_extractor.pkl     # Feature extraction
├── inference.py                   # Main inference (see template)
├── preprocessing.py              # Image preprocessing
├── requirements.txt              # Python dependencies
└── config.py                     # Config constants
```

### Step 3: Implement Inference Function
Create `python_backend/inference.py` with:

```python
from typing import Dict

def analyze_xray(image_path: str) -> Dict:
    """
    Args: image_path (file path string)
    Returns: {
        "probability": float (0-100),
        "phenotype": str ("Bacterial", "Viral", "Fungal", "Normal"),
        "severity": str ("Low", "Moderate", "Critical"),
        "findings": [list of strings],
        "heatmap_regions": [{"x": int, "y": int, "intensity": float}]
    }
    """
    # Load and preprocess image
    # Extract features using your feature extractor
    # Perform unsupervised clustering on features
    # Classify phenotype and severity
    # Generate heatmap from attention mechanisms
    # Return combined results
    pass
```

### Step 4: Create API Endpoint
The backend server will automatically create this endpoint:

```javascript
POST /api/analyze
Content-Type: multipart/form-data

Request:
- file: <image_file>

Response:
{
  "probability": 85,
  "phenotype": "Bacterial",
  "severity": "Moderate",
  "findings": [
    "Consolidation in right lower lobe",
    "Air bronchograms present",
    "Pleural effusion possible"
  ],
  "heatmap_regions": [
    {"x": 45, "y": 60, "intensity": 0.9},
    {"x": 40, "y": 55, "intensity": 0.7}
  ]
}
```

### Step 5: Update API Module
Replace mock implementation in `client/src/lib/api.ts`:

```typescript
export async function analyzeXray(imageFile: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) throw new Error('Analysis failed');
  return response.json();
}
```

---

## Key Features Your Model Should Support

### 1. Clustering (Unsupervised Learning)
- Identify subphenotypes within pneumonia cases
- Distinguish subtle differences in infection patterns
- Used for more nuanced classification beyond binary present/absent

### 2. Phenotype Classification
- **Bacterial:** Lobar consolidation, sharp borders, air bronchograms
- **Viral:** Diffuse interstitial markings, ground-glass opacity
- **Fungal:** [Your model's patterns]
- **Normal:** Clear lung fields

### 3. Severity Assessment
- **Low:** Localized, minimal spread
- **Moderate:** Multiple lobes or moderate opacity
- **Critical:** Extensive bilateral involvement, respiratory compromise signs

### 4. Heatmap Localization
- Identify exact regions where pneumonia is detected
- Support attention/grad-CAM style visualization
- Help clinicians focus on affected areas

---

## File Reference

### Frontend Entry Points
- `client/src/pages/Analysis.tsx` - Main analysis interface (calls API here)
- `client/src/lib/api.ts` - API client (update this for real backend)
- `client/src/pages/Home.tsx` - Landing page
- `client/src/pages/Models.tsx` - Reference case library

### Python Backend Placeholders
- `python_backend/inference_template.py` - Use as a starting point
- `python_backend/README.md` - Detailed backend guide
- `python_backend/requirements.txt` - Dependencies list

---

## Testing the Current Mock

1. Go to the **Analysis** page
2. Upload any image (PNG, JPG, etc.)
3. Click **Analyze Scan**
4. Watch the mock analysis complete in 2.5 seconds
5. Results will show simulated pneumonia classification

Once you upgrade to full-stack and add your AI code, this will show real results!

---

## Questions?

- Check `python_backend/README.md` for detailed backend structure
- See `client/src/lib/api.ts` for expected API contract
- Review `inference_template.py` for function signatures
