import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import normalXray from "@assets/generated_images/normal_chest_x-ray.png";
import pneumoniaXray from "@assets/generated_images/chest_x-ray_with_pneumonia.png";
import viralXray from "@assets/generated_images/chest_x-ray_with_viral_pattern.png";

export default function Models() {
  const models = [
    {
      id: "normal",
      title: "Healthy Control",
      image: normalXray,
      type: "Baseline",
      description: "Clear lung fields with no opacities. Costophrenic angles are sharp. Cardiac silhouette is normal size.",
      features: ["Clear lung parenchyma", "Normal vascular markings", "Sharp diaphragm"]
    },
    {
      id: "bacterial",
      title: "Lobar Pneumonia",
      image: pneumoniaXray,
      type: "Bacterial Phenotype",
      description: "Dense consolidation visible in the right lower lobe. Air bronchograms present indicating alveolar process.",
      features: ["Focal consolidation", "Lobar distribution", "Air bronchograms"]
    },
    {
      id: "viral",
      title: "Viral Pneumonia",
      image: viralXray,
      type: "Viral Phenotype",
      description: "Diffuse interstitial infiltrates bilaterally. 'Ground glass' appearance typical of viral etiologies.",
      features: ["Diffuse distribution", "Interstitial pattern", "Ground glass opacity"]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Model Library</h1>
          <p className="text-muted-foreground text-lg">
            Reference cases showing how our AI identifies different pneumonia phenotypes.
            These verified examples demonstrate the system's capability to distinguish between subtle variances in pathology.
          </p>
        </div>

        <Tabs defaultValue="bacterial" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
            {models.map((model) => (
              <TabsTrigger 
                key={model.id} 
                value={model.id}
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                {model.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {models.map((model) => (
            <TabsContent key={model.id} value={model.id} className="mt-8">
              <Card className="border-white/10 bg-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image Side */}
                  <div className="relative group bg-black/40 min-h-[400px] p-4 flex items-center justify-center">
                    <img 
                      src={model.image} 
                      alt={model.title} 
                      className="max-h-[350px] object-contain rounded-md shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    
                    {/* Simulated Heatmap overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      {model.id === "bacterial" && (
                        <div className="absolute top-[55%] left-[25%] w-32 h-32 bg-red-500/30 blur-[40px] rounded-full" />
                      )}
                      {model.id === "viral" && (
                         <>
                          <div className="absolute top-[40%] left-[30%] w-40 h-40 bg-amber-500/20 blur-[50px] rounded-full" />
                          <div className="absolute top-[45%] right-[30%] w-32 h-32 bg-amber-500/20 blur-[50px] rounded-full" />
                         </>
                      )}
                      <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded-full text-xs font-mono text-white backdrop-blur-sm border border-white/10">
                        Attention Map
                      </div>
                    </div>
                  </div>

                  {/* Info Side */}
                  <div className="p-8 space-y-6 flex flex-col justify-center border-l border-white/5">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="border-primary/50 text-primary">
                          {model.type}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">CONFIDENCE: 98.2%</span>
                      </div>
                      <CardTitle className="text-2xl mb-2">{model.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {model.description}
                      </CardDescription>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Distinctive Features</h4>
                      <ul className="space-y-2">
                        {model.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm bg-white/5 p-2 rounded border border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
