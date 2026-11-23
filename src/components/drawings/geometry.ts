/**
 * Desenhos técnicos procedurais (SVG), todos em uma prancha 400×500.
 * Cada função devolve traços, preenchimentos e textos; o componente
 * <Drawing/> cuida de animar o traço (pathLength) no scroll ou na entrada.
 */
import type { DrawingKind } from "@/content/site"

export type Weight = "main" | "thin" | "hair"
export type Stroke = { d: string; w: Weight; dash?: boolean }
export type Fill = { d: string; pattern: "hatch" | "dots" | "solid" | "paper" | "tone"; stroke?: boolean }
export type Label = { x: number; y: number; t: string; a?: "start" | "middle" | "end"; s?: number; r?: number; o?: number }
export type DrawingData = { strokes: Stroke[]; fills: Fill[]; labels: Label[] }

const f = (n: number) => Math.round(n * 100) / 100

export const R = (x: number, y: number, w: number, h: number) => `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`
export const L = (x1: number, y1: number, x2: number, y2: number) => `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`
export const PL = (pts: [number, number][], close = false) =>
  pts.map((p, i) => `${i ? "L" : "M"}${f(p[0])} ${f(p[1])}`).join("") + (close ? "Z" : "")
export const archOpen = (x: number, base: number, w: number, spring: number) =>
  `M${f(x)} ${f(base)}V${f(spring)}A${f(w / 2)} ${f(w / 2)} 0 0 1 ${f(x + w)} ${f(spring)}V${f(base)}`
export const archShape = (x: number, base: number, w: number, spring: number) => archOpen(x, base, w, spring) + "Z"
export const arc = (cx: number, cy: number, r: number) => `M${f(cx - r)} ${f(cy)}A${f(r)} ${f(r)} 0 0 1 ${f(cx + r)} ${f(cy)}`
export const circle = (cx: number, cy: number, r: number) =>
  `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0`

function dimH(x1: number, x2: number, y: number, t: string): { s: Stroke[]; l: Label[] } {
  return {
    s: [
      { d: L(x1 - 6, y, x2 + 6, y), w: "hair" },
      { d: L(x1 - 3, y + 3, x1 + 3, y - 3), w: "thin" },
      { d: L(x2 - 3, y + 3, x2 + 3, y - 3), w: "thin" },
      { d: L(x1, y - 6, x1, y + 6), w: "hair" },
      { d: L(x2, y - 6, x2, y + 6), w: "hair" },
    ],
    l: [{ x: (x1 + x2) / 2, y: y - 4, t, a: "middle", s: 7 }],
  }
}

function dimV(y1: number, y2: number, x: number, t: string): { s: Stroke[]; l: Label[] } {
  return {
    s: [
      { d: L(x, y1 - 6, x, y2 + 6), w: "hair" },
      { d: L(x - 3, y1 + 3, x + 3, y1 - 3), w: "thin" },
      { d: L(x - 3, y2 + 3, x + 3, y2 - 3), w: "thin" },
      { d: L(x - 6, y1, x + 6, y1), w: "hair" },
      { d: L(x - 6, y2, x + 6, y2), w: "hair" },
    ],
    l: [{ x: x - 4, y: (y1 + y2) / 2, t, a: "middle", s: 7, r: -90 }],
  }
}

function bubble(cx: number, cy: number, t: string): { s: Stroke[]; l: Label[] } {
  return { s: [{ d: circle(cx, cy, 7), w: "thin" }], l: [{ x: cx, y: cy + 2.6, t, a: "middle", s: 7.5 }] }
}

function level(x: number, y: number, t: string, dir: 1 | -1 = 1): { s: Stroke[]; l: Label[] } {
  return {
    s: [
      { d: PL([[x - 5, y - 6], [x + 5, y - 6], [x, y]], true), w: "thin" },
      { d: L(x, y, x + 34 * dir, y), w: "hair" },
    ],
    l: [{ x: x + 8 * dir, y: y - 9, t, a: dir === 1 ? "start" : "end", s: 7 }],
  }
}

function merge(...parts: { s: Stroke[]; l: Label[] }[]) {
  return { s: parts.flatMap((p) => p.s), l: parts.flatMap((p) => p.l) }
}

/* ---------------------------------------------------------------- */

function elevation(): DrawingData {
  const s: Stroke[] = []
  const fills: Fill[] = []
  const labels: Label[] = []
  const cx = 200
  const spring = 255
  const rIn = 68
  const rOut = 96

  // massa da parede
  s.push({ d: R(62, 118, 276, 300), w: "main" })
  // cornija
  s.push({ d: L(54, 118, 346, 118), w: "main" }, { d: L(54, 110, 346, 110), w: "thin" }, { d: L(58, 126, 342, 126), w: "hair" })
  // vão em arco
  s.push({ d: archOpen(cx - rIn, 418, rIn * 2, spring), w: "main" })
  s.push({ d: arc(cx, spring, rOut), w: "thin" })
  // aduelas
  const n = 15
  for (let i = 0; i <= n; i++) {
    const a = Math.PI - (i / n) * Math.PI
    const x1 = cx + Math.cos(a) * rIn
    const y1 = spring - Math.sin(a) * rIn
    const x2 = cx + Math.cos(a) * rOut
    const y2 = spring - Math.sin(a) * rOut
    s.push({ d: L(x1, y1, x2, y2), w: "hair" })
  }
  // impostas
  s.push({ d: R(cx - rIn - 14, spring, 14, 7), w: "thin" }, { d: R(cx + rIn, spring, 14, 7), w: "thin" })
  // juntas nos pilares
  for (let y = 278; y < 410; y += 20) {
    s.push({ d: L(62, y, cx - rIn - 14, y), w: "hair" }, { d: L(cx + rIn + 14, y, 338, y), w: "hair" })
  }
  for (let y = 142; y < 160; y += 16) s.push({ d: L(62, y, 338, y), w: "hair" })
  // embasamento e terreno
  s.push({ d: L(62, 400, cx - rIn, 400), w: "thin" }, { d: L(cx + rIn, 400, 338, 400), w: "thin" })
  s.push({ d: L(24, 418, 376, 418), w: "main" })
  fills.push({ d: R(24, 418, 352, 10), pattern: "hatch" })
  // eixos
  s.push({ d: L(cx, 84, cx, 446), w: "hair", dash: true }, { d: L(40, spring, 360, spring), w: "hair", dash: true })
  const m = merge(
    bubble(62, 84, "A"),
    bubble(cx, 72, "B"),
    bubble(338, 84, "C"),
    dimH(cx - rIn, cx + rIn, 448, "4,20"),
    dimV(spring - rIn, 418, 356, "5,80"),
    level(30, 418, "±0,00", 1),
    level(30, 118, "+7,40", 1),
  )
  s.push(...m.s)
  labels.push(...m.l)
  // "luz" no vão
  fills.push({ d: archShape(cx - rIn, 418, rIn * 2, spring), pattern: "tone" })
  labels.push({ x: 24, y: 482, t: "ELEVAÇÃO FRONTAL — ESC. 1:50", s: 7.5, o: 0.6 })
  return { strokes: s, fills, labels }
}

function plan(): DrawingData {
  const s: Stroke[] = []
  const fills: Fill[] = []
  const labels: Label[] = []
  const t = 9 // espessura de parede
  const X0 = 60, Y0 = 80, X1 = 340, Y1 = 420
  // paredes externas (poché) com vãos
  const walls: [number, number, number, number][] = [
    [X0, Y0, 70, t], [X0 + 120, Y0, 100, t], [X0 + 270, Y0, 10, t], // norte com 2 janelas
    [X0, Y1 - t, 90, t], [X0 + 150, Y1 - t, 130, t], // sul com porta
    [X0, Y0, t, 120], [X0, Y0 + 180, t, Y1 - Y0 - 180], // oeste
    [X1 - t, Y0, t, 150], [X1 - t, Y0 + 230, t, Y1 - Y0 - 230], // leste
    // internas
    [X0 + 150, Y0, t, 100], [X0 + 150, Y0 + 150, t, 60],
    [X0, Y0 + 210, 80, t], [X0 + 120, Y0 + 210, 39, t],
    [X0 + 159, Y0 + 210, 40, t],
  ]
  walls.forEach(([x, y, w, h]) => fills.push({ d: R(x, y, w, h), pattern: "solid" }))
  // janelas
  ;[[X0 + 70, Y0, 50], [X0 + 220, Y0, 50]].forEach(([x, y, w]) => {
    s.push({ d: L(x, y, x + w, y), w: "thin" }, { d: L(x, y + t / 2, x + w, y + t / 2), w: "hair" }, { d: L(x, y + t, x + w, y + t), w: "thin" })
  })
  s.push({ d: L(X1 - t, Y0 + 150, X1 - t, Y0 + 230), w: "thin" }, { d: L(X1, Y0 + 150, X1, Y0 + 230), w: "thin" }, { d: L(X1 - t / 2, Y0 + 150, X1 - t / 2, Y0 + 230), w: "hair" })
  // portas (folha + giro)
  const door = (hx: number, hy: number, w: number, dir: "up" | "right" | "down") => {
    if (dir === "up") {
      s.push({ d: L(hx, hy, hx, hy - w), w: "thin" }, { d: `M${hx} ${hy - w}A${w} ${w} 0 0 1 ${hx + w} ${hy}`, w: "hair", dash: true })
    } else if (dir === "right") {
      s.push({ d: L(hx, hy, hx + w, hy), w: "thin" }, { d: `M${hx + w} ${hy}A${w} ${w} 0 0 1 ${hx} ${hy + w}`, w: "hair", dash: true })
    } else {
      s.push({ d: L(hx, hy, hx, hy + w), w: "thin" }, { d: `M${hx} ${hy + w}A${w} ${w} 0 0 0 ${hx + w} ${hy}`, w: "hair", dash: true })
    }
  }
  door(X0 + 90, Y1 - t, 56, "up")
  door(X0 + 80, Y0 + 210 + t, 38, "down")
  door(X0 + 150 + t, Y0 + 100, 48, "right")
  // abside em arco (motivo da marca)
  s.push({ d: `M${X0} ${Y0 + 120}A30 30 0 0 0 ${X0} ${Y0 + 180}`, w: "main" }, { d: `M${X0 - t} ${Y0 + 120}A39 39 0 0 0 ${X0 - t} ${Y0 + 180}`, w: "thin" })
  // escada
  const sx = X0 + 200, sy = Y0 + 230
  for (let i = 0; i <= 9; i++) s.push({ d: L(sx, sy + i * 13, sx + 60, sy + i * 13), w: "hair" })
  s.push({ d: R(sx, sy, 60, 117), w: "thin" }, { d: L(sx + 30, sy + 110, sx + 30, sy + 10), w: "hair" }, { d: PL([[sx + 25, sy + 18], [sx + 30, sy + 8], [sx + 35, sy + 18]]), w: "hair" })
  // mesa e pilar central
  s.push({ d: circle(X0 + 230, Y0 + 95, 26), w: "thin" })
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    s.push({ d: circle(X0 + 230 + Math.cos(a) * 38, Y0 + 95 + Math.sin(a) * 38, 6), w: "hair" })
  }
  s.push({ d: R(X0 + 60, Y0 + 40, 70, 40), w: "hair" }, { d: R(X0 + 30, Y0 + 260, 80, 50), w: "hair" })
  // eixos
  const ax = [X0 + t / 2, X0 + 150 + t / 2, X1 - t / 2]
  const ay = [Y0 + t / 2, Y0 + 210 + t / 2, Y1 - t / 2]
  ax.forEach((x) => s.push({ d: L(x, 52, x, Y1 + 18), w: "hair", dash: true }))
  ay.forEach((y) => s.push({ d: L(34, y, X1 + 18, y), w: "hair", dash: true }))
  const m = merge(
    bubble(ax[0], 44, "1"), bubble(ax[1], 44, "2"), bubble(ax[2], 44, "3"),
    bubble(26, ay[0], "A"), bubble(26, ay[1], "B"), bubble(26, ay[2], "C"),
    dimH(ax[0], ax[1], Y1 + 32, "6,00"), dimH(ax[1], ax[2], Y1 + 32, "7,40"),
  )
  s.push(...m.s)
  labels.push(...m.l)
  labels.push(
    { x: X0 + 75, y: Y0 + 120, t: "ESTAR", a: "middle", s: 7, o: 0.55 },
    { x: X0 + 230, y: Y0 + 160, t: "JANTAR", a: "middle", s: 7, o: 0.55 },
    { x: X0 + 70, y: Y0 + 330, t: "ESTÚDIO", a: "middle", s: 7, o: 0.55 },
    { x: 24, y: 482, t: "PLANTA BAIXA — PAVIMENTO TÉRREO", s: 7.5, o: 0.6 },
  )
  return { strokes: s, fills, labels }
}

function section(): DrawingData {
  const s: Stroke[] = []
  const fills: Fill[] = []
  const labels: Label[] = []
  const G = 400
  // terreno
  s.push({ d: L(20, G, 380, G), w: "main" })
  fills.push({ d: R(20, G, 360, 26), pattern: "dots" })
  // lajes e paredes cortadas
  fills.push(
    { d: R(70, G - 12, 260, 12), pattern: "solid" },
    { d: R(70, 250, 260, 10), pattern: "solid" },
    { d: R(70, 120, 10, G - 120), pattern: "solid" },
    { d: R(320, 160, 10, G - 160), pattern: "solid" },
  )
  // abóbada (arco) sobre o pavimento superior
  s.push({ d: `M80 250V170A120 120 0 0 1 320 170`, w: "main" }, { d: `M70 250V170A130 130 0 0 1 330 170`, w: "thin" })
  // lanternim
  s.push({ d: R(178, 32, 44, 22), w: "thin" }, { d: L(200, 32, 200, 54), w: "hair" })
  // raios de luz
  for (let i = 0; i < 5; i++) {
    s.push({ d: L(180 + i * 9, 56, 120 + i * 30, 238), w: "hair", dash: true })
  }
  for (let i = 0; i < 4; i++) {
    s.push({ d: L(330, 290 + i * 14, 230 - i * 10, G - 14), w: "hair", dash: true })
  }
  // esquadria
  s.push({ d: R(320, 280, 10, 70), w: "thin" })
  // mobiliário / escala
  s.push({ d: R(110, 330, 70, 4), w: "thin" }, { d: L(118, 334, 118, G - 12), w: "hair" }, { d: L(172, 334, 172, G - 12), w: "hair" })
  s.push({ d: R(220, 210, 60, 40), w: "hair" })
  // fundação
  fills.push({ d: R(62, G, 26, 18), pattern: "solid" }, { d: R(312, G, 26, 18), pattern: "solid" })
  const m = merge(
    level(350, G - 12, "±0,00", 1),
    level(350, 250, "+3,20", 1),
    level(350, 50, "+8,10", 1),
    dimV(260, G - 12, 46, "3,20"),
  )
  s.push(...m.s)
  labels.push(...m.l)
  labels.push({ x: 24, y: 482, t: "CORTE AA — LUZ ZENITAL", s: 7.5, o: 0.6 })
  return { strokes: s, fills, labels }
}

function axon(): DrawingData {
  const s: Stroke[] = []
  const fills: Fill[] = []
  const labels: Label[] = []
  const S = 22
  const c30 = Math.cos(Math.PI / 6)
  const s30 = Math.sin(Math.PI / 6)
  const ox = 200, oy = 250
  const P = (x: number, y: number, z: number): [number, number] => [ox + (x - y) * c30 * S, oy + (x + y) * s30 * S - z * S]

  const box = (x: number, y: number, z: number, w: number, d: number, h: number) => {
    const top = PL([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], true)
    const right = PL([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], true)
    const left = PL([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], true)
    fills.push({ d: top, pattern: "paper", stroke: true }, { d: right, pattern: "tone", stroke: true }, { d: left, pattern: "paper", stroke: true })
    s.push({ d: top, w: "main" }, { d: right, w: "main" }, { d: left, w: "main" })
  }
  // grade de piso
  for (let i = -6; i <= 6; i += 2) {
    s.push({ d: PL([P(i, -6, 0), P(i, 8, 0)]), w: "hair", dash: true }, { d: PL([P(-6, i, 0), P(8, i, 0)]), w: "hair", dash: true })
  }
  box(-5, -3, 0, 6, 5, 2.4)
  box(-1, -1, 0, 7, 4, 4)
  box(-4, -3, 2.4, 3, 3, 3.2)
  // arcos na face frontal da caixa principal (plano y = 3)
  const archOnFace = (x0: number, w: number, zs: number) => {
    const pts: [number, number][] = [P(x0, 3, 0), P(x0, 3, zs)]
    for (let i = 0; i <= 16; i++) {
      const a = Math.PI - (i / 16) * Math.PI
      pts.push(P(x0 + w / 2 + Math.cos(a) * (w / 2), 3, zs + Math.sin(a) * (w / 2)))
    }
    pts.push(P(x0 + w, 3, 0))
    s.push({ d: PL(pts), w: "thin" })
    fills.push({ d: PL(pts, true), pattern: "solid" })
  }
  archOnFace(0, 1.4, 1.6)
  archOnFace(2.2, 1.4, 1.6)
  archOnFace(4.4, 1.4, 1.6)
  // linhas de laje
  s.push({ d: PL([P(-1, 3, 2), P(6, 3, 2)]), w: "hair" }, { d: PL([P(6, -1, 2), P(6, 3, 2)]), w: "hair" })
  // norte
  s.push({ d: circle(340, 70, 14), w: "thin" }, { d: PL([[340, 52], [346, 74], [340, 69], [334, 74]], true), w: "thin" })
  labels.push({ x: 340, y: 48, t: "N", a: "middle", s: 8 })
  labels.push({ x: 24, y: 482, t: "AXONOMETRIA — VOLUMETRIA", s: 7.5, o: 0.6 })
  return { strokes: s, fills, labels }
}

function detail(): DrawingData {
  const s: Stroke[] = []
  const fills: Fill[] = []
  const labels: Label[] = []
  // concreto
  fills.push({ d: R(150, 40, 60, 400), pattern: "dots", stroke: true })
  s.push({ d: R(150, 40, 60, 400), w: "main" })
  // isolamento (zigue-zague)
  const zz: [number, number][] = []
  for (let y = 40, i = 0; y <= 440; y += 10, i++) zz.push([i % 2 ? 212 : 236, y])
  s.push({ d: L(210, 40, 210, 440), w: "thin" }, { d: L(238, 40, 238, 440), w: "thin" }, { d: PL(zz), w: "hair" })
  // câmara de ar + inserts
  for (let y = 70; y < 440; y += 90) s.push({ d: R(238, y, 14, 6), w: "thin" })
  // revestimento em pedra
  fills.push({ d: R(252, 40, 22, 400), pattern: "hatch", stroke: true })
  s.push({ d: R(252, 40, 22, 400), w: "main" })
  for (let y = 100; y < 440; y += 60) s.push({ d: L(252, y, 274, y), w: "thin" })
  // reboco interno
  s.push({ d: L(144, 40, 144, 440), w: "hair" })
  // peitoril com pingadeira
  s.push({ d: PL([[150, 250], [300, 250], [300, 262], [292, 262], [292, 258], [150, 258]]), w: "main" })
  // caixilho
  s.push({ d: R(196, 160, 36, 90), w: "thin" }, { d: R(202, 166, 24, 78), w: "hair" }, { d: L(214, 166, 214, 244), w: "hair" })
  // chamadas
  const call = (x: number, y: number, tx: number, ty: number, t: string) => {
    s.push({ d: PL([[x, y], [tx - 4, ty], [tx + 30, ty]]), w: "hair" }, { d: circle(x, y, 1.8), w: "thin" })
    labels.push({ x: tx + 34, y: ty + 2.5, t, s: 7.2 })
  }
  call(180, 80, 300, 70, "01  CONCRETO APARENTE")
  call(224, 140, 300, 120, "02  ISOLAMENTO TÉRMICO")
  call(262, 200, 300, 170, "03  PEDRA NATURAL 3 cm")
  call(214, 220, 300, 300, "04  CAIXILHO DE ALUMÍNIO")
  call(296, 256, 300, 340, "05  PINGADEIRA")
  const m = merge(dimH(150, 210, 466, "20"), dimH(210, 274, 466, "6,4"))
  s.push(...m.s)
  labels.push(...m.l)
  s.push({ d: circle(70, 80, 28), w: "thin" }, { d: L(98, 80, 150, 80), w: "hair", dash: true })
  labels.push({ x: 70, y: 77, t: "D", a: "middle", s: 11 }, { x: 70, y: 90, t: "1:5", a: "middle", s: 7 })
  labels.push({ x: 24, y: 492, t: "DETALHE — PEITORIL E VEDAÇÃO", s: 7.5, o: 0.6 })
  return { strokes: s, fills, labels }
}

function facade(): DrawingData {
  const s: Stroke[] = []
  const fills: Fill[] = []
  const labels: Label[] = []
  const X0 = 70, X1 = 330, TOP = 70, G = 420
  s.push({ d: R(X0, TOP, X1 - X0, G - TOP), w: "main" })
  s.push({ d: L(X0 - 8, TOP, X1 + 8, TOP), w: "main" }, { d: L(X0 - 8, TOP - 6, X1 + 8, TOP - 6), w: "thin" })
  // pavimentos
  const floors = [TOP + 100, TOP + 200]
  floors.forEach((y) => s.push({ d: L(X0, y, X1, y), w: "thin" }))
  // janelas em arco nos pavimentos superiores
  const bays = 4
  const bw = (X1 - X0) / bays
  for (let f2 = 0; f2 < 2; f2++) {
    for (let b = 0; b < bays; b++) {
      const w = 28
      const x = X0 + b * bw + (bw - w) / 2
      const base = TOP + 88 + f2 * 100
      s.push({ d: archShape(x, base, w, base - 46), w: "thin" }, { d: L(x + w / 2, base, x + w / 2, base - 60), w: "hair" })
      fills.push({ d: archShape(x, base, w, base - 46), pattern: "tone" })
      s.push({ d: L(x - 4, base, x + w + 4, base), w: "thin" })
    }
  }
  // térreo com três grandes arcos
  for (let i = 0; i < 3; i++) {
    const w = 62
    const gap = (X1 - X0 - 3 * w) / 4
    const x = X0 + gap + i * (w + gap)
    s.push({ d: archOpen(x, G, w, G - 70), w: "main" })
    fills.push({ d: archShape(x, G, w, G - 70), pattern: "hatch" })
  }
  // terreno
  s.push({ d: L(20, G, 380, G), w: "main" })
  // árvore esquemática
  s.push({ d: circle(358, 330, 22), w: "hair" }, { d: circle(352, 322, 14), w: "hair" }, { d: L(358, 352, 358, G), w: "thin" })
  const m = merge(dimV(TOP, G, 46, "11,00"), dimH(X0, X1, 446, "13,00"))
  s.push(...m.s)
  labels.push(...m.l)
  labels.push({ x: 24, y: 482, t: "FACHADA PRINCIPAL", s: 7.5, o: 0.6 })
  return { strokes: s, fills, labels }
}

const cache = new Map<DrawingKind, DrawingData>()
const makers: Record<DrawingKind, () => DrawingData> = { elevation, plan, section, axon, detail, facade }

export function getDrawing(kind: DrawingKind): DrawingData {
  let d = cache.get(kind)
  if (!d) {
    d = makers[kind]()
    cache.set(kind, d)
  }
  return d
}
