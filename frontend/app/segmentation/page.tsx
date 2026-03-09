'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mode, Model, ImageResult, ClassInfo } from '@/lib/types';
import { fetchModels, segmentImage, segmentVideo, fetchModelClasses, segmentVideoStream } from '@/lib/api';
import { ModelSelector } from '@/components/ModelSelector';
import { ModeToggle } from '@/components/ModeToggle';
import { FileUpload } from '@/components/FileUpload';
import { ImageResults } from '@/components/ImageResults';
import { VideoResults } from '@/components/VideoResults';
import { StreamingVideoResults } from '@/components/StreamingVideoResults';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Upload, ArrowLeft } from 'lucide-react';

export default function SegmentationPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [mode, setMode] = useState<Mode>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageResult, setImageResult] = useState<ImageResult | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoClasses, setVideoClasses] = useState<ClassInfo[] | undefined>(undefined);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamProgress, setStreamProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [streamAbortController, setStreamAbortController] = useState<AbortController | null>(null);
  const [sampleRate, setSampleRate] = useState<number>(15); // Default: ~2fps (every 15th frame)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const fetchedModels = await fetchModels();
        setModels(fetchedModels);
        if (fetchedModels.length > 0) {
          setSelectedModelId(fetchedModels[0].id);
        }
      } catch (err) {
        setError('Failed to load models');
      }
    };
    loadModels();
  }, []);

  // Handle mode change
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setSelectedFile(null);
    setImageResult(null);
    setVideoUrl(null);
    setError(null);
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  // Handle segmentation
  const handleSegment = async () => {
    if (!selectedFile || !selectedModelId) return;

    setLoading(true);
    setError(null);
    setImageResult(null);
    setVideoUrl(null);
    setIsStreaming(false);
    setStreamProgress(0);
    setCurrentFrame(0);
    setTotalFrames(0);
    
    // Cancel any existing stream
    if (streamAbortController) {
      streamAbortController.abort();
    }

    try {
      if (mode === 'image') {
        const result = await segmentImage(selectedFile, selectedModelId);
        setImageResult(result);
      } else {
        // Create abort controller for this stream
        const abortController = new AbortController();
        setStreamAbortController(abortController);
        
        // Use streaming for video
        setIsStreaming(true);
        setLoading(false); // Show streaming UI instead of loading
        
        // Fetch class metadata for the model
        try {
          const classes = await fetchModelClasses(selectedModelId);
          setVideoClasses(classes);
        } catch (e) {
          console.error('Failed to fetch model classes:', e);
        }

        await segmentVideoStream(
          selectedFile,
          selectedModelId,
          sampleRate,
          (frameData) => {
            // Check if aborted
            if (abortController.signal.aborted) return;
            
            if (frameData.type === 'metadata') {
              setTotalFrames(frameData.total_frames || 0);
              // Pass metadata to canvas
              if ((window as any).setStreamMetadata) {
                (window as any).setStreamMetadata(frameData);
              }
            } else if (frameData.type === 'frame') {
              setCurrentFrame(frameData.frame_index || 0);
              setStreamProgress(frameData.progress || 0);
              // Update canvas with new frame
              if ((window as any).updateStreamCanvas && frameData.frame_data) {
                (window as any).updateStreamCanvas(frameData.frame_data);
              }
            }
          },
          (error) => {
            if (!abortController.signal.aborted) {
              setError(error.message);
            }
            setIsStreaming(false);
            setLoading(false);
            setStreamAbortController(null);
          },
          () => {
            setIsStreaming(false);
            setLoading(false);
            setStreamAbortController(null);
          },
          abortController.signal // Pass abort signal
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Segmentation failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle clearing results
  const handleClear = () => {
    // Abort streaming if active
    if (streamAbortController) {
      try {
        streamAbortController.abort();
      } catch (error) {
        // Ignore abort errors - they're expected
        console.log('Stream aborted by user');
      }
      setStreamAbortController(null);
    }
    
    setImageResult(null);
    setVideoUrl(null);
    setIsStreaming(false);
    setStreamProgress(0);
    setCurrentFrame(0);
    setTotalFrames(0);
    setError(null);
    
    // Clear canvas
    if ((window as any).updateStreamCanvas) {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  };

  const selectedModel = models.find(m => m.id === selectedModelId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="border-l h-8 mx-2" />
          <div>
            <h1 className="text-lg font-bold">Segmentation Tool</h1>
            <p className="text-xs text-muted-foreground">Upload and analyze laparoscopic images or videos</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <Card className="p-5 space-y-6 sticky top-4 glass-panel border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-wide uppercase text-foreground/80">Configuration</h3>
                {error && (
                  <div className="group relative flex flex-col items-center">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                    </div>
                    {/* Tooltip for error */}
                    <div className="absolute top-full mt-2 right-0 w-48 p-2 bg-destructive text-destructive-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {error}
                    </div>
                  </div>
                )}
              </div>
                
              <div className="space-y-6">
                <div className="space-y-5 bg-background/50 p-4 rounded-xl border border-border/50 shadow-inner">
                  <ModelSelector
                    models={models}
                    selectedId={selectedModelId}
                    onSelect={setSelectedModelId}
                    disabled={loading}
                  />

                  <ModeToggle
                    mode={mode}
                    onChange={handleModeChange}
                    disabled={loading}
                  />
                </div>

                {/* Video Sample Rate Slider - Only show for video mode */}
                {mode === 'video' && (
                  <div className="space-y-3">
                    <label className="text-xs font-medium">Processing Speed</label>
                    
                    {/* Preset Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={sampleRate === 30 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSampleRate(30)}
                        disabled={loading}
                        className="text-xs h-8"
                      >
                        Fast
                        <span className="text-[10px] ml-1 opacity-70">(1fps)</span>
                      </Button>
                      <Button
                        type="button"
                        variant={sampleRate === 15 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSampleRate(15)}
                        disabled={loading}
                        className="text-xs h-8"
                      >
                        Balanced
                        <span className="text-[10px] ml-1 opacity-70">(2fps)</span>
                      </Button>
                      <Button
                        type="button"
                        variant={sampleRate === 5 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSampleRate(5)}
                        disabled={loading}
                        className="text-xs h-8"
                      >
                        Quality
                        <span className="text-[10px] ml-1 opacity-70">(6fps)</span>
                      </Button>
                    </div>

                    {/* Custom Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">Custom:</span>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          value={sampleRate}
                          onChange={(e) => setSampleRate(Number(e.target.value))}
                          disabled={loading}
                          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <span className="text-xs font-medium min-w-[60px]">
                          ~{sampleRate}x faster
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Processing every {sampleRate === 1 ? '' : `${sampleRate}${sampleRate === 2 ? 'nd' : sampleRate === 3 ? 'rd' : 'th'} `}frame{sampleRate === 1 ? '' : 's'} 
                        {' '}({Math.round(30 / sampleRate)} frames/sec at 30fps input)
                      </p>
                    </div>
                  </div>
                )}

                <FileUpload
                  mode={mode}
                  onFileSelect={handleFileSelect}
                  disabled={loading}
                />

                <Button
                  className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-xl h-12 text-base font-medium"
                  size="lg"
                  onClick={handleSegment}
                  disabled={!selectedFile || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Run Segmentation'
                  )}
                </Button>
              </div>

              {/* Error is now displayed as a pulse indicator in the header */}
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-3">
            {imageResult ? (
              <ImageResults
                result={imageResult}
                modelName={selectedModel?.name}
              />
            ) : isStreaming || (currentFrame > 0 && !videoUrl) ? (
              <StreamingVideoResults
                modelName={selectedModel?.name}
                classes={videoClasses}
                isStreaming={isStreaming}
                progress={streamProgress}
                currentFrame={currentFrame}
                totalFrames={totalFrames}
                onClear={handleClear}
              />
            ) : videoUrl ? (
              <VideoResults
                videoUrl={videoUrl}
                modelName={selectedModel?.name}
                classes={videoClasses}
              />
            ) : (
              <Card className="relative flex flex-col items-center justify-center text-center min-h-[600px] border-2 border-dashed border-muted-foreground/20 bg-muted/5 rounded-2xl transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 shadow-sm overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50"></div>
                <div className="z-10 flex flex-col items-center max-w-sm px-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-inner relative">
                     <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20"></div>
                     <Upload className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Workspace Ready</h3>
                  <p className="text-muted-foreground mb-8 text-balance">
                    Upload your surgical {mode === 'image' ? 'image' : 'video'} to begin AI segmentation analysis.
                  </p>
                  
                  <div className="w-full max-w-[200px]">
                    <Button variant="outline" className="w-full glass shadow-sm pointer-events-none opacity-50 font-medium pt-2 pb-2">
                      Try Demo {mode === 'image' ? 'Image' : 'Video'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
