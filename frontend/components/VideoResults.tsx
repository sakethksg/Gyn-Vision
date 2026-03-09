/**
 * Video segmentation results display component
 */
'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoLegend } from './VideoLegend';
import { ClassInfo } from '@/lib/types';

interface VideoResultsProps {
  videoUrl: string;
  modelName?: string;
  classes?: ClassInfo[];
}

export function VideoResults({ videoUrl, modelName, classes }: VideoResultsProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `segmented_video.mp4`;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Video Results</h2>
          {modelName && (
            <p className="text-xs text-white/40 mt-0.5">
              {modelName}
            </p>
          )}
        </div>
        <Button 
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="h-8 text-xs border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05] text-white/50 hover:text-white transition-all duration-200"
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
      </div>

      {/* Video Player */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-black">
        <div className="p-4">
          <div className="relative w-full rounded-xl overflow-hidden bg-black border border-white/[0.04]">
            <video
              src={videoUrl}
              controls
              className="w-full h-auto"
              style={{ maxHeight: '65vh' }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      {/* Legend */}
      <VideoLegend classes={classes} />
    </div>
  );
}
