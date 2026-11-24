import { useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion"
import { site } from "@/content/site"
import SplitText from "@/components/reactbits/SplitText"
import { Drawing } from "@/components/drawings/Drawing"
import { Counter } from "@/components/layout/Counter"

/**
 * Nossa abordagem — quatro princípios; no centro, a prancha técnica
 * correspondente é traçada conforme o scroll.
 */
export function Approach() {
  const a = site.approach
  return (
    <section aria-label={a.label} className="relative bg-paper text-ink">
      <Intro />
      <Principles />
    </section>
  )
}

function Intro() {
  const a = site.approach
  return (
    <div className="relative grid grid-cols-8 content-center gap-y-8 px-[var(--gutter)] pt-24 pb-16 md:min-h-[100svh] md:gap-y-10 md:py-32 md:px-0">
      <span className="absolute top-0 bottom-0 left-[12.5%] hidden w-px bg-ink/10 md:block" />
      <p className="t-label col-span-8 text-stone md:col-span-1 md:col-start-2">{a.label}</p>
      <h2 className="col-span-8 md:col-span-6 md:col-start-2">
        {a.title.map((line, i) => (
          <SplitText
            key={line}
            text={line}
            tag="span"
            className="block text-[clamp(2.4rem,5.2vw,5.6rem)] leading-[1] tracking-[-0.045em]"
            textAlign="left"
            splitType="words"
            effect="rise"
            mask
            delay={70 + i * 30}
            duration={1.1}
            threshold={0.2}
          />
        ))}
      </h2>
      <p className="t-body col-span-8 max-w-[26rem] text-ink/80 md:col-span-3 md:col-start-6">{a.lead}</p>
    </div>
  )
}

function Principles() {
  const ref = useRef<HTMLDivElement>(null)
  const items = site.approach.items
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const [idx, setIdx] = useState(0)
  useMotionValueEvent(p, "change", (v) => setIdx(Math.min(items.length - 1, Math.floor(v * items.length * 0.9999))))
  const item = items[idx]

  return (
    <div ref={ref} className="relative h-[calc(var(--n)*75svh)] md:h-[calc(var(--n)*105svh)]" style={{ ["--n" as string]: items.length }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <span className="absolute top-[calc(var(--header-h)+40svh+1.75rem)] right-0 left-0 h-px bg-ink/10 md:top-1/2" />
        <span className="absolute top-0 bottom-0 left-[50%] hidden w-px bg-ink/10 md:block" />

        {/* prancha central */}
        <div className="absolute top-[calc(var(--header-h)+1rem)] left-1/2 h-[40svh] w-[min(64vw,22rem)] -translate-x-1/2 md:top-1/2 md:h-[74svh] md:w-[min(26vw,26rem)] md:-translate-y-1/2">
          {items.map((it, i) =>
            // só a prancha ativa e as vizinhas ficam montadas (centenas de traços ligados ao scroll)
            Math.abs(i - idx) <= 1 ? <Board key={it.key} index={i} total={items.length} progress={p} kind={it.drawing} /> : null,
          )}
        </div>

        {/* título */}
        <div className="absolute inset-x-0 top-[calc(var(--header-h)+40svh+2.75rem)] grid grid-cols-8 px-[var(--gutter)] md:top-auto md:bottom-1/2 md:px-0 md:pb-6">
          <div className="relative col-span-8 h-[2.05em] overflow-hidden text-[clamp(2.4rem,4.4vw,4.6rem)] leading-[1] tracking-[-0.045em] md:col-span-3 md:text-right">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.h3
                key={item.key}
                className="absolute inset-x-0 bottom-0 md:pr-[2.5vw]"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-105%" }}
                transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
              >
                {item.title.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </motion.h3>
            </AnimatePresence>
          </div>
        </div>

        {/* legenda da prancha */}
        <div className="t-label absolute top-1/2 left-[62.5%] hidden pt-2 md:block md:left-[calc(50%+min(13vw,13rem))] md:pl-[var(--gutter)]">
          <span className="block text-stone">Prancha</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={item.caption}
              className="block"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
            >
              {item.caption}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* texto */}
        <div className="absolute inset-x-0 top-[calc(var(--header-h)+40svh+2.75rem+4.92rem+1.25rem)] grid grid-cols-8 px-[var(--gutter)] md:top-auto md:bottom-10 md:px-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={item.key}
              className="t-body col-span-8 max-w-[25rem] md:col-span-3 md:col-start-6 md:pl-0"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
            >
              {item.text}
            </motion.p>
          </AnimatePresence>
        </div>

        <Counter label={item.key} index={idx + 1} total={items.length} className="absolute right-[var(--gutter)] bottom-3" />
      </div>
    </div>
  )
}

function Board({
  index,
  total,
  progress,
  kind,
}: {
  index: number
  total: number
  progress: MotionValue<number>
  kind: (typeof site.approach.items)[number]["drawing"]
}) {
  const seg = 1 / total
  const local = useTransform(progress, [index * seg, index * seg + seg * 0.8], [0, 1], { clamp: true })
  // faixas sempre dentro de [0, 1] e crescentes (o framer acelera via ScrollTimeline nativa)
  const a = Math.max(0, index * seg - 0.02)
  const b = Math.max(a + 0.001, index * seg + 0.02)
  const d = Math.min(1, (index + 1) * seg + 0.02)
  const c = Math.min(d - 0.001, (index + 1) * seg - 0.02)
  const opacity = useTransform(progress, [a, b, c, d], [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0])
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <Drawing kind={kind} mode="progress" progress={local} />
    </motion.div>
  )
}
