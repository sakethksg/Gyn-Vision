"""
FastAPI main application for gynecology laparoscopic segmentation.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from core.model_registry import initialize_registry
from api.routes import router
import uvicorn

import os

# Initialize FastAPI app
app = FastAPI(
    title="Gynecology Segmentation API",
    description="Multi-model segmentation for laparoscopic images and videos",
    version="1.0.0"
)

# CORS configuration — allow localhost + any Vercel deployment + custom CORS_ORIGINS env var
_extra = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]
allow_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://gynvision.vercel.app",
] + _extra

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=r"https://gynvision.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize models on startup."""
    print("=" * 60)
    print("Starting Gynecology Segmentation API")
    print("=" * 60)
    
    # Get config path
    base_dir = Path(__file__).parent
    config_path = base_dir / "config" / "models.json"
    
    # Initialize model registry
    print("\nInitializing model registry...")
    try:
        initialize_registry(str(config_path))
        print("\n✓ Model registry initialized (models lazy-loaded on first request)")
    except Exception as e:
        print(f"\n✗ Error initializing models: {e}")
        print("Server will start but models may not be available")
    
    print("=" * 60)
    print("Server ready at http://localhost:8000")
    print("API docs at http://localhost:8000/docs")
    print("=" * 60)


# Health check
@app.get("/health")
async def health():
    return {"status": "ok"}

# Include routes
app.include_router(router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
