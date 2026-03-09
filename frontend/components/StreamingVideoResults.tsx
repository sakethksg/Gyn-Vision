/**
 * Real-time video segmentation streaming component
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
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
          <h2 className="text-base font-semibold">Real-Time Video Segmentation</h2>
          {modelName && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {modelName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isStreaming && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span>Processing...</span>
            </div>
          )}
          {onClear && (
            <Button 
              onClick={onClear}
              variant="outline"
              size="sm"
              className="h-8 text-xs border-white/10 hover:border-white/20 hover:bg-white/[0.06]"
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
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Frame {currentFrame} of {totalFrames}</span>
            <span className="text-primary font-medium">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, oklch(0.72 0.19 220), oklch(0.65 0.17 240))',
                boxShadow: '0 0 12px oklch(0.72 0.19 220 / 0.4)',
              }}
            />
          </div>
        </div>
      )}

      {/* Video Canvas */}
      <Card className="overflow-hidden glass-card border-white/[0.06]">
        <div className="p-4">
          <div className="relative w-full rounded-lg overflow-hidden bg-black flex items-center justify-center border border-white/[0.04]">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto"
              style={{ maxHeight: '65vh' }}
            />
            {!dimensions && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 mx-auto mb-2 animate-spin text-primary/50" />
                  <p className="text-sm">Waiting for video stream...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stream Info */}
      {dimensions && (
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06]">{dimensions.width}x{dimensions.height}</span>
          {fps > 0 && <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06]">{fps.toFixed(1)} FPS</span>}
        </div>
      )}

      {/* Legend */}
      <VideoLegend classes={classes} />
    </div>
  );
}
