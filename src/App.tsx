import { useCallback, useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ThemeProvider } from "@/lib/theme"
import { SmoothScroll } from "@/lib/smooth-scroll"
import { Preloader } from "@/components/layout/Preloader"
import { Header } from "@/components/layout/Header"
import { InvertToggle } from "@/components/layout/InvertToggle"
import { Wordmark } from "@/components/brand/Wordmark"
import { HeroBody } from "@/components/sections/Hero"
import { Manifesto } from "@/components/sections/Manifesto"
import { Vision } from "@/components/sections/Vision"
import { Approach } from "@/components/sections/Approach"
import { Works } from "@/components/sections/Works"
import { Services } from "@/components/sections/Services"
import { Process } from "@/components/sections/Process"
import { Studio } from "@/components/sections/Studio"
import { ArchPassage } from "@/components/sections/ArchPassage"
import { Contact } from "@/components/sections/Contact"
import { Footer } from "@/components/sections/Footer"
import Noise from "@/components/reactbits/Noise"

export default function App() {
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const mark = useRef<HTMLDivElement>(null)
  // grão animado em tela cheia só em desktop: no celular custa quadros de scroll
  const [grain] = useState(() => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches)

  // o logotipo começa abaixo da linha e sobe, letra a letra, ao fim do preloader
  useEffect(() => {
    const el = mark.current
    if (!el) return
    const letters = el.querySelectorAll("[data-letter]")
    gsap.set(letters, { yPercent: 102 })
  }, [])

  const onDone = useCallback(() => {
    setLoading(false)
    setReady(true)
    const el = mark.current
    if (el) {
      gsap.to(el.querySelectorAll("[data-letter]"), {
        yPercent: 0,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.07,
      })
    }
  }, [])

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual"
    window.scrollTo(0, 0)
  }, [])

  return (
    <ThemeProvider>
      <SmoothScroll paused={loading}>
        {loading && <Preloader onDone={onDone} />}
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
          Pular para o conteúdo
        </a>

        <main id="conteudo" className="relative">
          <Wordmark ref={mark} className="text-ink" />
          <Header />
          <HeroBody ready={ready} />
          <Manifesto />
          <Vision />
          <Approach />
          <Works />
          <Services />
          <Process />
          <Studio />
          <ArchPassage />
          <Contact />
          <Footer />
        </main>

        <InvertToggle />
        {grain && <Noise opacity={0.03} fixed blendMode="overlay" fps={18} zIndex={60} className="pointer-events-none" />}
      </SmoothScroll>
    </ThemeProvider>
  )
}
