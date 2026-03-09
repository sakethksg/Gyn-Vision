'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
          <div className="max-w-3xl mx-auto text-center space-y-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.12] bg-white/[0.05] backdrop-blur-sm text-sm">
              <Zap className="h-3.5 w-3.5 text-white/70" />
              <span className="font-medium text-white/70">AI-Powered Clinical Segmentation</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white text-balance">
              Gyn-Vision<br />
              <span className="text-white">Laparoscopic Precision</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Advanced deep learning for anatomical segmentation.
              Analyze the uterus, fallopian tubes, and ovaries with clinical-grade accuracy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/segmentation">
                <Button size="lg" className="text-base font-semibold px-8 h-12 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                  Start Segmentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-base font-semibold px-8 h-12 rounded-full border-white/[0.15] bg-white/[0.05] text-white hover:bg-white/[0.10] hover:border-white/25 backdrop-blur-sm transition-all duration-200">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-28 relative bg-[#080608]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Powerful Features</h2>
            <p className="text-white/40 text-base max-w-xl mx-auto">
              Everything you need for accurate medical image segmentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08]">
                  <feature.icon className="w-5 h-5 text-white/70" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="py-28 bg-[#080608]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-5">
              <h2 className="text-3xl md:text-4xl font-bold text-white">About This System</h2>
              <div className="space-y-4 text-white/45 text-sm leading-relaxed">
                <p>
                  This segmentation system leverages cutting-edge deep learning technology to assist medical
                  professionals in analyzing laparoscopic surgical imagery. Built on the SegFormer architecture,
                  our models provide accurate semantic segmentation of key anatomical structures.
                </p>
                <p>
                  The system identifies four primary classes: background, uterus, fallopian tubes, and ovaries,
                  with color-coded visualization for easy interpretation.
                </p>
                <p>
                  Designed with clinical workflows in mind, the interface is intuitive and efficient, allowing
                  healthcare professionals to focus on patient care rather than complex software operations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="p-6 text-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-28 relative bg-[#080608]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-purple-700/20 blur-[80px] rounded-full" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
          <p className="text-white/40 mb-8 max-w-xl mx-auto">
            Experience the power of AI-assisted medical image segmentation
          </p>
          <Link href="/segmentation">
            <Button size="lg" className="text-base font-semibold px-10 h-12 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-200">
              Start Segmentation Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-10 bg-[#080608]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-sm text-white mb-3">Laparoscopic Segmentation</h3>
              <p className="text-xs text-white/35">
                AI-powered medical imaging analysis for gynecological surgery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs text-white/35">
                <li><Link href="/segmentation" className="hover:text-white/70 transition-colors">Segmentation Tool</Link></li>
                <li><Link href="#features" className="hover:text-white/70 transition-colors">Features</Link></li>
                <li><Link href="#about" className="hover:text-white/70 transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white mb-3">Technology</h4>
              <ul className="space-y-2 text-xs text-white/35">
                <li>SegFormer Architecture</li>
                <li>ONNX Runtime</li>
                <li>Next.js &amp; FastAPI</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/[0.05] text-center text-xs text-white/25">
            <p>&copy; 2025 Gynecology Laparoscopic Segmentation System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
