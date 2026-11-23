import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { site } from "@/content/site"
import { Wordmark } from "@/components/brand/Wordmark"
import Magnet from "@/components/reactbits/Magnet"
import { useSmoothScroll } from "@/lib/smooth-scroll"

export function Footer() {
  const { scrollTo } = useSmoothScroll()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "0%"])
  const year = new Date().getFullYear()

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink pt-10 text-paper">
      <div className="t-label grid grid-cols-2 gap-y-6 px-[var(--gutter)] md:grid-cols-8 md:px-0">
        <div className="md:col-span-2 md:col-start-2">
          <Magnet padding={40} magnetStrength={4} wrapperClassName="inline-block">
            <button type="button" onClick={() => scrollTo(0)} className="group inline-flex items-center gap-2">
              <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
              <span className="u-line">{site.footer.backToTop}</span>
            </button>
          </Magnet>
        </div>
        <a href={site.instagram.url} target="_blank" rel="noreferrer" className="w-fit md:col-span-2 md:col-start-4">
          <span className="u-line u-line-in">{site.instagram.handle}</span>
        </a>
        <p className="text-paper/60 md:col-span-2 md:col-start-6">
          © {year} {site.legalName}
          <br />
          {site.footer.rights}
        </p>
        <p className="text-paper/60 md:col-start-8">
          Estúdio de
          <br />arquitetura
        </p>
      </div>

      <motion.div style={{ y }} className="mt-24 md:mt-36">
        <Wordmark crop="none" className="-mb-[0.13em] text-paper" />
      </motion.div>
    </footer>
  )
}
