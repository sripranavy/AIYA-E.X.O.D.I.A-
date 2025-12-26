import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Activity, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroBg from "@assets/generated_images/abstract_medical_interface_background_with_data_points.png";

export default function Home() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Medical Tech Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Next Gen Diagnostics
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Beyond Binary <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                Classification
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Identify and characterize diverse pneumonia phenotypes with advanced AI. 
              Detect borderline conditions, assess severity, and track progression patterns instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/analysis">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 px-8">
                  Start Analysis <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/models">
                <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 h-12 px-8">
                  View Model Library
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="relative hidden lg:block"
          >
            <div className="relative glass-panel rounded-xl p-1 tech-border">
              <div className="absolute -inset-1 bg-primary/20 blur-xl -z-10 rounded-full opacity-20" />
              <div className="aspect-[4/3] rounded-lg bg-black/50 overflow-hidden relative">
                 <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20">
                    {[...Array(36)].map((_, i) => (
                      <div key={i} className="border-[0.5px] border-primary/30" />
                    ))}
                 </div>
                 {/* Decorative scanning line */}
                 <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-primary/50 blur-[2px] z-20 shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                 />
                 <div className="p-8 flex items-center justify-center h-full text-primary/40 font-mono text-sm">
                    AWAITING INPUT STREAM...
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-card/30 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Activity}
              title="Phenotype Characterization"
              description="Goes beyond present/absent. Classify specific pneumonia types (Viral, Bacterial) and infection patterns."
            />
            <FeatureCard 
              icon={Zap}
              title="Severity Assessment"
              description="Quantitative analysis of infection severity to help triage critical cases faster."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Precision Localization"
              description="Advanced heatmap overlays pinpoint exactly where the abnormality is located in the chest cavity."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 rounded-xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
