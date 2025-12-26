import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, AlertCircle, CheckCircle2, FileText, ScanLine, Activity, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analyzeXray } from "@/lib/api";

// Mock types for our analysis
type AnalysisResult = {
  probability: number;
  phenotype: "Bacterial" | "Viral" | "Normal" | "Fungal";
  severity: "Low" | "Moderate" | "Critical";
  findings: string[];
  heatmapPoints: { x: number; y: number; intensity: number }[];
};

export default function Analysis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setResult(null);
    }
  };

  const startAnalysis = async () => {
    if (!fileInputRef.current?.files?.[0]) return;
    
    setIsAnalyzing(true);
    try {
      // ============================================================
      // BUTTON → API CHAIN (Connected to Python AI Model)
      // ============================================================
      // 1. User clicks "Analyze Scan" button below
      // 2. This function runs and extracts the uploaded X-ray image
      // 3. Calls analyzeXray() from @/lib/api.ts
      // 4. In production, this sends: POST /api/analyze with image
      // 5. Python backend receives request:
      //    - Runs inference_template.py
      //    - Performs clustering (unsupervised learning)
      //    - Classifies pneumonia phenotype
      //    - Generates heatmap regions
      // 6. Returns AI analysis results
      // 7. Results displayed in the Diagnostic Report panel
      // ============================================================
      
      const imageFile = fileInputRef.current.files[0];
      const analysisResult = await analyzeXray(imageFile);
      
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
      // TODO: Show error message to user when backend integration complete
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Panel - Image Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-white/10 rounded-xl overflow-hidden min-h-[500px] relative flex flex-col">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div className="flex items-center gap-2">
                <ScanLine className="text-primary w-5 h-5" />
                <h2 className="font-semibold text-foreground">Radiograph Input</h2>
              </div>
              {selectedImage && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetAnalysis}
                  className="text-muted-foreground hover:text-destructive"
                  disabled={isAnalyzing}
                >
                  <X className="w-4 h-4 mr-1" /> Clear
                </Button>
              )}
            </div>

            <div className="flex-1 relative bg-black/40 flex items-center justify-center">
              {!selectedImage ? (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 m-4 rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-foreground">Upload X-ray Image</p>
                  <p className="text-sm text-muted-foreground mt-2">Drag & drop or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-8 bg-white/5 px-3 py-1 rounded-full">
                    Supported: DICOM, PNG, JPG
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img 
                    src={selectedImage} 
                    alt="X-ray Analysis" 
                    className="max-h-[600px] w-auto object-contain rounded-md shadow-2xl"
                  />
                  
                  {/* Scanning Animation Overlay */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(45,212,191,0.8)]"
                      />
                      <div className="absolute inset-0 bg-primary/5" />
                    </div>
                  )}

                  {/* Heatmap Overlay (Mock) */}
                  {result && result.probability > 30 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    >
                      <div className="absolute w-[30%] h-[30%] bg-red-500/40 blur-[80px] rounded-full top-[30%] left-[55%]" />
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end">
              <Button 
                size="lg" 
                onClick={startAnalysis}
                disabled={!selectedImage || isAnalyzing || !!result}
                className={cn(
                  "font-semibold min-w-[150px]",
                  isAnalyzing ? "cursor-wait" : ""
                )}
              >
                {isAnalyzing ? "Processing..." : result ? "Analysis Complete" : "Analyze Scan"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="space-y-6">
          <div className="bg-card border border-white/10 rounded-xl p-6 h-full min-h-[500px] flex flex-col">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="text-primary" /> Diagnostic Report
            </h3>

            {!result && !isAnalyzing && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground opacity-50 space-y-4">
                <Brain className="w-16 h-16 stroke-1" />
                <p>Upload an X-ray image and run analysis to view detailed phenotype characterization.</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-primary font-bold">
                    AI
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-sm text-primary animate-pulse">Running Neural Network...</p>
                  <p className="text-xs text-muted-foreground">Extracting features layer 4/12</p>
                </div>
              </div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Probability Score */}
                <div className="p-4 rounded-lg bg-black/20 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Pneumonia Probability</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      result.probability > 50 
                        ? "bg-red-500/10 border-red-500/30 text-red-400" 
                        : "bg-green-500/10 border-green-500/30 text-green-400"
                    )}>
                      {result.probability > 50 ? "DETECTED" : "LOW RISK"}
                    </span>
                  </div>
                  <div className="text-4xl font-mono font-bold text-foreground">
                    {result.probability}%
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.probability}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={cn(
                        "h-full rounded-full",
                        result.probability > 50 ? "bg-red-500" : "bg-green-500"
                      )}
                    />
                  </div>
                </div>

                {/* Classification */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Classification</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded bg-white/5 border border-white/5">
                      <div className="text-xs text-muted-foreground mb-1">Phenotype</div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        {result.phenotype}
                      </div>
                    </div>
                    <div className="p-3 rounded bg-white/5 border border-white/5">
                      <div className="text-xs text-muted-foreground mb-1">Severity</div>
                      <div className={cn(
                        "font-semibold flex items-center gap-2",
                        result.severity === "Critical" ? "text-red-400" : 
                        result.severity === "Moderate" ? "text-amber-400" : "text-green-400"
                      )}>
                        {result.severity}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Findings</h4>
                  <ul className="space-y-2">
                    {result.findings.map((finding, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="text-sm flex items-start gap-2 p-2 rounded hover:bg-white/5 transition-colors"
                      >
                        {result.probability > 50 ? (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-foreground/90">{finding}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                   <Button variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary">
                     <FileText className="w-4 h-4" /> Export Full Report
                   </Button>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
