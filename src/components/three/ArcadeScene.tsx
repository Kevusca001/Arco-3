import { useEffect, useMemo, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import type { MotionValue } from "framer-motion"

/* -------------------------------------------------------------------------- */
/*  Geometria                                                                  */
/* -------------------------------------------------------------------------- */

/** Painel de parede com vão em arco, extrudado e convertido em arestas. */
function archPanelEdges(w: number, h: number, openW: number, spring: number, depth: number) {
  const shape = new THREE.Shape()
  shape.moveTo(-w / 2, 0)
  shape.lineTo(w / 2, 0)
  shape.lineTo(w / 2, h)
  shape.lineTo(-w / 2, h)
  shape.lineTo(-w / 2, 0)
  const r = openW / 2
  const hole = new THREE.Path()
  hole.moveTo(-r, 0)
  hole.lineTo(-r, spring)
  hole.absarc(0, spring, r, Math.PI, 0, true)
  hole.lineTo(r, 0)
  hole.lineTo(-r, 0)
  shape.holes.push(hole)
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 40 })
  geo.translate(0, 0, -depth / 2)
  const edges = new THREE.EdgesGeometry(geo, 20)
  geo.dispose()
  return edges
}

function floorGrid(width: number, near: number, far: number, step: number) {
  const pts: number[] = []
  for (let x = -width / 2; x <= width / 2 + 0.001; x += step) pts.push(x, 0, near, x, 0, far)
  for (let z = near; z >= far; z -= step) pts.push(-width / 2, 0, z, width / 2, 0, z)
  const g = new THREE.BufferGeometry()
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3))
  return g
}

/* -------------------------------------------------------------------------- */
/*  Palavras como texturas (usa a fonte do site já carregada)                  */
/* -------------------------------------------------------------------------- */

function makeWordTexture(word: string, color: string, italic = false) {
  const font = `${italic ? "italic " : ""}500 160px "Inter Tight Variable", "Helvetica Neue", Arial, sans-serif`
  const c = document.createElement("canvas")
  const ctx = c.getContext("2d")!
  ctx.font = font
  const m = ctx.measureText(word)
  const pad = 24
  c.width = Math.ceil(m.width + pad * 2)
  c.height = 210
  ctx.font = font
  ctx.fillStyle = color
  ctx.textBaseline = "middle"
  // tracking levemente negativo, como no restante do site
  ctx.letterSpacing = "-6px"
  ctx.fillText(word, pad, c.height / 2 + 6)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  tex.needsUpdate = true
  return { tex, aspect: c.width / c.height }
}

type WordSpec = {
  word: string
  pos: [number, number, number]
  rot: [number, number, number]
  size: number
  opacity: number
  italic?: boolean
}

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/* -------------------------------------------------------------------------- */
/*  Cena                                                                       */
/* -------------------------------------------------------------------------- */

const PORTALS = 14
const SPACING = 5.2
const SIDE_STEP = 2.6

function Arcade({ line, words, senses }: { line: string; words: string[]; senses: string[] }) {
  const portal = useMemo(() => archPanelEdges(10, 7.4, 4.6, 3.6, 0.8), [])
  const side = useMemo(() => archPanelEdges(SIDE_STEP, 4.8, 1.8, 2.7, 0.35), [])
  const grid = useMemo(() => floorGrid(10, 6, -PORTALS * SPACING, 1.3), [])

  const matStrong = useMemo(() => new THREE.LineBasicMaterial({ color: line, transparent: true, opacity: 0.55, fog: true }), [line])
  const matSoft = useMemo(() => new THREE.LineBasicMaterial({ color: line, transparent: true, opacity: 0.22, fog: true }), [line])
  const matGrid = useMemo(() => new THREE.LineBasicMaterial({ color: line, transparent: true, opacity: 0.08, fog: true }), [line])

  useEffect(() => () => [portal, side, grid].forEach((g) => g.dispose()), [portal, side, grid])
  useEffect(() => () => [matStrong, matSoft, matGrid].forEach((m) => m.dispose()), [matStrong, matSoft, matGrid])

  const sideCount = Math.floor((PORTALS * SPACING) / SIDE_STEP)

  const specs = useMemo<WordSpec[]>(() => {
    const r = rng(7)
    const out: WordSpec[] = []
    for (let i = 0; i < PORTALS; i++) {
      const z = -i * SPACING + 0.42
      const w = words[i % words.length]
      const left = i % 2 === 0
      // nas pilastras do pórtico, por vezes na vertical
      out.push({
        word: w,
        pos: [left ? -3.6 : 3.6, 2.4 + r() * 2.2, z],
        rot: [0, 0, r() > 0.55 ? (left ? Math.PI / 2 : -Math.PI / 2) : 0],
        size: 0.55 + r() * 0.35,
        opacity: 0.35 + r() * 0.6,
      })
      // nas paredes laterais
      out.push({
        word: words[(i + 3) % words.length],
        pos: [left ? 5.42 : -5.42, 1.2 + r() * 2.6, z - SPACING / 2],
        rot: [0, left ? -Math.PI / 2 : Math.PI / 2, 0],
        size: 0.42 + r() * 0.4,
        opacity: 0.18 + r() * 0.4,
      })
      // sentidos, menores e em itálico, como notas de margem
      if (i % 2 === 1) {
        out.push({
          word: senses[i % senses.length],
          pos: [(r() - 0.5) * 3.2, 5.6 + r() * 0.8, z - 0.1],
          rot: [0, 0, (r() - 0.5) * 0.4],
          size: 0.3,
          opacity: 0.3,
          italic: true,
        })
      }
    }
    return out
  }, [words, senses])

  return (
    <group>
      <lineSegments geometry={grid} material={matGrid} />
      {Array.from({ length: PORTALS }, (_, i) => (
        <lineSegments key={`p${i}`} geometry={portal} material={matStrong} position={[0, 0, -i * SPACING]} />
      ))}
      {Array.from({ length: sideCount }, (_, i) => (
        <group key={`s${i}`}>
          <lineSegments geometry={side} material={matSoft} position={[-5.6, 0, -i * SIDE_STEP]} rotation={[0, Math.PI / 2, 0]} />
          <lineSegments geometry={side} material={matSoft} position={[5.6, 0, -i * SIDE_STEP]} rotation={[0, -Math.PI / 2, 0]} />
        </group>
      ))}
      <Words specs={specs} color={line} />
    </group>
  )
}

function Words({ specs, color }: { specs: WordSpec[]; color: string }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    const fonts = document.fonts?.load('500 160px "Inter Tight Variable"') ?? Promise.resolve()
    fonts.finally(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])

  const textures = useMemo(() => {
    if (!ready) return null
    const map = new Map<string, { tex: THREE.CanvasTexture; aspect: number }>()
    specs.forEach((s) => {
      const k = `${s.word}|${s.italic ? 1 : 0}`
      if (!map.has(k)) map.set(k, makeWordTexture(s.word, color, s.italic))
    })
    return map
  }, [ready, specs, color])

  useEffect(() => () => textures?.forEach((t) => t.tex.dispose()), [textures])

  if (!textures) return null
  return (
    <group>
      {specs.map((s, i) => {
        const t = textures.get(`${s.word}|${s.italic ? 1 : 0}`)!
        return (
          <mesh key={i} position={s.pos} rotation={s.rot}>
            <planeGeometry args={[s.size * t.aspect, s.size]} />
            <meshBasicMaterial map={t.tex} transparent opacity={s.opacity} depthWrite={false} side={THREE.DoubleSide} fog />
          </mesh>
        )
      })}
    </group>
  )
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function Rig({ progress }: { progress: MotionValue<number> }) {
  const { camera, pointer } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const lookCur = useMemo(() => new THREE.Vector3(0, 2.6, 0), [])

  useFrame((_, dt) => {
    const p = progress.get()
    const t = ease(THREE.MathUtils.clamp((p - 0.12) / 0.76, 0, 1))
    const z = THREE.MathUtils.lerp(11, -(PORTALS - 3) * SPACING, t)
    target.set(Math.sin(t * Math.PI * 2.2) * 1.4 + pointer.x * 0.5, 2 + Math.sin(t * Math.PI) * 0.9 + pointer.y * 0.25, z)
    look.set(Math.sin(t * Math.PI * 2.2 + 0.6) * 1.8, 2.8 - t * 0.6, z - 9)
    const k = 1 - Math.pow(0.0015, dt)
    camera.position.lerp(target, k)
    lookCur.lerp(look, k)
    camera.lookAt(lookCur)
    camera.rotation.z += Math.sin(t * Math.PI * 2) * 0.06
  })
  return null
}

export default function ArcadeScene({
  progress,
  active,
  ink,
  paper,
  words,
  senses,
}: {
  progress: MotionValue<number>
  active: boolean
  ink: string
  paper: string
  words: string[]
  senses: string[]
}) {
  return (
    <Canvas
      flat
      dpr={[1, typeof window !== "undefined" && window.innerWidth < 768 ? 1.35 : 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 52, near: 0.1, far: 90, position: [0, 2, 11] }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <color attach="background" args={[ink]} />
      <fog attach="fog" args={[ink, 4, 34]} />
      <Arcade line={paper} words={words} senses={senses} />
      <Rig progress={progress} />
    </Canvas>
  )
}
