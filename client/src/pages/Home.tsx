import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Activity, ShieldCheck, Zap, Sparkles, Brain, Zap as ZapIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroBg from "@assets/generated_images/abstract_medical_interface_background_with_data_points.png";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen pt-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Medical Tech Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
          
          {/* Animated Gradient Orbs */}
          <motion.div
            animate={{
              x: mousePosition.x * 0.05,
              y: mousePosition.y * 0.05,
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] opacity-40"
          />
          <motion.div
            animate={{
              x: -mousePosition.x * 0.03,
              y: -mousePosition.y * 0.03,
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px] opacity-40"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-wider w-fit">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              Next Generation AI Diagnostics
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-tight">
                E.X.O.D.I.A
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-muted-foreground">
                Electronic X-ray <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-blue-500">
                  Observation & Diagnostic <br /> Inference Analytics
                </span>
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Advanced AI-powered pneumonia detection and phenotyping. Beyond binary classification—using unsupervised learning to identify diverse pneumonia subtypes, assess severity, and localize findings with precision.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/analysis">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 px-8 text-base gap-2">
                    <Sparkles className="w-5 h-5" />
                    Start Analysis
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/education">
                  <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 h-14 px-8 text-base font-semibold">
                    Learn About Pneumonia
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">98%</p>
                <p className="text-xs text-muted-foreground">Detection Accuracy</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-cyan-400">4</p>
                <p className="text-xs text-muted-foreground">Phenotypes Identified</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-400">&lt;2s</p>
                <p className="text-xs text-muted-foreground">Analysis Time</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual - Interactive Scanner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-primary/20 opacity-50"
              />

              {/* Middle Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-primary/30 opacity-70"
              />

              {/* Scanner Panel */}
              <div className="relative glass-panel rounded-2xl p-2 tech-border">
                <div className="absolute -inset-1 bg-primary/20 blur-2xl -z-10 rounded-full opacity-30" />
                
                <div className="aspect-[4/3] rounded-xl bg-black/50 overflow-hidden relative border border-white/5">
                  {/* Grid */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10">
                    {[...Array(64)].map((_, i) => (
                      <div key={i} className="border-[0.5px] border-primary/30" />
                    ))}
                  </div>

                  {/* Scanning Animations */}
                  <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm z-20"
                  />

                  {/* Pulsing Centers */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-1/3 left-1/3 w-8 h-8 rounded-full border-2 border-primary/60 bg-primary/10"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full border-2 border-cyan-400/60 bg-cyan-400/10"
                  />

                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center mb-4"
                    >
                      <Brain className="w-8 h-8 text-primary" />
                    </motion.div>
                    <p className="text-primary/60 font-mono text-xs tracking-widest">AI READY</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-card/30 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Capabilities</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Advanced AI analysis powered by clustering and phenotype characterization
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Phenotype Detection"
              description="Identifies bacterial, viral, fungal, and atypical pneumonia patterns. Goes beyond binary classification to characterize diverse subtypes."
              delay={0}
            />
            <FeatureCard
              icon={Activity}
              title="Severity Grading"
              description="Quantifies infection severity from mild to critical. Helps with rapid triage and clinical decision-making."
              delay={0.1}
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Anatomical Localization"
              description="Pinpoints exact regions of pneumonia in the chest. Heatmap overlays show affected areas with precision."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-cyan-400/5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Analyze?
            </h2>
            <p className="text-xl text-muted-foreground">
              Upload an X-ray image to see E.X.O.D.I.A's AI analysis in action. Understand pneumonia phenotypes at a new level of detail.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/analysis">
                <Button size="lg" className="bg-gradient-to-r from-primary to-cyan-400 hover:from-primary/90 hover:to-cyan-400/90 text-background font-bold h-16 px-12 text-lg gap-2">
                  <Sparkles className="w-6 h-6" />
                  Start Analysis Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: any;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="p-6 rounded-xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-300 h-full hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-400/20 flex items-center justify-center text-primary mb-4 group-hover:scale-125 transition-transform">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
