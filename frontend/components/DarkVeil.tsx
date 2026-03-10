'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
  className?: string;
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
}

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x   + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorRamp {
  vec3 colors[3];
  float positions[3];
  int count;
};

vec3 rampColor(ColorRamp ramp, float t) {
  vec3 outColor = ramp.colors[0];
  for (int i = 0; i < 2; i++) {
    float s = ramp.positions[i];
    float e = ramp.positions[i + 1];
    float f = clamp((t - s) / (e - s), 0.0, 1.0);
    outColor = mix(outColor, ramp.colors[i + 1], f);
  }
  return outColor;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorRamp cr;
  cr.colors[0] = uColorStops[0];
  cr.colors[1] = uColorStops[1];
  cr.colors[2] = uColorStops[2];
  cr.positions[0] = 0.0;
  cr.positions[1] = 0.5;
  cr.positions[2] = 1.0;
  cr.count = 3;

  vec3 color = rampColor(cr, uv.x);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * color;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

export default function DarkVeil({
  speed       = 1.0,
  amplitude   = 1.2,
  blend       = 0.6,
  colorStops  = ['#3b0764', '#c026d3', '#1e1b4b'],
  className   = '',
  // legacy props kept for API compatibility
  hueShift,
  noiseIntensity,
  scanlineIntensity,
  scanlineFrequency,
  warpAmount,
  resolutionScale,
}: DarkVeilProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const propsRef     = useRef({ speed, amplitude, blend, colorStops });
  propsRef.current   = { speed, amplitude, blend, colorStops };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    Object.assign(gl.canvas.style, {
      position: 'absolute',
      top: '0', left: '0',
      width: '100%', height: '100%',
      display: 'block',
      backgroundColor: 'transparent',
    });
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    if ((geometry.attributes as Record<string, unknown>).uv) {
      delete (geometry.attributes as Record<string, unknown>).uv;
    }

    const colorStopsArray = colorStops.map(hex => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    let program = new Program(gl, {
      vertex:   VERT,
      fragment: FRAG,
      uniforms: {
        uTime:       { value: 0 },
        uAmplitude:  { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uBlend:      { value: blend },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const tick = (t: number) => {
      rafRef.current = requestAnimationFrame(tick);
      const { time = t * 0.01, speed: s = 1.0 } = { time: t * 0.01, speed: propsRef.current.speed };
      program.uniforms.uTime.value      = time * s * 0.1;
      program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.2;
      program.uniforms.uBlend.value     = propsRef.current.blend ?? 0.6;
      program.uniforms.uColorStops.value = propsRef.current.colorStops.map(hex => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });
      renderer.render({ scene: mesh });
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'block' }}
    />
  );
}
