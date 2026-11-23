import { motion } from "framer-motion"
import { site } from "@/content/site"
import ScrollReveal from "@/components/reactbits/ScrollReveal"

/* três famílias de arco — pleno, ogival e abatido — uma para cada princípio */
const ARCHES = [
  "M4 60V30A26 26 0 0 1 56 30V60",
  "M4 60V32Q4 6 30 2Q56 6 56 32V60",
  "M4 60V34Q30 16 56 34V60",
]

export function Studio() {
  const st = site.studio
  return (
    <section id="estudio" aria-label={st.label} className="relative bg-ink px-[var(--gutter)] pt-36 pb-40 text-paper md:px-0">
      <span className="absolute top-0 bottom-0 left-[12.5%] hidden w-px bg-paper/10 md:block" />

      <div className="grid grid-cols-8 gap-y-10">
        <p className="t-label col-span-8 text-paper/50 md:col-span-1 md:col-start-2">{st.label}</p>
        <div className="col-span-8 md:col-span-6 md:col-start-2">
          <ScrollReveal
            baseOpacity={0.12}
            enableBlur
            blurStrength={6}
            baseRotation={0}
            containerClassName="m-0"
            textClassName="text-[clamp(2rem,4.1vw,4.6rem)] leading-[1.02] tracking-[-0.04em] font-normal"
            rotationEnd="bottom 60%"
            wordAnimationEnd="bottom 60%"
          >
            {st.statement}
          </ScrollReveal>
        </div>
      </div>

      <div className="mt-32 grid grid-cols-8 gap-y-14">
        {st.principles.map((pr, i) => (
          <motion.div
            key={pr.title}
            className={`col-span-8 border-t border-paper/15 pt-5 md:col-span-2 md:mr-[var(--gutter)] ${["md:col-start-2", "md:col-start-4", "md:col-start-6"][i % 3]}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="flex items-start justify-between">
              <span className="t-label tabular-nums text-paper/45">{String(i + 1).padStart(2, "0")}</span>
              <svg viewBox="0 0 60 62" className="h-14 w-14 text-paper/70" aria-hidden="true">
                <motion.path
                  d={ARCHES[i % ARCHES.length]}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.3 + i * 0.15, ease: [0.65, 0, 0.35, 1] }}
                />
                <line x1="0" y1="60.5" x2="60" y2="60.5" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              </svg>
            </div>
            <h3 className="mt-10 text-[clamp(1.75rem,2.6vw,2.6rem)] leading-none tracking-[-0.04em]">{pr.title}</h3>
            <p className="t-small mt-4 max-w-[19rem] text-paper/65">{pr.text}</p>
          </motion.div>
        ))}
      </div>

      {st.team.length > 0 && (
        <div className="mt-36 grid grid-cols-8 gap-x-[var(--gutter)] gap-y-12">
          <p className="t-label col-span-8 text-paper/50 md:col-span-1 md:col-start-2">Equipe</p>
          <div className="col-span-8 grid grid-cols-2 gap-x-[var(--gutter)] gap-y-12 md:col-span-6 md:col-start-2 md:grid-cols-3">
            {st.team.map((m) => (
              <figure key={m.name} className="group">
                <div className="aspect-[4/5] overflow-hidden bg-paper/5">
                  {m.photo && (
                    <img
                      src={m.photo}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale transition-transform duration-[1.2s] group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <figcaption className="mt-3">
                  <span className="t-small block">{m.name}</span>
                  <span className="t-label block text-paper/50">{m.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
