'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { ArrowRight, Brain, Video, Image as ImageIcon, Zap, Shield, Gauge } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-24 pb-12">
        {/* Modern Grid Background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Soft Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[100px] rounded-full -z-10 pointer-events-none" />
        
        {/* Additional Animated Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/80 backdrop-blur-md text-sm shadow-sm transition-all duration-200">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground/80">AI-Powered Clinical Segmentation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-balance">
              Gyn-Vision
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-3 bg-linear-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                Laparoscopic Precision
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed text-balance">
              Advanced deep learning for anatomical segmentation. 
              Analyze the uterus, fallopian tubes, and ovaries with clinical-grade accuracy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/segmentation">
                <Button size="lg" className="text-lg px-8 h-14 rounded-xl shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200">
                  Start Segmentation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-xl shadow-sm hover:bg-muted/50 hover:-translate-y-0.5 transition-all duration-200 glass">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating Glass Card Comparison */}
          <div className="max-w-5xl mx-auto mt-20 relative perspective-1000">
            <div className="absolute -inset-1 bg-linear-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative glass-card rounded-2xl p-2 md:p-3 overflow-hidden shadow-2xl border-white/20 transform transition-transform duration-500 hover:scale-[1.01]">
              <div className="bg-muted/20 rounded-xl overflow-hidden shadow-inner flex flex-col md:flex-row border border-border/50">
                {/* Original View Mockup */}
                <div className="w-full md:w-1/2 p-4 md:p-6 border-b md:border-b-0 md:border-r border-border/50 flex flex-col items-center justify-center min-h-[250px] md:min-h-[360px] relative bg-background">
                  <div className="absolute top-4 left-4 px-2.5 py-1 text-xs font-semibold tracking-wider rounded-md bg-background/80 backdrop-blur-md border border-border/50 shadow-sm text-muted-foreground z-10">
                    ORIGINAL
                  </div>
                  <div className="w-4/5 h-4/5 min-h-[220px] rounded-lg border-2 border-dashed border-muted flex items-center justify-center opacity-70">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                </div>
                {/* Segmented View Mockup */}
                <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col items-center justify-center min-h-[250px] md:min-h-[360px] relative bg-background/50">
                  <div className="absolute top-4 left-4 px-2.5 py-1 text-xs font-semibold tracking-wider rounded-md bg-primary/10 border border-primary/20 text-primary shadow-sm z-10 flex items-center gap-1.5 glass">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    SEGMENTED
                  </div>
                  <div className="w-4/5 h-4/5 min-h-[220px] rounded-lg border-2 border-primary/20 bg-primary/5 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] opacity-30"></div>
                    <Brain className="w-12 h-12 text-primary/70 relative z-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for accurate medical image segmentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                <Brain className="w-full h-full" />
              </div>
              <div className="relative p-8">
                <h3 className="text-xl font-bold mb-3">Multiple AI Models</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose from SegFormer B0, B1, or B2 models optimized for different speed-accuracy trade-offs.
                </p>
              </div>
            </Card>

            {/* Feature Card 2 */}
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                <ImageIcon className="w-full h-full" />
              </div>
              <div className="relative p-8">
                <h3 className="text-xl font-bold mb-3">Image Segmentation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload surgical images and get detailed segmentation masks with anatomical structures highlighted.
                </p>
              </div>
            </Card>

            {/* Feature Card 3 */}
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                <Video className="w-full h-full" />
              </div>
              <div className="relative p-8">
                <h3 className="text-xl font-bold mb-3">Video Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Process entire surgical videos with frame-by-frame segmentation and overlay visualization.
                </p>
              </div>
            </Card>

            {/* Feature Card 4 */}
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                <Gauge className="w-full h-full" />
              </div>
              <div className="relative p-8">
                <h3 className="text-xl font-bold mb-3">Real-time Statistics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant area percentage calculations and presence detection for each anatomical structure.
                </p>
              </div>
            </Card>

            {/* Feature Card 5 */}
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-full h-full" />
              </div>
              <div className="relative p-8">
                <h3 className="text-xl font-bold mb-3">Fast Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Optimized ONNX runtime ensures quick inference with minimal latency for clinical workflows.
                </p>
              </div>
            </Card>

            {/* Feature Card 6 */}
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="w-full h-full" />
              </div>
              <div className="relative p-8">
                <h3 className="text-xl font-bold mb-3">Privacy First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All processing happens locally on your server. No data is stored or transmitted to external services.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">About This System</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  This segmentation system leverages cutting-edge deep learning technology to assist medical 
                  professionals in analyzing laparoscopic surgical imagery. Built on the SegFormer architecture, 
                  our models provide accurate semantic segmentation of key anatomical structures.
                </p>
                <p>
                  The system identifies four primary classes: background, uterus, fallopian tubes, and ovaries, 
                  with color-coded visualization for easy interpretation. Whether you&apos;re analyzing single images 
                  or full surgical videos, our tool provides consistent, reliable results.
                </p>
                <p>
                  Designed with clinical workflows in mind, the interface is intuitive and efficient, allowing 
                  healthcare professionals to focus on patient care rather than complex software operations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center border-2">
                <div className="text-3xl font-bold text-primary mb-2">4</div>
                <div className="text-sm text-muted-foreground">Anatomical Classes</div>
              </Card>
              <Card className="p-6 text-center border-2">
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <div className="text-sm text-muted-foreground">AI Models</div>
              </Card>
              <Card className="p-6 text-center border-2">
                <div className="text-3xl font-bold text-primary mb-2">2</div>
                <div className="text-sm text-muted-foreground">Input Modes</div>
              </Card>
              <Card className="p-6 text-center border-2">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Local Processing</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the power of AI-assisted medical image segmentation
          </p>
          <Link href="/segmentation">
            <Button size="lg" className="text-lg px-10">
              Start Segmentation Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Laparoscopic Segmentation</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered medical imaging analysis for gynecological surgery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/segmentation" className="hover:text-primary transition-colors">Segmentation Tool</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#about" className="hover:text-primary transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Technology</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>SegFormer Architecture</li>
                <li>ONNX Runtime</li>
                <li>Next.js & FastAPI</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Gynecology Laparoscopic Segmentation System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
