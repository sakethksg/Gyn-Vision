# Gyn-Vision

A real-time surgical anatomy segmentation system for laparoscopic gynecological procedures, powered by SegFormer transformer-based semantic segmentation.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black.svg)


## Architecture

### Backend (FastAPI + ONNX Runtime)

```
backend/
├── api/               # REST API endpoints
│   └── routes.py      # Image/video segmentation, streaming
├── core/              # Core processing logic
│   ├── constants.py   # Color maps and class metadata
│   ├── model_registry.py   # Model loading and management
│   ├── preprocessing.py    # Image/video preprocessing
│   ├── postprocessing.py   # Mask generation and overlay creation
│   └── streaming.py        # Real-time frame streaming
├── config/
│   └── models.json    # Model configurations
└── models/            # ONNX model files
    ├── segformer_b0_round2.onnx (15MB)
    ├── segformer_b1_round2.onnx (53MB)
    └── segformer_b2.onnx (105MB)
```

**Technology Stack:**
- FastAPI for asynchronous API
- ONNX Runtime for optimized inference
- OpenCV for video processing
- Server-Sent Events (SSE) for real-time streaming

### Frontend (Next.js + TypeScript)

```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   └── segmentation/
│       └── page.tsx          # Main segmentation interface
├── components/
│   ├── FileUpload.tsx        # Drag-and-drop upload
│   ├── ModelSelector.tsx     # Model selection dropdown
│   ├── ImageResults.tsx      # Image segmentation results
│   ├── StreamingVideoResults.tsx  # Real-time video display
│   └── VideoLegend.tsx       # Color legend
└── lib/
    ├── api.ts                # Backend API client
    └── types.ts              # TypeScript interfaces
```

**Technology Stack:**
- Next.js 16 with App Router
- TypeScript for type safety
- Tailwind CSS + shadcn/ui for modern UI
- Axios + Fetch API for backend communication

## Processing Pipeline

### Image Segmentation
```
Upload Image → Preprocessing → Normalization → ONNX Inference → 
Mask Upsampling → Class-wise Coloring → Overlay Generation → Display Results
```

### Video Segmentation (Real-Time Streaming)
```
Upload Video → Extract Frames → [For sampled frames]:
  - Preprocess & Normalize
  - Run Inference
  - Generate Overlay
  - Stream to Frontend (SSE)
→ Live Canvas Display → User sees results immediately
```

**Frame Sampling Options:**
- **Fast**: 1 FPS (~30x speedup)
- **Balanced**: 2 FPS (~15x speedup, default)
- **Quality**: 6 FPS (~5x speedup)
- **Custom**: 1-30 FPS via slider


## Training Details

**Approach:**
- Standard semantic segmentation pipeline
- Cross-entropy loss over upsampled logits
- AdamW optimizer for stable convergence
- Validation monitoring to prevent overfitting

**Data Processing:**
- Images resized to match SegFormer pretraining expectations
- Normalization aligned with model requirements
- Class-balanced sampling during training

**Export:**
- Models exported to ONNX format for production deployment
- Dynamic shape support for batch processing
- CPU-optimized inference graphs

## Real-World Relevance

### Clinical Applications
- **Surgical Navigation**: Real-time anatomy recognition during procedures
- **Automated Video Annotation**: Assist in surgical documentation and review
- **Training Tools**: Educational platform for junior surgeons and medical students
- **Research**: Quantitative analysis of surgical techniques and outcomes

### Medical AI Context
Semantic segmentation in surgical videos is an active area of research in:
- Computer-assisted surgery systems
- Surgical robotics (e.g., da Vinci integration)
- Medical education and simulation
- Quality assessment and outcome prediction

While clinical-grade deployment requires regulatory certifications (FDA, CE marking), research prototypes like Gyn-Vision represent the foundational work driving innovation in surgical AI.

## Technology Decisions

**Backend:**
- FastAPI: Async processing for concurrent requests
- ONNX Runtime: Cross-platform, optimized inference
- OpenCV: Efficient video frame manipulation
- Server-Sent Events: Real-time streaming without WebSocket complexity

**Frontend:**
- Next.js: Modern React framework with excellent performance
- TypeScript: Type safety for complex medical data structures
- Tailwind CSS: Rapid UI development with medical theme
- Canvas API: Efficient frame-by-frame rendering

**Model Format:**
- ONNX: Platform-independent, optimized for CPU inference
- Avoids Python/PyTorch dependency in production
- Enables easy model updates without code changes

## API Endpoints

### Health Check
```
GET /health
```

### List Models
```
GET /models
Response: { models: [{ id, name, description }] }
```

### Segment Image
```
POST /segment/image
Body: FormData { file, model_id }
Response: { model_id, classes, original_image, mask_image, overlay_image }
```

### Segment Video (Batch)
```
POST /segment/video
Body: FormData { file, model_id, sample_rate }
Response: Video file (MP4)
```

### Segment Video (Streaming)
```
POST /segment/video/stream
Body: FormData { file, model_id, sample_rate }
Response: Server-Sent Events stream
Events: metadata → frame* → complete
```

### Get Model Classes
```
GET /models/{model_id}/classes
Response: { classes: [{ id, name, color }] }
```

## Performance Characteristics

**Image Processing:**
- Single image: ~100-300ms (depending on model)
- Batch processing: Parallelizable across images

**Video Processing:**
- 18-minute video (32,400 frames @ 30fps):
  - Fast mode (1 FPS): ~1,080 frames processed, ~2-3 min total
  - Balanced mode (2 FPS): ~2,160 frames processed, ~4-6 min total
  - Quality mode (6 FPS): ~6,480 frames processed, ~12-15 min total

**Real-Time Streaming:**
- Frames appear in UI as they're processed
- Progress bar shows completion percentage
- Abort functionality to cancel mid-processing

## License

This project is licensed under the MIT License - see the LICENSE file for details.
