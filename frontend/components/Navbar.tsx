'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-8 pt-5 pointer-events-none">
      <div
        className="pointer-events-auto flex items-center gap-12 px-8 py-4 rounded-full border border-white/[0.13] shadow-[0_8px_40px_oklch(0_0_0_/_0.45)]"
        style={{
          background: 'oklch(0.10 0.025 260 / 0.75)',
          backdropFilter: 'blur(28px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-base group transition-colors shrink-0">
          <Activity className="h-5 w-5 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_oklch(0.72_0.19_220_/_0.8)]" />
          <span className="text-white group-hover:text-primary transition-colors duration-200">Gyn-Vision</span>
        </Link>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10" />

        {/* Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/#features"
            className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="/#about"
            className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/segmentation"
            className={[
              'text-sm font-medium transition-colors duration-200',
              pathname === '/segmentation'
                ? 'text-primary drop-shadow-[0_0_8px_oklch(0.72_0.19_220_/_0.6)]'
                : 'text-white/60 hover:text-white',
            ].join(' ')}
          >
            Segmentation
          </Link>
        </div>
      </div>
    </nav>
  );
}
