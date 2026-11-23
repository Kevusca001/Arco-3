import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

/**
 * Relevo perfurado: uma superfície mineral com um campo de concavidades
 * esféricas iluminadas por uma luz rasante que gira lentamente.
 * Tudo em shader — sem imagens.
 */
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec3 uInk;
  uniform vec3 uPaper;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    p += uMouse * 0.015;

    float N = 34.0;
    vec2 g = p * N;
    vec2 id = floor(g);
    vec2 cell = fract(g) - 0.5;
    vec2 cp = (id + 0.5) / N;

    // campo circular de perfurações, com onda lenta
    float r0 = length(cp - vec2(0.04, 0.0));
    float wave = sin(r0 * 16.0 - uTime * 0.9) * 0.5 + 0.5;
    float mask = smoothstep(0.6, 0.06, r0);
    float rad = mix(0.03, 0.33, mask * (0.55 + 0.45 * wave));

    vec2 c = cell * vec2(0.9, 1.3);
    float d = length(c);
    float inside = 1.0 - smoothstep(rad - 0.02, rad, d);
    float s = sqrt(max(rad * rad - d * d, 0.0));
    s = max(s, rad * 0.3);
    vec2 grad = inside * (c / s);

    // ondulação da superfície (como pedra levemente trabalhada)
    float n1 = noise(p * 5.0 + uTime * 0.03);
    vec2 base = vec2(noise(p * 3.0 + 4.0) - 0.5, noise(p * 3.0 + 9.0) - 0.5) * 0.35;

    vec3 nrm = normalize(vec3(-grad * 0.85 + base, 1.0));
    float la = uTime * 0.12 + uMouse.x * 0.6;
    vec3 L = normalize(vec3(cos(la) * 0.7, 0.55 + uMouse.y * 0.25, 0.6));
    float diff = clamp(dot(nrm, L), 0.0, 1.0);
    float ao = 1.0 - inside * smoothstep(rad, 0.0, d) * 0.45;

    // faixa diagonal de sombra (uma viga fora do quadro)
    vec2 q = rot(-0.55) * p;
    float band = smoothstep(0.16, 0.0, abs(q.y - 0.32 - sin(uTime * 0.07) * 0.05)) * 0.28;

    float shade = (0.3 + 0.62 * diff) * ao * (0.92 + n1 * 0.12) - band;
    // vinheta
    shade *= 1.0 - smoothstep(0.45, 1.1, length(p * vec2(0.8, 1.0))) * 0.35;
    // a mistura acontece em espaço linear: curva para manter o relevo em tom médio-escuro
    shade = clamp(shade * 0.66, 0.0, 1.0);
    shade = shade * shade * 0.95;

    vec3 col = mix(uInk, uPaper, shade);
    col += (hash(vUv * uRes + fract(uTime) * 100.0) - 0.5) * 0.035;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

function Plane({ ink, paper }: { ink: string; paper: string }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { size, pointer } = useThree()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uInk: { value: new THREE.Color(ink) },
      uPaper: { value: new THREE.Color(paper) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    uniforms.uInk.value.set(ink)
    uniforms.uPaper.value.set(paper)
  }, [ink, paper, uniforms])

  useFrame((_, dt) => {
    uniforms.uTime.value += dt
    uniforms.uRes.value.set(size.width, size.height)
    uniforms.uMouse.value.lerp(pointer, 0.04)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  )
}

export default function ReliefScene({ active, ink, paper }: { active: boolean; ink: string; paper: string }) {
  return (
    <Canvas flat dpr={[1, 1.5]} frameloop={active ? "always" : "never"} gl={{ antialias: false, alpha: false }} aria-hidden="true">
      <Plane ink={ink} paper={paper} />
    </Canvas>
  )
}
