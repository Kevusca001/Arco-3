import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Ctx = {
  lenis: Lenis | null
  scrollTo: (target: string | number | HTMLElement, opts?: { immediate?: boolean; offset?: number }) => void
}

const ScrollCtx = createContext<Ctx>({ lenis: null, scrollTo: () => {} })

/**
 * Lenis (scroll suave) sincronizado com o ticker do GSAP para que
 * ScrollTrigger e framer-motion leiam a mesma posição a cada frame.
 */
export function SmoothScroll({ children, paused }: { children: ReactNode; paused?: boolean }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const instance = new Lenis({
      duration: reduce ? 0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduce,
      touchMultiplier: 1.4,
    })
    lenisRef.current = instance
    setLenis(instance)

    instance.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!lenis) return
    if (paused) lenis.stop()
    else {
      lenis.start()
      ScrollTrigger.refresh()
    }
  }, [lenis, paused])

  const scrollTo: Ctx["scrollTo"] = (target, opts) => {
    const l = lenisRef.current
    if (l) l.scrollTo(target, { offset: opts?.offset ?? 0, immediate: opts?.immediate, duration: 1.6 })
    else if (typeof target === "number") window.scrollTo({ top: target })
    else {
      const el = typeof target === "string" ? document.querySelector(target) : target
      el?.scrollIntoView()
    }
  }

  return <ScrollCtx.Provider value={{ lenis, scrollTo }}>{children}</ScrollCtx.Provider>
}

export const useSmoothScroll = () => useContext(ScrollCtx)
