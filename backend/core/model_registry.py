"""
Model registry for loading and managing ONNX models.
Lazy-loads models on first use and keeps only one session in memory at a time
to stay within the 512 MB Render free-tier limit.
"""
import json
import gc
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import onnxruntime as ort


class ModelRegistry:
    """Manages ONNX model loading with lazy, single-slot caching."""

    def __init__(self, config_path: str):
        self.config_path = config_path
        self.models_config: List[Dict] = []
        self.base_dir = Path(config_path).parent.parent

        # Single-slot cache — only one model loaded at a time
        self._cached_id: Optional[str] = None
        self._cached_session: Optional[ort.InferenceSession] = None

    def load_registry(self) -> None:
        """Load model configurations from JSON file (no model files loaded yet)."""
        with open(self.config_path, 'r') as f:
            data = json.load(f)
            self.models_config = data['models']

        # Validate which model files actually exist (for the available-models list)
        self._available_ids = set()
        for m in self.models_config:
            path = self.base_dir / m['onnx_path']
            if path.exists():
                self._available_ids.add(m['id'])
                print(f"✓ Found model file: {m['id']}")
            else:
                print(f"Warning: Model file not found: {path}")

    def _load(self, model_id: str, config: Dict) -> ort.InferenceSession:
        """Evict current session and load the requested one."""
        if self._cached_id == model_id and self._cached_session is not None:
            return self._cached_session

        # Evict previous session to free memory before loading the new one
        if self._cached_session is not None:
            print(f"Evicting model from memory: {self._cached_id}")
            del self._cached_session
            self._cached_session = None
            self._cached_id = None
            gc.collect()

        onnx_path = self.base_dir / config['onnx_path']
        print(f"Lazy-loading model: {model_id}")
        session = ort.InferenceSession(
            str(onnx_path),
            providers=['CPUExecutionProvider'],
        )
        self._cached_id = model_id
        self._cached_session = session
        print(f"✓ Model ready: {model_id}")
        return session

    def get_model(self, model_id: str) -> Tuple[ort.InferenceSession, Dict]:
        if model_id not in self._available_ids:
            raise KeyError(f"Model '{model_id}' not found or unavailable")

        config = next(m for m in self.models_config if m['id'] == model_id)
        session = self._load(model_id, config)
        return session, config

    def get_available_models(self) -> List[Dict]:
        return [
            {'id': m['id'], 'name': m['name'], 'description': m['description']}
            for m in self.models_config
            if m['id'] in self._available_ids
        ]


# Global registry instance
_registry = None


def get_registry() -> ModelRegistry:
    global _registry
    if _registry is None:
        raise RuntimeError("Model registry not initialized")
    return _registry


def initialize_registry(config_path: str) -> ModelRegistry:
    global _registry
    _registry = ModelRegistry(config_path)
    _registry.load_registry()
    # No models loaded here — lazy loaded on first request
    return _registry
