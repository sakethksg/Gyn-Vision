/**
 * Dynamic legend component for video results showing class colors
 * Matches the premium dark glassmorphic style of Legend
 */
'use client';

import { ClassInfo } from '@/lib/types';
import { Palette } from 'lucide-react';

interface VideoLegendProps {
  classes?: ClassInfo[];
}

export function VideoLegend({ classes }: VideoLegendProps) {
  const defaultClasses = [
    { id: 1, name: 'Uterus', color: '#0000FF' },
    { id: 2, name: 'Fallopian Tube', color: '#00FF00' },
    { id: 3, name: 'Ovary', color: '#A020F0' },
  ];

  const displayClasses = (classes || defaultClasses).filter(c => c.id !== 0);

  return (
    <div className="overflow-hidden mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-white/30" />
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Color Legend</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {displayClasses.map((classInfo) => (
            <div
              key={classInfo.id}
              className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/[0.05] bg-white/[0.02] hover:border-white/[0.10] transition-all duration-200"
            >
              <div
                className="w-3.5 h-3.5 rounded-md shrink-0"
                style={{ backgroundColor: classInfo.color }}
              />
              <span className="text-xs font-medium capitalize truncate text-white/60">
                {classInfo.name.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
