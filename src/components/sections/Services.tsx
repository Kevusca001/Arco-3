import { useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion"
import { site } from "@/content/site"
import { Drawing } from "@/components/drawings/Drawing"
import { Counter } from "@/components/layout/Counter"
import ScrollVelocity from "@/components/reactbits/ScrollVelocity"
import SplitText from "@/components/reactbits/SplitText"
import { useViewportWidth } from "@/hooks/useViewportWidth"
import { cn } from "@/lib/utils"

/**
 * Nós fazemos — trilho horizontal dirigido pelo scroll: o serviço ativo
 * acende, a descrição e a prancha correspondente trocam no lugar.
 */
export function Services() {
  const s = site.services
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const [idx, setIdx] = useState(0)
  useMotionValueEvent(p, "change", (v) => setIdx(Math.min(s.items.length - 1, Math.floor(v * s.items.length * 0.9999))))
  const item = s.items[idx]
  const vw = useViewportWidth()
  const desktop = vw >= 768
  const railX = (desktop ? vw * 0.5 : 16) - idx * vw * (desktop ? 0.25 : 0.62)

  return (
    <section id="servicos" aria-label="Serviços" className="relative bg-ink text-paper">
      <div className="px-[var(--gutter)] pt-24 md:pt-36">
        <h2 className="uppercase">
          <SplitText
            text={`${s.we} ${s.do}`}
            tag="span"
            className="block text-[clamp(4rem,15.5vw,18rem)] leading-[1.02] tracking-[-0.06em]"
            textAlign="left"
            splitType="chars"
            effect="rise"
            mask
            delay={35}
            duration={1.2}
          />
        </h2>
      </div>

      <div ref={ref} className="relative h-[calc(var(--n)*62svh)] md:h-[calc(var(--n)*85svh)]" style={{ ["--n" as string]: s.items.length }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <span className="absolute top-[26%] right-0 left-0 h-px bg-paper/12 md:top-[42%]" />
          <span className="absolute top-0 bottom-0 left-[50%] hidden w-px bg-paper/10 md:block" />

          {/* trilho de nomes */}
          <div className="absolute top-[26%] left-0 w-full -translate-y-full pb-3 md:top-[42%]">
            <motion.ul
              className="flex whitespace-nowrap"
              animate={{ x: railX }}
              transition={{ type: "spring", stiffness: 90, damping: 20, mass: 0.8 }}
            >
              {s.items.map((it, i) => (
                <li
                  key={it.title}
                  className={cn(
                    "w-[62vw] shrink-0 text-[clamp(2.4rem,4.2vw,4.4rem)] leading-none tracking-[-0.045em] transition-[opacity,filter] duration-700 md:w-[25vw]",
                    i === idx ? "opacity-100" : "opacity-20",
                  )}
                >
                  {it.title}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* descrição */}
          <div className="absolute top-[calc(26%+1rem)] grid w-full grid-cols-8 px-[var(--gutter)] md:top-[calc(42%+1rem)] md:px-0">
            <AnimatePresence mode="wait">
              <motion.p
                key={item.title}
                className="t-body col-span-8 max-w-[21rem] text-paper/80 md:col-span-3 md:col-start-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
              >
                {item.text}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* prancha */}
          <div className="absolute top-[calc(26%+7rem)] bottom-14 left-[var(--gutter)] w-[min(70vw,20rem)] md:top-[42%] md:bottom-auto md:left-[50%] md:h-[50svh] md:w-[25vw]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={item.title}
                className="absolute inset-0 bg-paper p-[6%] text-ink [--drawing-bg:var(--paper)]"
                initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
                transition={{ duration: 0.9, ease: [0.87, 0, 0.13, 1] }}
              >
                <Drawing kind={item.drawing} mode="view" duration={1.6} delay={0.3} />
              </motion.div>
            </AnimatePresence>
          </div>

          <Counter label={item.title} index={idx + 1} total={s.items.length} className="absolute right-[var(--gutter)] bottom-3" />
        </div>
      </div>

      {/* faixa em movimento, reage à velocidade do scroll */}
      <div className="border-y border-paper/10 py-6 md:py-8">
        <ScrollVelocity
          texts={[s.items.map((i) => i.title).join("  ·  "), "Projeto  ·  Detalhe  ·  Obra  ·  Luz  ·  Matéria"]}
          velocity={40}
          numCopies={4}
          gap={48}
          className="text-[clamp(2rem,5vw,5rem)] leading-none font-normal tracking-[-0.04em]"
          outlineAlternate
          fadeEdges
          color="var(--paper)"
        />
      </div>
    </section>
  )
}
