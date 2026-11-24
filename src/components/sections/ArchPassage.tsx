import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { SINGLE_ARCH_PATH } from "@/components/brand/ArcoMark"

const easeIn = (t: number) => t * t * t

/**
 * Passagem: três arcos — o central cresce até ocupar a tela inteira
 * e nos leva, pelo vão, até o contato.
 */
export function ArchPassage() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] })

  const scale = useTransform(p, [0, 0.9], [1, 26], { ease: easeIn })
  const sideX = useTransform(p, [0, 0.5], [0, 1], { ease: easeIn })
  const leftX = useTransform(sideX, (v) => `${-v * 60}vw`)
  const rightX = useTransform(sideX, (v) => `${v * 60}vw`)
  const sideOpacity = useTransform(p, [0, 0.35], [1, 0])
  const labelOpacity = useTransform(p, [0, 0.12], [1, 0])

  return (
    <div ref={ref} className="relative h-[170svh] bg-ink md:h-[220svh]" aria-hidden="true">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.svg viewBox="0 0 80 100" className="absolute aspect-[4/5] h-[34svh] -translate-x-[118%] text-paper" style={{ x: leftX, opacity: sideOpacity }}>
            <path d={SINGLE_ARCH_PATH} fill="currentColor" />
          </motion.svg>
          <motion.svg
            viewBox="0 0 80 100"
            className="absolute aspect-[4/5] h-[34svh] text-paper will-change-transform"
            style={{ scale, transformOrigin: "50% 68%" }}
          >
            <path d={SINGLE_ARCH_PATH} fill="currentColor" />
          </motion.svg>
          <motion.svg viewBox="0 0 80 100" className="absolute aspect-[4/5] h-[34svh] translate-x-[118%] text-paper" style={{ x: rightX, opacity: sideOpacity }}>
            <path d={SINGLE_ARCH_PATH} fill="currentColor" />
          </motion.svg>
        </div>
        <motion.p className="t-label absolute inset-x-0 bottom-[14svh] text-center text-paper/60" style={{ opacity: labelOpacity }}>
          Atravesse
        </motion.p>
      </div>
    </div>
  )
}
