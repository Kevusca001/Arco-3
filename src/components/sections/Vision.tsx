import { lazy, Suspense, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion"
import { site } from "@/content/site"
import { useTheme } from "@/lib/theme"
import { useInViewport } from "@/hooks/useInViewport"
import { Counter } from "@/components/layout/Counter"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"

const ReliefScene = lazy(() => import("@/components/three/ReliefScene"))

/**
 * Nossa visão — três estados em uma única tela fixa:
 * 01 Firme (relevo em shader) · 02 Preciso (malha em perspectiva) · 03 Sereno (papel).
 */
export function Vision() {
  const ref = useRef<HTMLElement>(null)
  const { colors } = useTheme()
  const visible = useInViewport(ref, "100px")
  const mounted = useRef(false)
  if (visible) mounted.current = true
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const items = site.vision.items
  const [idx, setIdx] = useState(0)

  useMotionValueEvent(p, "change", (v) => setIdx(Math.min(items.length - 1, Math.floor(v * items.length * 0.999))))

  // fundos
  const reliefOpacity = useTransform(p, [0, 0.3, 0.38], [1, 1, 0])
  const gridOpacity = useTransform(p, [0.3, 0.38, 0.62, 0.7], [0, 1, 1, 0])
  const paperOpacity = useTransform(p, [0.5, 0.68], [0, 1])
  const inkText = useTransform(p, [0.55, 0.66], [0, 1])

  const item = items[idx]

  return (
    <section ref={ref} aria-label={site.vision.label} className="relative h-[360svh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ opacity: reliefOpacity }}>
          {mounted.current && (
            <Suspense fallback={null}>
              <ReliefScene active={visible && idx === 0} ink={colors.ink} paper={colors.paper} />
            </Suspense>
          )}
        </motion.div>

        <motion.div className="absolute inset-0" style={{ opacity: gridOpacity }}>
          <PerspectiveGrid progress={p} />
        </motion.div>

        <motion.div className="absolute inset-0 bg-paper" style={{ opacity: paperOpacity }}>
          <FineGrid progress={p} />
        </motion.div>

        {/* cruz de construção */}
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute top-1/2 right-0 left-0 h-px bg-paper/15 mix-blend-difference" />
          <span className="absolute top-0 bottom-0 left-[50%] hidden w-px bg-paper/15 mix-blend-difference md:block" />
        </div>

        <TextLayer item={item} idx={idx} inkMix={inkText} total={items.length} />
      </div>
    </section>
  )
}

function TextLayer({
  item,
  idx,
  inkMix,
  total,
}: {
  item: (typeof site.vision.items)[number]
  idx: number
  inkMix: MotionValue<number>
  total: number
}) {
  const color = useTransform(inkMix, [0, 1], ["var(--paper)", "var(--ink)"])
  return (
    <motion.div className="absolute inset-0" style={{ color }}>
      <div className="absolute inset-x-0 top-1/2 grid grid-cols-8 px-[var(--gutter)] md:px-0">
        <div className="relative col-span-8 h-[1.02em] overflow-hidden text-[clamp(4rem,9.5vw,10.5rem)] leading-[1] tracking-[-0.055em] md:col-span-3 md:col-start-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h3
              key={item.title}
              className="absolute top-0 left-0"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
            >
              {item.title}
            </motion.h3>
          </AnimatePresence>
        </div>
        <div className="col-span-8 mt-6 max-w-[22rem] md:col-span-3 md:col-start-5 md:mt-0 md:pl-[var(--gutter)] md:pt-3">
          <TextGenerateEffect key={item.title} words={item.text} className="t-body" delay={0.25} />
        </div>
      </div>

      <Counter
        label={site.vision.label}
        index={idx + 1}
        total={total}
        className="absolute bottom-3 left-[var(--gutter)] ml-[7.5rem] md:left-[50%] md:ml-0 md:pl-[var(--gutter)]"
      />
    </motion.div>
  )
}

/** Malha em perspectiva que "deita" e se adensa com o scroll. */
function PerspectiveGrid({ progress }: { progress: MotionValue<number> }) {
  const rotateX = useTransform(progress, [0.3, 0.66], [62, 0])
  const scale = useTransform(progress, [0.3, 0.66], [2.4, 1])
  const size = useTransform(progress, [0.3, 0.66], [9, 4.5])
  const bgSize = useTransform(size, (s) => `${s}vw ${s}vw`)
  return (
    <div className="absolute inset-0 bg-ink [perspective:900px]">
      <motion.div
        className="absolute inset-[-20%] origin-center"
        style={{
          rotateX,
          scale,
          backgroundSize: bgSize,
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--paper) 30%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--paper) 30%, transparent) 1px, transparent 1px)",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </div>
  )
}

/** Papel milimetrado que se dissolve até restar só o papel. */
function FineGrid({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.6, 0.72, 0.86], [0, 0.9, 0])
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        opacity,
        backgroundSize: "1.15vw 1.15vw",
        backgroundImage:
          "linear-gradient(to right, color-mix(in oklab, var(--ink) 14%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--ink) 14%, transparent) 1px, transparent 1px)",
      }}
    />
  )
}
