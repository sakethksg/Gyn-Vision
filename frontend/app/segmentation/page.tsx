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
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Legend } from '@/components/Legend';
import { Loader2, Upload, ArrowLeft } from 'lucide-react';

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
  const [sampleRate, setSampleRate] = useState<number>(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setSelectedFile(null);
    setImageResult(null);
    setVideoUrl(null);
    setError(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

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
    
    if (streamAbortController) {
      streamAbortController.abort();
    }

    try {
      if (mode === 'image') {
        const result = await segmentImage(selectedFile, selectedModelId);
        setImageResult(result);
      } else {
        const abortController = new AbortController();
        setStreamAbortController(abortController);
        setIsStreaming(true);
        setLoading(false);
        
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
            if (abortController.signal.aborted) return;
            
            if (frameData.type === 'metadata') {
              setTotalFrames(frameData.total_frames || 0);
              if ((window as any).setStreamMetadata) {
                (window as any).setStreamMetadata(frameData);
              }
            } else if (frameData.type === 'frame') {
              setCurrentFrame(frameData.frame_index || 0);
              setStreamProgress(frameData.progress || 0);
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
          abortController.signal
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Segmentation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (streamAbortController) {
      try {
        streamAbortController.abort();
      } catch (error) {
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
    <div className="min-h-screen bg-[#080608] relative">
      {/* Subtle purple glow top-right */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-purple-700/10 blur-[160px] rounded-full" />
      </div>

      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#080608]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-white/60 hover:text-white hover:bg-white/[0.06]">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="border-l border-white/[0.08] h-6 mx-1" />
          <div>
            <h1 className="text-base font-bold text-white">Segmentation Tool</h1>
            <p className="text-xs text-white/40">Upload and analyze laparoscopic images or videos</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <div className="p-5 space-y-6 sticky top-20 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-y-auto max-h-[calc(100vh-7rem)]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40">Configuration</h3>
                {error && (
                  <div className="group relative flex flex-col items-center">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </div>
                    <div className="absolute top-full mt-2 right-0 w-48 p-2 bg-red-500/20 border border-red-500/30 text-red-300 text-xs rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {error}
                    </div>
                  </div>
                )}
              </div>
                
              <div className="space-y-6">
                <div className="space-y-5 bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
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

                {/* Video Sample Rate Slider */}
                {mode === 'video' && (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest uppercase text-white/40">Processing Speed</label>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {([{val:30,label:'Fast',fps:'1fps'},{val:15,label:'Balanced',fps:'2fps'},{val:5,label:'Quality',fps:'6fps'}] as const).map(({val,label,fps}) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSampleRate(val)}
                          disabled={loading}
                          className={`text-xs h-8 rounded-lg border transition-all duration-150 font-medium ${
                            sampleRate === val
                              ? 'bg-white/[0.12] border-white/[0.20] text-white'
                              : 'bg-transparent border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/[0.12]'
                          } ${loading ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {label}<br />
                          <span className="text-[9px] opacity-60">{fps}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/35 shrink-0">Custom:</span>
                      <Slider
                        min={1}
                        max={30}
                        value={[sampleRate]}
                        onValueChange={(val) => setSampleRate(val[0])}
                        disabled={loading}
                        className="flex-1"
                      />
                      <span className="text-xs font-medium text-white/60 min-w-[52px] text-right">
                        ~{sampleRate}x
                      </span>
                    </div>
                    <p className="text-[11px] text-white/25">
                      {Math.round(30 / sampleRate)} fps at 30fps input
                    </p>
                  </div>
                )}

                <FileUpload
                  mode={mode}
                  onFileSelect={handleFileSelect}
                  disabled={loading}
                />

                <Button
                  className="w-full bg-white text-black hover:bg-white/90 rounded-full h-11 text-sm font-semibold transition-all duration-200 shadow-[0_0_24px_rgba(255,255,255,0.12)] disabled:opacity-40 disabled:shadow-none"
                  size="lg"
                  onClick={handleSegment}
                  disabled={!selectedFile || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Run Segmentation'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-3 space-y-4">
            {imageResult ? (
              <>
                <ImageResults
                  result={imageResult}
                  modelName={selectedModel?.name}
                />
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <Legend classes={imageResult.classes} showStats={true} />
                </div>
              </>
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
              <div className="relative flex flex-col items-center justify-center text-center min-h-[580px] rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <div className="flex flex-col items-center max-w-sm px-6">
                  <div className="w-16 h-16 rounded-2xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center mb-5">
                    <Upload className="h-7 w-7 text-white/30" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">Workspace Ready</h3>
                  <p className="text-sm text-white/35 text-balance leading-relaxed">
                    Upload a surgical {mode === 'image' ? 'image' : 'video'} using the panel on the left to begin AI segmentation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
