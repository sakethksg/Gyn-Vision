/**
 * Real-time video segmentation streaming component
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { VideoLegend } from './VideoLegend';
import { ClassInfo } from '@/lib/types';
import { Loader2, X } from 'lucide-react';

interface StreamingVideoResultsProps {
  modelName?: string;
  classes?: ClassInfo[];
  isStreaming: boolean;
  progress: number;
  currentFrame: number;
  totalFrames: number;
  onClear?: () => void;
}

export function StreamingVideoResults({
  modelName,
  classes,
  isStreaming,
  progress,
  currentFrame,
  totalFrames,
  onClear
}: StreamingVideoResultsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      (window as any).updateStreamCanvas = (imageData: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new window.Image();
        img.onload = () => {
          if (canvas.width === 0) {
            canvas.width = img.width;
            canvas.height = img.height;
            setDimensions({ width: img.width, height: img.height });
          }
          ctx.drawImage(img, 0, 0);
        };
        img.src = imageData;
      };

      (window as any).setStreamMetadata = (metadata: any) => {
        if (metadata.fps) setFps(metadata.fps);
        if (metadata.width && metadata.height) {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = metadata.width;
            canvas.height = metadata.height;
            setDimensions({ width: metadata.width, height: metadata.height });
          }
        }
      };
    }

    return () => {
      delete (window as any).updateStreamCanvas;
      delete (window as any).setStreamMetadata;
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Real-Time Video Segmentation</h2>
          {modelName && (
            <p className="text-xs text-white/40 mt-0.5">
              {modelName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isStreaming && (
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Processing...</span>
            </div>
          )}
          {onClear && (
            <Button 
              onClick={onClear}
              variant="outline"
              size="sm"
              className="h-8 text-xs border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05] text-white/50 hover:text-white"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isStreaming && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white/35">
            <span>Frame {currentFrame} of {totalFrames}</span>
            <span className="text-white/60 font-medium">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'rgba(255,255,255,0.5)',
              }}
            />
          </div>
        </div>
      )}

      {/* Video Canvas */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-black">
        <div className="p-4">
          <div className="relative w-full rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/[0.04]">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto"
              style={{ maxHeight: '65vh' }}
            />
            {!dimensions && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 mx-auto mb-2 animate-spin text-white/20" />
                  <p className="text-sm text-white/30">Waiting for video stream...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stream Info */}
      {dimensions && (
        <div className="flex gap-2 text-xs text-white/35">
          <span className="px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">{dimensions.width}x{dimensions.height}</span>
          {fps > 0 && <span className="px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">{fps.toFixed(1)} FPS</span>}
        </div>
      )}

      {/* Legend */}
      <VideoLegend classes={classes} />
    </div>
  );
}
