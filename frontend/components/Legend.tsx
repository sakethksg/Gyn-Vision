/**
 * Legend component to display class colors and statistics
 */
'use client';

import { ClassInfo } from '@/lib/types';

interface LegendProps {
  classes: ClassInfo[];
  showStats?: boolean;
}

export function Legend({ classes, showStats = true }: LegendProps) {
  const displayClasses = classes.filter(c => c.id !== 0);

  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {displayClasses.map((classInfo) => (
          <div
            key={classInfo.id}
            className="flex items-center gap-2 p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] hover:border-primary/25 hover:bg-primary/5 transition-all duration-300"
          >
            <div
              className="w-4 h-4 rounded shrink-0 shadow-[0_0_8px_var(--chip-color)]"
              style={{ backgroundColor: classInfo.color, '--chip-color': classInfo.color + '60' } as React.CSSProperties}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium capitalize truncate">
                {classInfo.name.replace('_', ' ')}
              </div>
              {showStats && classInfo.area_percent !== undefined && (
                <div className="text-xs text-muted-foreground">
                  {classInfo.area_percent.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
