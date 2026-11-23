import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { site } from "@/content/site"
import CountUp from "@/components/reactbits/CountUp"

const MIN_DURATION = 2300

/**
 * Tela de entrada: palavras que se "constroem" em camadas, contador de
 * carregamento e uma cortina que sobe (GSAP).
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const words = el.querySelectorAll<HTMLElement>("[data-word]")
    const lines = el.querySelectorAll<HTMLElement>("[data-vline]")

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 110 })
      gsap.set(lines, { scaleY: 0, transformOrigin: "top" })
      const intro = gsap.timeline()
      intro.to(lines, { scaleY: 1, duration: 1.2, ease: "expo.inOut", stagger: 0.1 })
      intro.to(words, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.28 }, 0.25)
    }, el)

    const start = performance.now()
    let cancelled = false
    const fonts = (document.fonts?.ready ?? Promise.resolve()).catch(() => undefined)

    fonts.then(() => {
      const wait = Math.max(0, (reduce ? 300 : MIN_DURATION) - (performance.now() - start))
      window.setTimeout(() => {
        if (cancelled) return
        const out = gsap.timeline({ onComplete: onDone })
        out.to(words, { yPercent: -110, duration: 0.7, ease: "expo.in", stagger: 0.06 })
        out.to(el.querySelectorAll("[data-fade]"), { opacity: 0, duration: 0.4 }, 0)
        out.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, 0.45)
      }, wait)
    })

    return () => {
      cancelled = true
      ctx.revert()
    }
  }, [onDone])

  const [w1, w2, w3] = site.preloader.words

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] bg-paper text-ink"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-busy="true"
      aria-label="Carregando"
    >
      {/* linhas-guia da grade */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <span data-vline className="absolute top-0 bottom-0 left-[50%] w-px bg-ink/10" />
        <span data-vline className="absolute top-0 bottom-0 left-[62.5%] w-px bg-ink/10" />
        <span data-vline className="absolute top-0 bottom-0 left-[12.5%] w-px bg-ink/10" />
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-[var(--gutter)]">
        <div className="t-statement grid grid-cols-1 gap-y-1 md:grid-cols-8">
          <span className="overflow-hidden md:col-span-3 md:col-start-2">
            <span data-word className="block">{w1}</span>
          </span>
          <span className="overflow-hidden md:col-span-3 md:col-start-5 md:pl-3">
            <span data-word className="block">{w2}</span>
          </span>
          <span className="overflow-hidden md:col-span-2 md:col-start-6 md:mt-[2.2em]">
            <span data-word className="block">{w3}</span>
          </span>
        </div>
      </div>

      <div data-fade className="t-label absolute bottom-3 left-[var(--gutter)] text-stone">
        {site.hero.taglineSmall.map((l) => (
          <span key={l} className="block">{l}</span>
        ))}
      </div>
      <div data-fade className="t-label absolute right-[var(--gutter)] bottom-3 tabular-nums md:right-auto md:left-[50%] md:pl-3">
        {site.preloader.loading}{" "}
        <strong className="font-semibold">
          <CountUp to={100} from={0} duration={2} trigger="load" />%
        </strong>
      </div>
    </div>
  )
}
