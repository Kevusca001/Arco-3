import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { site } from "@/content/site"
import { ArcoMark } from "@/components/brand/ArcoMark"
import { useSmoothScroll } from "@/lib/smooth-scroll"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

/* colunas (de 8) em que cada item do menu se alinha — como no grid de referência */
const COL_START = ["lg:col-start-2", "lg:col-start-4", "lg:col-start-5", "lg:col-start-6", "lg:col-start-7", "lg:col-start-8"]

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

const ids = site.nav.map((n) => n.id)

export function Header() {
  const { scrollTo } = useSmoothScroll()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const active = useActiveSection(ids)

  const go = (id: string) => scrollTo(`#${id}`)

  return (
    <header className="sticky top-0 z-50 h-[var(--header-h)] text-white mix-blend-difference">
      <div className="relative grid h-full grid-cols-2 items-center px-[var(--gutter)] lg:grid-cols-8 lg:px-0">
        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="flex items-center gap-2 lg:pl-[var(--gutter)]"
          aria-label="Arco 3 — voltar ao início"
        >
          <ArcoMark className="h-[0.95rem] w-auto" />
        </button>

        <nav className="hidden lg:contents" aria-label="Principal">
          {site.nav.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                go(item.id)
              }}
              className={cn("tick t-small group relative w-fit", COL_START[i])}
            >
              <span className={cn("u-line u-line-in", active === item.id && "is-active")}>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex justify-end lg:hidden">
          <Sheet>
            <SheetTrigger className="t-small u-line">Menu</SheetTrigger>
            <SheetContent side="top" className="h-[100svh] border-0 bg-ink p-0 text-paper [&>button]:hidden">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex h-full flex-col px-[var(--gutter)] pt-3 pb-6">
                <div className="flex items-center justify-between">
                  <ArcoMark className="h-[0.95rem] w-auto" />
                  <SheetClose className="t-small u-line">Fechar</SheetClose>
                </div>
                <nav className="mt-auto flex flex-col" aria-label="Principal (móvel)">
                  {site.nav.map((item, i) => (
                    <SheetClose asChild key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          window.setTimeout(() => go(item.id), 350)
                        }}
                        className="flex items-baseline gap-4 border-t border-paper/15 py-3"
                      >
                        <span className="t-label w-6 text-paper/45 tabular-nums">0{i + 1}</span>
                        <span className="text-[2.6rem] leading-none tracking-[-0.04em]">{item.label}</span>
                      </a>
                    </SheetClose>
                  ))}
                </nav>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="t-small mt-8 inline-flex items-center gap-1 text-paper/70"
                >
                  {site.instagram.handle} <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* linha de base + progresso de leitura */}
        <span className="pointer-events-none absolute right-0 bottom-0 left-0 h-px bg-white/20" />
        <motion.span
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-white"
          style={{ scaleX: progress }}
        />
      </div>
    </header>
  )
}
