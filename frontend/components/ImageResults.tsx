/**
 * Image segmentation results display component
 */
'use client';

import { useState } from 'react';
import { ImageResult } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Legend } from './Legend';
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Segmentation Results</h2>
          {modelName && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
               {modelName} active
            </p>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <Card className="overflow-hidden border-border/50 shadow-xl glass-card relative group">
        {/* Toolbar Overlay (Top Right) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-background/80 backdrop-blur-md p-1.5 rounded-xl border border-border/50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted" onClick={handleZoomIn} aria-label="Zoom In" title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted" onClick={handleZoomOut} aria-label="Zoom Out" title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="h-px bg-border/50 w-full my-0.5" />
          <Button variant="ghost" size="icon" className={`h-9 w-9 rounded-lg hover:bg-muted ${showMask ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`} onClick={() => setShowMask(!showMask)} aria-label="Toggle Mask" title="Toggle AI Layer">
            <Layers className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted" onClick={() => {
              const link = document.createElement('a');
              link.href = result.overlay_image;
              link.download = 'segmentation_result.png';
              link.click();
            }} aria-label="Download Result" title="Download Report">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Viewer Area */}
        <div className="relative w-full aspect-video bg-muted/20 overflow-hidden flex items-center justify-center cursor-move">
          {/* Subtle Grid Pattern Behind Image */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          
          <div 
            className="relative w-full h-full transition-transform duration-200 ease-out flex items-center justify-center"
            style={{ transform: `scale(${scale})` }}
          >
            {/* Base Image */}
            <img
              src={result.original_image}
              alt="Original Surgical Feed"
              className="absolute inset-0 w-full h-full object-contain drop-shadow-lg"
            />
            {/* Overlay Mask */}
            <img
              src={result.mask_image}
              alt="AI Segmentation Mask"
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ease-in-out"
              style={{ opacity: showMask ? opacity / 100 : 0 }}
            />
          </div>
        </div>

        {/* Bottom Bar: Opacity Slider */}
        <div className="px-6 py-4 bg-background/50 backdrop-blur-md border-t border-border/50 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-300">
          <div className="flex items-center gap-2 min-w-[120px]">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">AI Opacity</span>
          </div>
          <div className="flex-1 flex items-center gap-4">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!showMask}
            />
            <span className="text-sm font-bold min-w-[3ch] text-right text-foreground">{opacity}%</span>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="glass-card border-border/50 shadow-sm p-4">
        <Legend classes={result.classes} showStats={true} />
      </Card>
    </div>
  );
}
