import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)
// a barra de endereço do iOS muda a altura a cada gesto: não recalcular os gatilhos por isso
ScrollTrigger.config({ ignoreMobileResize: true })

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
    // Em telas de toque o scroll nativo (com inércia do sistema) é mais fluido que qualquer
    // suavização em JS — o Lenis fica só para mouse/trackpad.
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches
    if (reduce || touch) return
    const instance = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1.05,
      smoothWheel: true,
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

  // trava o scroll durante o preloader também sem Lenis
  useEffect(() => {
    if (lenis) {
      document.documentElement.style.overflow = ""
      return
    }
    document.documentElement.style.overflow = paused ? "hidden" : ""
    if (!paused) ScrollTrigger.refresh()
  }, [lenis, paused])

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
    if (l) {
      l.scrollTo(target, { offset: opts?.offset ?? 0, immediate: opts?.immediate, duration: 1.4 })
      return
    }
    const behavior: ScrollBehavior = opts?.immediate ? "auto" : "smooth"
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior })
      return
    }
    const el = typeof target === "string" ? document.querySelector(target) : target
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (opts?.offset ?? 0), behavior })
  }

  return <ScrollCtx.Provider value={{ lenis, scrollTo }}>{children}</ScrollCtx.Provider>
}

export const useSmoothScroll = () => useContext(ScrollCtx)
