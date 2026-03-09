'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg group transition-colors">
            <div className="relative">
              <Activity className="h-5 w-5 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_oklch(0.72_0.19_220_/_0.6)]" />
            </div>
            <span className="text-foreground group-hover:text-primary transition-colors duration-300">Gyn-Vision</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/#features" 
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:drop-shadow-[0_0_6px_oklch(0.72_0.19_220_/_0.3)]"
            >
              Features
            </Link>
            <Link 
              href="/#about" 
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:drop-shadow-[0_0_6px_oklch(0.72_0.19_220_/_0.3)]"
            >
              About
            </Link>
            <Link href="/segmentation">
              <Button 
                size="sm" 
                variant={pathname === '/segmentation' ? 'default' : 'ghost'}
                className={pathname === '/segmentation' ? 'glow-cyan' : ''}
              >
                Segmentation
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Link href="/segmentation">
              <Button size="sm" className="glow-cyan">
                Segment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
