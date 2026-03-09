/**
 * Legend component to display class colors and statistics
 * Premium dark glassmorphic design with radial progress rings
 */
'use client';

import { ClassInfo } from '@/lib/types';
import { Activity } from 'lucide-react';

interface LegendProps {
  classes: ClassInfo[];
  showStats?: boolean;
}

function RadialProgress({ percent, color, size = 52 }: { percent: number; color: string; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="oklch(1 0 0 / 0.06)"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          filter: `drop-shadow(0 0 6px ${color}80)`,
          transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </svg>
  );
}

export function Legend({ classes, showStats = true }: LegendProps) {
  const displayClasses = classes.filter(c => c.id !== 0);
  const totalArea = displayClasses.reduce((sum, c) => sum + (c.area_percent || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-white/30" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
            Segmentation Analysis
          </h3>
        </div>
        {showStats && (
          <span className="text-[10px] font-semibold text-white/30 px-2 py-0.5 rounded-full border border-white/[0.06] bg-white/[0.02]">
            {displayClasses.filter(c => c.present !== false && (c.area_percent || 0) > 0).length} / {displayClasses.length} detected
          </span>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {displayClasses.map((classInfo) => {
          const percent = classInfo.area_percent ?? 0;
          const isPresent = classInfo.present !== false && percent > 0;

          return (
            <div
              key={classInfo.id}
              className={`
                relative group rounded-xl border p-4 transition-all duration-300
                ${isPresent
                  ? 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]'
                  : 'border-white/[0.04] bg-white/[0.01] opacity-60'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {/* Radial Progress */}
                {showStats ? (
                  <div className="relative shrink-0">
                    <RadialProgress percent={percent} color={classInfo.color} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[11px] font-bold tabular-nums" style={{ color: classInfo.color }}>
                        {percent.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-5 h-5 rounded-md shrink-0"
                    style={{
                      backgroundColor: classInfo.color,
                      boxShadow: `0 0 10px ${classInfo.color}50`,
                    }}
                  />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: classInfo.color,
                        boxShadow: isPresent ? `0 0 8px ${classInfo.color}70` : 'none',
                      }}
                    />
                    <span className="text-xs font-semibold capitalize truncate text-white/80">
                      {classInfo.name.replace('_', ' ')}
                    </span>
                  </div>
                  {showStats && (
                    <span className="text-[10px] text-white/35">
                      {isPresent ? `${percent.toFixed(1)}% coverage` : 'Not detected'}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom progress bar */}
              {showStats && isPresent && (
                <div className="mt-3 h-1 rounded-full overflow-hidden bg-white/[0.05]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(percent * 2, 100)}%`,
                      background: `linear-gradient(90deg, ${classInfo.color}, ${classInfo.color}90)`,
                      boxShadow: `0 0 8px ${classInfo.color}40`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
