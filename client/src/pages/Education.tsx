import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Worm, Rat, Zap, Wind } from "lucide-react";

export default function Education() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight">
            Understanding <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Pneumonia</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive guide to pneumonia diagnosis, classification, and clinical assessment
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="what" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
            <TabsTrigger 
              value="what"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              What Is It
            </TabsTrigger>
            <TabsTrigger 
              value="causes"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Causes
            </TabsTrigger>
            <TabsTrigger 
              value="severity"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Severity
            </TabsTrigger>
            <TabsTrigger 
              value="phenotypes"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Phenotypes
            </TabsTrigger>
          </TabsList>

          {/* What is Pneumonia */}
          <TabsContent value="what" className="mt-8 space-y-6">
            <Card className="border-white/10 bg-card">
              <CardHeader>
                <CardTitle className="text-2xl">What is Pneumonia?</CardTitle>
                <CardDescription className="text-base">
                  An infection of the lungs that causes inflammation and fluid accumulation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-lg bg-black/20 border border-white/5 space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Wind className="text-primary" /> Normal Lungs
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✓ Air sacs (alveoli) fill with oxygen</li>
                      <li>✓ Oxygen transfers to bloodstream</li>
                      <li>✓ Carbon dioxide removed</li>
                      <li>✓ Clear on X-ray imaging</li>
                    </ul>
                  </div>
                  
                  <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/20 space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <AlertCircle className="text-red-400" /> Pneumonia
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✗ Air sacs fill with fluid/pus</li>
                      <li>✗ Oxygen transfer impaired</li>
                      <li>✗ Breathing becomes difficult</li>
                      <li>✗ Visible as opacity on X-ray</li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-white/5 border border-white/10 space-y-3">
                  <h4 className="font-bold">Key Characteristics:</h4>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li>• <strong>Infection:</strong> Caused by bacteria, viruses, or fungi</li>
                    <li>• <strong>Inflammation:</strong> Body's immune response causes swelling</li>
                    <li>• <strong>Consolidation:</strong> Air spaces fill with fluid/pus instead of air</li>
                    <li>• <strong>Symptoms:</strong> Cough, fever, chest pain, difficulty breathing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Causes */}
          <TabsContent value="causes" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bacterial */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                <Card className="border-white/10 bg-card h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Rat className="text-amber-400" />
                      </div>
                      <CardTitle>Bacterial</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Caused by pathogenic bacteria such as <em>Streptococcus pneumoniae</em>, <em>Haemophilus influenzae</em>, or <em>Legionella</em>.
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold">Common Sources:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Respiratory droplets</li>
                        <li>• Air contamination</li>
                        <li>• Healthcare settings</li>
                        <li>• Weakened immunity</li>
                      </ul>
                    </div>
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs font-mono text-amber-300">Most common in adults</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Viral */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-white/10 bg-card h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Worm className="text-blue-400" />
                      </div>
                      <CardTitle>Viral</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Caused by viruses like Influenza, RSV, COVID-19, or Coronavirus. Often less severe than bacterial.
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold">Common Sources:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Respiratory droplets</li>
                        <li>• Close contact</li>
                        <li>• Seasonal outbreaks</li>
                        <li>• Community transmission</li>
                      </ul>
                    </div>
                    <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                      <p className="text-xs font-mono text-blue-300">Most common in children</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Fungal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-white/10 bg-card h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <AlertCircle className="text-green-400" />
                      </div>
                      <CardTitle>Fungal</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Caused by fungi like <em>Candida</em>, <em>Aspergillus</em>, or <em>Cryptococcus</em>. Rare but serious.
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold">Common Sources:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Immunocompromised state</li>
                        <li>• Environmental exposure</li>
                        <li>• Hospital-acquired</li>
                        <li>• Soil/water exposure</li>
                      </ul>
                    </div>
                    <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                      <p className="text-xs font-mono text-green-300">Requires antifungal treatment</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Severity */}
          <TabsContent value="severity" className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Low */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0 }}
              >
                <Card className="border-green-500/30 bg-green-500/5 overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Mild</Badge>
                        Low Severity
                      </CardTitle>
                      <span className="text-xs font-mono text-muted-foreground">30-40% affected</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm">
                        <p className="text-muted-foreground font-mono text-xs mb-1">Symptoms</p>
                        <p className="text-foreground">Mild cough, low fever, minimal SOB</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground font-mono text-xs mb-1">X-ray Findings</p>
                        <p className="text-foreground">Localized infiltrates, one lobe</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Moderate */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-amber-500/30 bg-amber-500/5 overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Moderate</Badge>
                        Moderate Severity
                      </CardTitle>
                      <span className="text-xs font-mono text-muted-foreground">40-70% affected</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm">
                        <p className="text-muted-foreground font-mono text-xs mb-1">Symptoms</p>
                        <p className="text-foreground">Productive cough, high fever, dyspnea</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground font-mono text-xs mb-1">X-ray Findings</p>
                        <p className="text-foreground">Multi-lobar, possible pleural effusion</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Critical */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-red-500/30 bg-red-500/5 overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>
                        Critical Severity
                      </CardTitle>
                      <span className="text-xs font-mono text-muted-foreground">70%+ affected</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm">
                        <p className="text-muted-foreground font-mono text-xs mb-1">Symptoms</p>
                        <p className="text-foreground">Severe dyspnea, hypoxia, sepsis risk</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground font-mono text-xs mb-1">X-ray Findings</p>
                        <p className="text-foreground">Bilateral consolidation, ARDS patterns</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Phenotypes */}
          <TabsContent value="phenotypes" className="mt-8 space-y-6">
            <div className="prose prose-invert max-w-none">
              <Card className="border-white/10 bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl">Pneumonia Phenotypes</CardTitle>
                  <CardDescription className="text-base">
                    Beyond binary classification: Understanding pneumonia subtypes through clustering and characterization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  {/* Lobar Pneumonia */}
                  <div className="border-l-4 border-primary pl-6 space-y-3">
                    <h3 className="text-xl font-bold">Lobar Pneumonia</h3>
                    <p className="text-muted-foreground">
                      Classically caused by <em>Streptococcus pneumoniae</em>. Consolidation follows lung anatomy with clear lobar boundaries.
                    </p>
                    <div className="bg-black/20 p-4 rounded text-sm space-y-2">
                      <p><strong>Radiographic Features:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Dense consolidation with sharp borders</li>
                        <li>Confined to one or more lobes</li>
                        <li>Air bronchograms visible</li>
                        <li>Progression from consolidation to resolution</li>
                      </ul>
                    </div>
                  </div>

                  {/* Bronchopneumonia */}
                  <div className="border-l-4 border-cyan-400 pl-6 space-y-3">
                    <h3 className="text-xl font-bold">Bronchopneumonia</h3>
                    <p className="text-muted-foreground">
                      Diffuse inflammation originating in bronchi. Often multifocal and bilateral, particularly in children or elderly.
                    </p>
                    <div className="bg-black/20 p-4 rounded text-sm space-y-2">
                      <p><strong>Radiographic Features:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Bilateral, patchy infiltrates</li>
                        <li>Peribroncial distribution</li>
                        <li>No clear lobar pattern</li>
                        <li>Often with prominent interstitial markings</li>
                      </ul>
                    </div>
                  </div>

                  {/* Atypical/Interstitial */}
                  <div className="border-l-4 border-blue-400 pl-6 space-y-3">
                    <h3 className="text-xl font-bold">Atypical/Interstitial Pneumonia</h3>
                    <p className="text-muted-foreground">
                      Viral pneumonia pattern with interstitial inflammation. Ground-glass opacities and diffuse markings without consolidation.
                    </p>
                    <div className="bg-black/20 p-4 rounded text-sm space-y-2">
                      <p><strong>Radiographic Features:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Ground-glass opacities</li>
                        <li>Interstitial thickening</li>
                        <li>Bilateral involvement</li>
                        <li>Lack of consolidation</li>
                      </ul>
                    </div>
                  </div>

                  {/* Aspiration */}
                  <div className="border-l-4 border-amber-400 pl-6 space-y-3">
                    <h3 className="text-xl font-bold">Aspiration Pneumonia</h3>
                    <p className="text-muted-foreground">
                      Results from inhalation of foreign material or secretions. Distribution depends on patient position during aspiration.
                    </p>
                    <div className="bg-black/20 p-4 rounded text-sm space-y-2">
                      <p><strong>Radiographic Features:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Right lung or lower lobes predominantly</li>
                        <li>Dependent position distribution</li>
                        <li>Mixed consolidation/atelectasis</li>
                        <li>May have air-fluid levels</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 rounded-lg bg-primary/10 border border-primary/20 space-y-3">
                    <p className="text-sm text-foreground">
                      <strong>E.X.O.D.I.A Advantage:</strong> Rather than simple presence/absence classification, our AI uses unsupervised clustering to identify these nuanced phenotypes automatically, enabling more precise clinical decision-making and personalized treatment strategies.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
