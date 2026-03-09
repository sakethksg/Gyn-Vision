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

  varying vec2 vUv;

  vec2 rot(vec2 p, float a) {
    float c = cos(a), s = sin(a);
    return vec2(c*p.x - s*p.y, s*p.x + c*p.y);
  }

  // ── helpers (kept for hue shift) ────────────────────────────────────────────
  vec3 hsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  // ── main ────────────────────────────────────────────────────────────────────
  void main() {
    vec2 uv = vUv;
    float t = uTime;

    // ── large purple blob – top-right corner (dominant) ──
    vec2 br = uv - vec2(0.85 + sin(t*0.07)*0.06, 0.10 + cos(t*0.05)*0.06);
    float dr = 1.0 - smoothstep(0.0, 0.75, length(rot(br, t*0.08)));
    vec3 cr = vec3(0.28, 0.04, 0.62) * pow(dr, 1.4) * 3.2;

    // ── mid purple glow – top-right bleed ──
    float dr2 = 1.0 - smoothstep(0.0, 0.55, length(uv - vec2(0.78 + cos(t*0.06)*0.08, 0.22 + sin(t*0.07)*0.05)));
    vec3 cr2 = vec3(0.38, 0.06, 0.70) * pow(dr2, 1.6) * 2.4;

    // ── smaller accent blob – top-centre-left ──
    float dl = 1.0 - smoothstep(0.0, 0.40, length(rot(uv - vec2(0.30+sin(t*0.09)*0.06, 0.08+cos(t*0.08)*0.04), t*0.10)));
    vec3 cl = vec3(0.22, 0.03, 0.50) * pow(dl, 2.0) * 2.0;

    // ── diagonal light beam (the white-ish sweep across the ref image) ──
    float beam = (uv.x * 0.7 - uv.y * 1.2 + 0.3 + sin(t * 0.05) * 0.25);
    float bv = smoothstep(0.0, 0.18, beam) * (1.0 - smoothstep(0.18, 0.42, beam));
    vec3 cb = vec3(0.45, 0.20, 0.80) * bv * 0.55;

    // ── near-black base ──
    vec3 col = vec3(0.02, 0.01, 0.04) + cr + cr2 + cl + cb;

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
        uTime:       { value: 0 },
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uHueShift:   { value: hueShift },
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
