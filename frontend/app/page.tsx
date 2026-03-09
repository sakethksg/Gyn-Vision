'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { ArrowRight, Brain, Video, Image as ImageIcon, Zap, Shield, Gauge } from 'lucide-react';
import DarkVeil from '@/components/DarkVeil';

const features = [
  {
    icon: Brain,
    title: 'Multiple AI Models',
    description: 'Choose from SegFormer B0, B1, or B2 models optimized for different speed-accuracy trade-offs.',
  },
  {
    icon: ImageIcon,
    title: 'Image Segmentation',
    description: 'Upload surgical images and get detailed segmentation masks with anatomical structures highlighted.',
  },
  {
    icon: Video,
    title: 'Video Processing',
    description: 'Process entire surgical videos with frame-by-frame segmentation and overlay visualization.',
  },
  {
    icon: Gauge,
    title: 'Real-time Statistics',
    description: 'Get instant area percentage calculations and presence detection for each anatomical structure.',
  },
  {
    icon: Zap,
    title: 'Fast Processing',
    description: 'Optimized ONNX runtime ensures quick inference with minimal latency for clinical workflows.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'All processing happens locally on your server. No data is stored or transmitted to external services.',
  },
];

const stats = [
  { value: '4', label: 'Anatomical Classes' },
  { value: '3', label: 'AI Models' },
  { value: '2', label: 'Input Modes' },
  { value: '100%', label: 'Local Processing' },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12">
        {/* DarkVeil WebGL background */}
        <div className="absolute inset-0 -z-10">
          <DarkVeil
            hueShift={0}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0}
            warpAmount={0}
          />
        </div>
        {/* Fade bottom edge into page */}
        <div className="absolute bottom-0 left-0 right-0 h-40 -z-10 bg-gradient-to-t from-background to-transparent" />

        <div className="container mx-auto px-6 relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glow-border text-sm transition-all duration-200">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground/80">AI-Powered Clinical Segmentation</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-balance">
              <span className="glow-text">Gyn-Vision</span>
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-3 bg-linear-to-r from-primary via-[oklch(0.65_0.17_240)] to-[oklch(0.55_0.18_310)] bg-clip-text text-transparent">
                Laparoscopic Precision
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed text-balance">
              Advanced deep learning for anatomical segmentation.
              Analyze the uterus, fallopian tubes, and ovaries with clinical-grade accuracy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/segmentation">
                <Button size="lg" className="text-lg px-8 h-14 rounded-xl glow-cyan hover:-translate-y-0.5 transition-all duration-300">
                  Start Segmentation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-xl glass hover:-translate-y-0.5 transition-all duration-300 border-white/10 hover:border-white/20">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,oklch(0.12_0.02_260),transparent)]" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for accurate medical image segmentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden glass-card border-white/[0.06] hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_oklch(0.72_0.19_220_/_0.1)]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                  <feature.icon className="w-full h-full" />
                </div>
                <div className="relative p-8">
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
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
              {stats.map((stat) => (
                <Card key={stat.label} className="p-6 text-center glass-card border-white/[0.06] hover:border-primary/20 transition-all duration-300">
                  <div className="text-3xl font-bold text-primary mb-2 glow-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 blur-[120px] rounded-full" />
        </div>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the power of AI-assisted medical image segmentation
          </p>
          <Link href="/segmentation">
            <Button size="lg" className="text-lg px-10 glow-cyan hover:scale-105 transition-all duration-300">
              Start Segmentation Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-12 glass">
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
                <li><Link href="/segmentation" className="hover:text-primary transition-colors duration-300">Segmentation Tool</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors duration-300">Features</Link></li>
                <li><Link href="#about" className="hover:text-primary transition-colors duration-300">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Technology</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>SegFormer Architecture</li>
                <li>ONNX Runtime</li>
                <li>Next.js &amp; FastAPI</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/[0.06] text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Gynecology Laparoscopic Segmentation System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
