/**
 * Mode toggle component for switching between image and video
 */
'use client';

import { Mode } from '@/lib/types';
import { Image, Video } from 'lucide-react';

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
  disabled?: boolean;
}

export function ModeToggle({ mode, onChange, disabled = false }: ModeToggleProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input Mode</label>
      <div className="relative flex w-full p-1 bg-muted/30 rounded-lg border border-border/50 shadow-inner">
        <div
          className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-background rounded-md shadow-sm border border-border/50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mode === 'video' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
          }`}
        />
        <button
          type="button"
          onClick={() => onChange('image')}
          disabled={disabled}
          className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors duration-200 ${
            mode === 'image' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Image className="h-4 w-4" />
          Image
        </button>
        <button
          type="button"
          onClick={() => onChange('video')}
          disabled={disabled}
          className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors duration-200 ${
            mode === 'video' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Video className="h-4 w-4" />
          Video
        </button>
      </div>
    </div>
  );
}
