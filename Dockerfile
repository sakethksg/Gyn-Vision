FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies first (for layer caching)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ ./backend/

# Copy ONNX model files into the image
# These are large but necessary — ensure they exist before building
COPY segformer_b0.onnx ./segformer_b0.onnx
COPY segformer_b1.onnx ./segformer_b1.onnx
COPY segformer_b2.onnx ./segformer_b2.onnx

# Update config to point to the correct paths inside the container
# models.json uses ../segformer_bN.onnx relative to backend/, which resolves to /app/segformer_bN.onnx ✓

WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
