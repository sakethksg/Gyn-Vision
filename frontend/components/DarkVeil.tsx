'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
  className?: string;
}

const vertexShader = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform float uHueShift;
  uniform float uNoiseIntensity;
  uniform float uScanlineIntensity;
  uniform float uScanlineFrequency;
  uniform float uWarpAmount;

  varying vec2 vUv;

  // ── helpers ─────────────────────────────────────────────────────────────────
  vec3 hsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),               hash(i + vec2(1,0)), u.x),
      mix(hash(i + vec2(0,1)),   hash(i + vec2(1,1)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p  = p * 2.0 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  // ── main ────────────────────────────────────────────────────────────────────
  void main() {
    vec2 uv = vUv;

    // optional barrel-warp
    if (uWarpAmount > 0.0) {
      vec2 c = uv - 0.5;
      float len = dot(c, c);
      uv += c * len * uWarpAmount;
      uv = clamp(uv, 0.0, 1.0);
    }

    // flowing dark veil
    float t    = uTime * 0.25;
    vec2  warp = vec2(fbm(uv * 1.8 + t), fbm(uv * 1.8 + vec2(3.7, 1.5) + t * 0.85));
    float base = fbm(uv * 1.4 + warp * 0.8);
    float base2 = fbm(uv * 2.5 + warp * 0.4 + t * 0.5);

    // vivid blue-cyan palette with bright highlights
    float hueBase = 0.58 + uHueShift / 360.0;
    float sat     = 0.70 + base * 0.30;
    float val     = 0.05 + base * 0.35 + base2 * 0.20;

    vec3 col = hsvToRgb(vec3(fract(hueBase + base * 0.10 - base2 * 0.05), sat, val));

    // add a secondary warm-teal streak layer
    float hue2 = 0.50 + base2 * 0.08;
    float val2  = base2 * 0.18;
    vec3 col2 = hsvToRgb(vec3(hue2, 0.60, val2));
    col = mix(col, col + col2, 0.4);

    // grain
    if (uNoiseIntensity > 0.0) {
      float grain = hash(uv * uResolution + uTime * 7.3) - 0.5;
      col += grain * uNoiseIntensity * 0.04;
    }

    // scanlines
    if (uScanlineIntensity > 0.0) {
      float sl = sin(uv.y * uScanlineFrequency * 3.14159 * 2.0);
      col *= 1.0 - uScanlineIntensity * 0.18 * (0.5 + 0.5 * sl);
    }

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

export default function DarkVeil({
  hueShift         = 0,
  noiseIntensity   = 0,
  scanlineIntensity= 0,
  speed            = 0.5,
  scanlineFrequency= 0,
  warpAmount       = 0,
  resolutionScale  = 1,
  className        = '',
}: DarkVeilProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: false, antialias: false });
    const gl       = renderer.gl;
    gl.clearColor(0.05, 0.06, 0.09, 1);
    // Make canvas fill container absolutely
    Object.assign(gl.canvas.style, {
      position: 'absolute',
      top: '0', left: '0',
      width: '100%', height: '100%',
      display: 'block',
    });
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program  = new Program(gl, {
      vertex:   vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime:              { value: 0 },
        uResolution:        { value: [container.clientWidth, container.clientHeight] },
        uHueShift:          { value: hueShift },
        uNoiseIntensity:    { value: noiseIntensity },
        uScanlineIntensity: { value: scanlineIntensity },
        uScanlineFrequency: { value: scanlineFrequency },
        uWarpAmount:        { value: warpAmount },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w * resolutionScale, h * resolutionScale);
      program.uniforms.uResolution.value = [w, h];
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let last = 0;
    const tick = (t: number) => {
      rafRef.current = requestAnimationFrame(tick);
      program.uniforms.uTime.value = (t / 1000) * speed;
      renderer.render({ scene: mesh });
      last = t;
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'block' }}
    />
  );
}
