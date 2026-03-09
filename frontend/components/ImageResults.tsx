/**
 * Image segmentation results display component
 */
'use client';

import { useState } from 'react';
import { ImageResult } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Download, Layers } from 'lucide-react';

interface ImageResultsProps {
  result: ImageResult;
  modelName?: string;
}

export function ImageResults({ result, modelName }: ImageResultsProps) {
  const [opacity, setOpacity] = useState(60);
  const [showMask, setShowMask] = useState(true);
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold tracking-tight text-white">Segmentation Results</h2>
          {modelName && (
            <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {modelName} active
            </p>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-black shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        {/* Viewer Area */}
        <div className="relative w-full bg-black overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
          <div
            className="absolute inset-0 transition-transform duration-200 ease-out"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          >
            <img
              src={result.original_image}
              alt="Original Surgical Feed"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <img
              src={result.mask_image}
              alt="AI Segmentation Mask"
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ease-in-out"
              style={{ opacity: showMask ? opacity / 100 : 0 }}
            />
          </div>

          {/* Toolbar */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 p-1.5 rounded-xl border border-white/[0.08] shadow-lg"
            style={{
              background: 'rgba(8,6,8,0.75)',
              backdropFilter: 'blur(16px) saturate(1.4)',
            }}
          >
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              onClick={handleZoomIn} title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              onClick={handleZoomOut} title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="h-px bg-white/10 w-full my-0.5" />
            <Button
              variant="ghost" size="icon"
              className={`h-8 w-8 rounded-lg hover:bg-white/10 ${showMask ? 'text-white' : 'text-white/30'}`}
              onClick={() => setShowMask(!showMask)} title="Toggle AI Layer"
            >
              <Layers className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => {
                const link = document.createElement('a');
                link.href = result.overlay_image;
                link.download = 'segmentation_result.png';
                link.click();
              }} title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Opacity Slider Bar */}
        <div className="px-5 py-3 flex items-center gap-4 border-t border-white/[0.06]"
          style={{
            background: 'rgba(8,6,8,0.7)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-2 shrink-0">
            <Layers className="h-4 w-4 text-white/30" />
            <span className="text-xs font-semibold text-white/35 uppercase tracking-wider">Opacity</span>
          </div>
          <Slider
            min={0}
            max={100}
            value={[opacity]}
            onValueChange={(val) => setOpacity(val[0])}
            className="flex-1"
            disabled={!showMask}
          />
          <span className="text-sm font-bold min-w-[36px] text-right tabular-nums text-white/60">{opacity}%</span>
        </div>
      </div>

    </div>
  );
}
