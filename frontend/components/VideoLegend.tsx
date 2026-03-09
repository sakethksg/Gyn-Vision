/**
 * Dynamic legend component for video results showing class colors
 * Matches the premium dark glassmorphic style of Legend
 */
'use client';

import { Card } from '@/components/ui/card';
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
    <Card className="overflow-hidden mt-4 glass-card border-white/[0.06]">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-primary" />
          <h3 className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Color Legend</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {displayClasses.map((classInfo) => (
            <div
              key={classInfo.id}
              className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] transition-all duration-300"
            >
              <div className="relative shrink-0">
                <div
                  className="w-4 h-4 rounded-md"
                  style={{
                    backgroundColor: classInfo.color,
                    boxShadow: `0 0 10px ${classInfo.color}50`,
                  }}
                />
              </div>
              <span className="text-xs font-semibold capitalize truncate text-foreground/90">
                {classInfo.name.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
