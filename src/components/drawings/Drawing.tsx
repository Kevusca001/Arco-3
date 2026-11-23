import { useId, useMemo } from "react"
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion"
import type { DrawingKind } from "@/content/site"
import { cn } from "@/lib/utils"
import { getDrawing, type Stroke, type Fill, type Label } from "./geometry"

const WIDTH: Record<Stroke["w"], number> = { main: 1.35, thin: 0.8, hair: 0.5 }

type Props = {
  kind: DrawingKind
  className?: string
  /** "view": traça ao entrar na tela · "progress": traça conforme o valor (0–1) · "static" */
  mode?: "view" | "progress" | "static"
  progress?: MotionValue<number>
  /** Duração total do traço no modo "view" (s) */
  duration?: number
  delay?: number
}

export function Drawing({ kind, className, mode = "view", progress, duration = 2.2, delay = 0 }: Props) {
  const data = useMemo(() => getDrawing(kind), [kind])
  const reduce = useReducedMotion()
  const uid = useId().replace(/:/g, "")
  const effective = reduce ? "static" : mode

  return (
    <svg viewBox="0 0 400 500" className={cn("block h-full w-full overflow-visible", className)} aria-hidden="true">
      <defs>
        <pattern id={`h-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <pattern id={`d-${uid}`} width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.55" fill="currentColor" />
          <circle cx="5" cy="4.6" r="0.35" fill="currentColor" />
        </pattern>
      </defs>

      <g>
        {data.fills.map((fl, i) =>
          effective === "progress" && progress ? (
            <ProgressFill key={i} fill={fl} uid={uid} progress={progress} />
          ) : (
            <motion.path
              key={i}
              d={fl.d}
              {...fillAttrs(fl, uid)}
              initial={effective === "view" ? { opacity: 0 } : false}
              whileInView={effective === "view" ? { opacity: 1 } : undefined}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1, delay: delay + duration * 0.6 }}
            />
          ),
        )}
      </g>

      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {data.strokes.map((st, i) => {
          const n = data.strokes.length
          if (effective === "progress" && progress) {
            const start = (i / n) * 0.62
            return <ProgressStroke key={i} stroke={st} progress={progress} start={start} end={start + 0.38} />
          }
          return (
            <motion.path
              key={i}
              d={st.d}
              strokeWidth={WIDTH[st.w]}
              strokeDasharray={st.dash ? "3 3" : undefined}
              initial={effective === "view" ? (st.dash ? { opacity: 0 } : { pathLength: 0, opacity: 0 }) : false}
              whileInView={effective === "view" ? (st.dash ? { opacity: 1 } : { pathLength: 1, opacity: 1 }) : undefined}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                pathLength: { duration: 1.1, delay: delay + (i / n) * duration * 0.6, ease: [0.65, 0, 0.35, 1] },
                opacity: { duration: st.dash ? 0.9 : 0.2, delay: delay + (i / n) * duration * 0.6 },
              }}
            />
          )
        })}
      </g>

      <g fill="currentColor" fontFamily="var(--font-sans)">
        {data.labels.map((lb, i) =>
          effective === "progress" && progress ? (
            <ProgressLabel key={i} label={lb} progress={progress} />
          ) : (
            <motion.text
              key={i}
              {...labelAttrs(lb)}
              initial={effective === "view" ? { opacity: 0 } : false}
              whileInView={effective === "view" ? { opacity: lb.o ?? 0.85 } : undefined}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: delay + duration * 0.7 }}
            >
              {lb.t}
            </motion.text>
          ),
        )}
      </g>
    </svg>
  )
}

function fillAttrs(fl: Fill, uid: string) {
  switch (fl.pattern) {
    case "hatch":
      return { fill: `url(#h-${uid})`, opacity: 0.9 }
    case "dots":
      return { fill: `url(#d-${uid})` }
    case "solid":
      return { fill: "currentColor" }
    case "tone":
      return { fill: "currentColor", fillOpacity: 0.07 }
    case "paper":
      return { fill: "var(--drawing-bg, var(--paper))" }
  }
}

function labelAttrs(lb: Label) {
  return {
    x: lb.x,
    y: lb.y,
    fontSize: lb.s ?? 7,
    textAnchor: lb.a ?? "start",
    letterSpacing: "0.04em",
    transform: lb.r ? `rotate(${lb.r} ${lb.x} ${lb.y})` : undefined,
    style: { opacity: lb.o ?? 0.85 },
  }
}

function ProgressStroke({ stroke, progress, start, end }: { stroke: Stroke; progress: MotionValue<number>; start: number; end: number }) {
  const pathLength = useTransform(progress, [start, end], [0, 1], { clamp: true })
  const opacity = useTransform(progress, stroke.dash ? [start, end] : [start, start + 0.02], [0, 1], { clamp: true })
  return (
    <motion.path
      d={stroke.d}
      strokeWidth={WIDTH[stroke.w]}
      strokeDasharray={stroke.dash ? "3 3" : undefined}
      style={stroke.dash ? { opacity } : { pathLength, opacity }}
    />
  )
}

function ProgressFill({ fill, uid, progress }: { fill: Fill; uid: string; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.55, 0.9], [0, 1], { clamp: true })
  const attrs = fillAttrs(fill, uid)
  return <motion.path d={fill.d} {...attrs} style={{ opacity }} />
}

function ProgressLabel({ label, progress }: { label: Label; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.6, 0.95], [0, label.o ?? 0.85], { clamp: true })
  const { style: _style, ...rest } = labelAttrs(label)
  void _style
  return (
    <motion.text {...rest} style={{ opacity }}>
      {label.t}
    </motion.text>
  )
}
