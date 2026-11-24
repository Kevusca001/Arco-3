import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { site } from "@/content/site"
import { useSmoothScroll } from "@/lib/smooth-scroll"

/**
 * Corpo do herói (abaixo do logotipo e do menu): linhas-guia da grade,
 * diagonal de construção e a frase do estúdio.
 */
export function HeroBody({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.set("[data-line]", { yPercent: 105 })
      gsap.set("[data-vline]", { scaleY: 0, transformOrigin: "top" })
      gsap.set("[data-diag]", { strokeDashoffset: 1 })
      gsap.set("[data-scroll-bar]", { scaleY: 0, transformOrigin: "top" })
    }, el)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!ready) return
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.35 })
      tl.to("[data-vline]", { scaleY: 1, duration: 1.4, ease: "expo.inOut", stagger: 0.12 })
        .to("[data-diag]", { strokeDashoffset: 0, duration: 2.2, ease: "expo.inOut" }, 0.1)
        .to("[data-line]", { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 }, 0.5)
        .to("[data-scroll-bar]", { scaleY: 1, duration: 1, ease: "expo.out" }, 1.1)
      // indicador de scroll pulsando
      gsap.to("[data-scroll-dot]", { y: "3.2rem", duration: 1.6, ease: "power2.inOut", repeat: -1, yoyo: false, delay: 2 })
    }, el)
    return () => ctx.revert()
  }, [ready])

  return (
    <section
      ref={root}
      aria-label="Apresentação"
      className="relative h-[calc(100svh-19.2vw*0.7-var(--header-h))] min-h-[30rem] overflow-hidden"
    >
      {/* linhas da grade */}
      <span data-vline className="absolute top-0 bottom-0 left-[12.5%] hidden w-px bg-ink/10 md:block" />
      <span data-vline className="absolute top-0 bottom-0 left-[62.5%] hidden w-px bg-ink/10 md:block" />

      {/* diagonal de construção */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <line
          data-diag
          x1="0%"
          y1="-35%"
          x2="100%"
          y2="100%"
          stroke="currentColor"
          strokeOpacity="0.14"
          strokeWidth="1"
          pathLength={1}
          strokeDasharray="1 1"
        />
      </svg>

      <div className="relative flex h-full flex-col justify-end gap-8 px-[var(--gutter)] pb-28 md:grid md:grid-cols-8 md:gap-0 md:px-0 md:pb-0">
        <p className="t-label md:col-span-2 md:col-start-2 md:self-center">
          {site.hero.taglineSmall.map((l) => (
            <span key={l} className="block overflow-hidden">
              <span data-line className="block">{l}</span>
            </span>
          ))}
        </p>

        <h1 className="t-statement md:col-span-3 md:col-start-6 md:self-center">
          <span className="sr-only">{site.name} — </span>
          {site.hero.statement.map((l) => (
            <span key={l} className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block">{l}</span>
            </span>
          ))}
        </h1>
      </div>

      <button
        type="button"
        onClick={() => scrollTo("#filosofia")}
        className="t-label group absolute bottom-3 left-[62.5%] flex items-end gap-2 pl-2"
      >
        <span data-scroll-bar className="relative -ml-2 block h-16 w-px overflow-hidden bg-ink/15">
          <span data-scroll-dot className="absolute -top-4 left-0 block h-4 w-px bg-ink" />
        </span>
        <span className="u-line u-line-in">{site.hero.scroll}</span>
      </button>
    </section>
  )
}
