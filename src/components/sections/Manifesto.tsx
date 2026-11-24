import { lazy, Suspense, useRef, useState } from "react"
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion"
import { site } from "@/content/site"
import { useTheme } from "@/lib/theme"
import { useInViewport } from "@/hooks/useInViewport"
import { cn } from "@/lib/utils"

const ArcadeScene = lazy(() => import("@/components/three/ArcadeScene"))

const STACK_POS = ["md:ml-[33%]", "md:ml-[50%]", "md:ml-[30%]"]

/**
 * Filosofia: frase que acende palavra por palavra → voo por uma colunata
 * de arcos (Three.js) → "Nós ver / ouvir / tocar / sentir".
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const { colors } = useTheme()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const visible = useInViewport(ref, "200px")
  const mounted = useRef(false)
  if (visible) mounted.current = true

  const stackOpacity = useTransform(scrollYProgress, [0.12, 0.2], [1, 0])
  const stackScale = useTransform(scrollYProgress, [0.08, 0.2], [1, 0.94])
  const stackBlur = useTransform(scrollYProgress, [0.1, 0.2], ["blur(0px)", "blur(8px)"])
  const canvasOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.8, 0.9], [0, 1, 1, 0.18])
  const weOpacity = useTransform(scrollYProgress, [0.8, 0.86], [0, 1])

  return (
    <section id="filosofia" ref={ref} aria-label="Filosofia" className="relative h-[430svh] bg-ink text-paper md:h-[560svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ opacity: canvasOpacity }}>
          {mounted.current && (
            <Suspense fallback={null}>
              <ArcadeScene
                progress={scrollYProgress}
                active={visible}
                ink={colors.ink}
                paper={colors.paper}
                words={[...site.manifesto.floating]}
                senses={[...site.manifesto.senses]}
              />
            </Suspense>
          )}
        </motion.div>

        {/* Fase 1: frase empilhada que acende */}
        <motion.h2
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-[var(--gutter)] text-[clamp(3rem,7.4vw,8.5rem)] leading-[0.92] tracking-[-0.05em]"
          style={{ opacity: stackOpacity, scale: stackScale, filter: stackBlur }}
        >
          {site.manifesto.stack.map((w, i) => (
            <StackWord key={w} word={w} index={i} progress={scrollYProgress} className={STACK_POS[i]} />
          ))}
        </motion.h2>

        {/* Fase 3: Nós + sentidos */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: weOpacity }}>
          <Senses progress={scrollYProgress} />
        </motion.div>

        <Hint progress={scrollYProgress} />
      </div>
    </section>
  )
}

function StackWord({ word, index, progress, className }: { word: string; index: number; progress: MotionValue<number>; className?: string }) {
  const start = 0.005 + index * 0.03
  const opacity = useTransform(progress, [start, start + 0.025], [0.28, 1])
  return (
    <motion.span className={cn("block w-fit", className)} style={{ opacity }}>
      {word}
    </motion.span>
  )
}

function Senses({ progress }: { progress: MotionValue<number> }) {
  const senses = site.manifesto.senses
  const [active, setActive] = useState(0)
  useMotionValueEvent(progress, "change", (p) => {
    const i = Math.min(senses.length - 1, Math.max(0, Math.floor((p - 0.84) / 0.035)))
    setActive(i)
  })
  return (
    <div className="absolute inset-0 grid grid-cols-8 items-center px-[var(--gutter)] md:px-0">
      <span className="col-span-4 text-[clamp(4.5rem,15vw,17rem)] leading-none tracking-[-0.06em] uppercase md:col-span-3 md:col-start-2">
        {site.manifesto.we}
      </span>
      <div className="relative col-span-4 h-[clamp(3rem,6vw,6.5rem)] md:col-span-3 md:col-start-6">
        <motion.ul
          className="absolute top-0 left-0"
          animate={{ y: `${-active * 100}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
          style={{ height: "100%" }}
        >
          {senses.map((s, i) => (
            <li
              key={s}
              className={cn(
                "h-full text-[clamp(3rem,6vw,6.5rem)] leading-none tracking-[-0.05em] lowercase transition-opacity duration-500",
                i === active ? "opacity-100" : "opacity-20",
              )}
            >
              {s}
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}

function Hint({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.2, 0.26, 0.74, 0.8], [0, 1, 1, 0])
  const pct = useTransform(progress, (p) => String(Math.round(Math.min(1, Math.max(0, (p - 0.12) / 0.76)) * 100)).padStart(3, "0"))
  return (
    <motion.div
      className="t-label pointer-events-none absolute right-[var(--gutter)] bottom-3 flex items-center gap-6 text-paper/70"
      style={{ opacity }}
    >
      <span>Forma · Luz · Matéria</span>
      <span className="tabular-nums">
        <motion.span>{pct}</motion.span>
        <span className="opacity-50"> / 100</span>
      </span>
    </motion.div>
  )
}
