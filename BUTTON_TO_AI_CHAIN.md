# Start Analysis Button → Python AI Chain

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE BUTTON CHAIN                               │
└─────────────────────────────────────────────────────────────────────────────┘

FRONTEND (React/TypeScript)
═════════════════════════════

1️⃣  User clicks "Analyze Scan" button
    Location: client/src/pages/Analysis.tsx (line ~228)
    
    <Button 
      onClick={startAnalysis}  ← THIS TRIGGER
      disabled={!selectedImage || isAnalyzing || !!result}
    >
      {isAnalyzing ? "Processing..." : "Analyze Scan"}
    </Button>

        ↓↓↓ BUTTON CLICKED ↓↓↓

2️⃣  startAnalysis() function executes
    Location: client/src/pages/Analysis.tsx (line ~45)
    
    const startAnalysis = async () => {
      // Extracts selected X-ray image file
      const imageFile = fileInputRef.current.files[0];
      
      // Shows "Processing..." message and spinner
      setIsAnalyzing(true);
      
      // CALLS THE API FUNCTION ↓
      const analysisResult = await analyzeXray(imageFile);
      
      // Displays results ↓
      setResult(analysisResult);
    };

        ↓↓↓ API CALL ↓↓↓

3️⃣  analyzeXray(imageFile) function
    Location: client/src/lib/api.ts (line ~57)
    
    Currently MOCKED (shows fake results in 2.5 seconds)
    
    export async function analyzeXray(imageFile: File) {
      // Currently returns mock data
      return mockAnalysisResult;
    }
    
    ⚠️  UPGRADE NOTE:
    This function will be replaced with:
    
    export async function analyzeXray(imageFile: File) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      return response.json();
    }

        ↓↓↓ HTTP POST REQUEST ↓↓↓

4️⃣  Backend API Endpoint (After Full-Stack Upgrade)
    Endpoint: POST /api/analyze
    Location: server/routes.ts (to be created)
    
    This endpoint will:
    - Receive the X-ray image file
    - Extract it to a temporary location
    - Call your Python inference function
    
    router.post('/api/analyze', async (req, res) => {
      const imageFile = req.file;  // Uploaded X-ray
      
      // CALLS PYTHON FUNCTION ↓
      const result = pythonBackend.analyze_xray(imagePath);
      
      res.json(result);
    });

        ↓↓↓ PYTHON FUNCTION CALL ↓↓↓

5️⃣  Python AI Model - analyze_xray() Function
    Location: python_backend/inference.py (line ~137)
    
    def analyze_xray(image_path: str) -> Dict:
        """
        THIS IS WHERE YOUR AI RUNS
        """
        # 1. Load image from path
        image = preprocess_image(image_path)
        
        # 2. Extract features
        features = feature_extractor.predict(image)
        
        # 3. UNSUPERVISED CLUSTERING (subphenotype detection)
        clusters = clustering_model.predict(features)
        
        # 4. CLASSIFICATION (phenotype detection)
        classification = classifier.predict(features)
        phenotype = classify_phenotype(classification)  # Bacterial/Viral/Fungal/Normal
        
        # 5. SEVERITY ASSESSMENT
        severity = assess_severity(classification, clusters)  # Low/Moderate/Critical
        
        # 6. HEATMAP LOCALIZATION (where pneumonia is in chest)
        heatmap = generate_heatmap(image, features)
        
        # 7. RETURN RESULTS
        return {
            "probability": 85.5,
            "phenotype": "Bacterial",
            "severity": "Moderate",
            "findings": ["Consolidation in right lower lobe", ...],
            "heatmap_regions": [{"x": 45, "y": 60, "intensity": 0.9}, ...]
        }

        ↓↓↓ RETURN JSON RESPONSE ↓↓↓

6️⃣  Backend Returns Results to Frontend
    Response: JSON with analysis results
    
    {
      "probability": 85,
      "phenotype": "Bacterial",
      "severity": "Moderate",
      "findings": ["Opacity in lower right lobe", ...],
      "heatmap_regions": [...]
    }

        ↓↓↓ RESPONSE RECEIVED ↓↓↓

7️⃣  Frontend Displays Results
    Location: client/src/pages/Analysis.tsx (line ~168+)
    
    setResult(analysisResult);
    
    The Analysis component automatically renders:
    - Probability percentage with progress bar
    - Phenotype classification (Bacterial/Viral/Fungal/Normal)
    - Severity level (Low/Moderate/Critical)
    - AI Findings list
    - Heatmap overlay on the X-ray image
    
    User sees the complete diagnostic report!

```

## File Reference Quick Link

| Layer | File | Line | Component |
|-------|------|------|-----------|
| **UI Button** | `client/src/pages/Analysis.tsx` | ~228 | `<Button onClick={startAnalysis}>` |
| **Handler** | `client/src/pages/Analysis.tsx` | ~45 | `startAnalysis()` function |
| **API Client** | `client/src/lib/api.ts` | ~57 | `analyzeXray(imageFile)` |
| **Backend Route** | `server/routes.ts` | TBD | `POST /api/analyze` (create when upgrading) |
| **Python Function** | `python_backend/inference.py` | ~137 | `analyze_xray(image_path)` |
| **AI Model Class** | `python_backend/inference.py` | ~16 | `PneumoniaAnalyzer` class |

## When Your Python AI Code Is Ready

### Step 1: Extract Your Model Files
```
python_backend/
├── models/
│   ├── clustering_model.pkl      ← Your unsupervised learning model
│   ├── classifier_model.h5       ← Your classification model  
│   └── feature_extractor.pkl     ← Feature extraction model
├── inference.py                  ← Replace template with your code
├── preprocessing.py              ← Your preprocessing utilities
├── requirements.txt              ← Your dependencies
└── config.py                     ← Configuration
```

### Step 2: Implement the analyze_xray() Function
Use the template in `python_backend/inference_template.py` as a guide. Your function must:
- Accept `image_path: str` parameter
- Return a dict with keys: `probability`, `phenotype`, `severity`, `findings`, `heatmap_regions`
- Perform unsupervised clustering for subphenotype detection

### Step 3: Upgrade to Full-Stack
Request the conversion from mockup to full-stack application

### Step 4: Create Backend Endpoint
Add this to `server/routes.ts`:
```typescript
import multer from 'multer';
import { analyzeXray } from '../python_backend/inference';

const upload = multer({ dest: 'uploads/' });

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    const result = analyzeXray(req.file.path);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 5: Update Frontend API Client
Replace mock in `client/src/lib/api.ts`:
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

## Summary

✅ **Button is configured** - Clicks trigger `startAnalysis()`  
✅ **API client is ready** - `analyzeXray()` prepared for backend  
✅ **Python function placeholder exists** - `analyze_xray()` template created  
✅ **Integration points are documented** - Clear chain from UI to AI  

**All you need to do:** Replace the Python template with your actual clustering and classification model!
