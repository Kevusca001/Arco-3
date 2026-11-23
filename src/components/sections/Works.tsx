import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Plus } from "lucide-react"
import { site, type Project } from "@/content/site"
import { FocusCards, type FocusCardItem } from "@/components/aceternity/focus-cards"
import { Drawing } from "@/components/drawings/Drawing"
import SplitText from "@/components/reactbits/SplitText"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* grade editorial: alterna cards largos e estreitos, com desníveis */
const LAYOUT = [
  { cls: "md:col-span-4 md:col-start-1", aspect: "md:aspect-[4/3]" },
  { cls: "md:col-span-3 md:col-start-6 md:mt-[24vh]", aspect: "md:aspect-[4/5]" },
  { cls: "md:col-span-3 md:col-start-2", aspect: "md:aspect-[4/5]" },
  { cls: "md:col-span-4 md:col-start-5 md:mt-[16vh]", aspect: "md:aspect-[4/3]" },
  { cls: "md:col-span-4 md:col-start-1", aspect: "md:aspect-[4/3]" },
  { cls: "md:col-span-3 md:col-start-6 md:mt-[24vh]", aspect: "md:aspect-[4/5]" },
]

const INITIAL = 4

export function Works() {
  const all = site.works.items
  const [count, setCount] = useState(INITIAL)
  const shown = all.slice(0, count)

  const items: FocusCardItem[] = shown.map((p, i) => ({
    key: p.id,
    className: cn("col-span-8", LAYOUT[i % LAYOUT.length].cls),
    render: ({ focused }) => <ProjectCard project={p} index={i} focused={focused} aspect={LAYOUT[i % LAYOUT.length].aspect} />,
  }))

  return (
    <section id="projetos" aria-label={site.works.label} className="relative bg-paper px-[var(--gutter)] pt-36 pb-32 text-ink md:px-0">
      <span className="absolute top-0 bottom-0 left-[12.5%] hidden w-px bg-ink/10 md:block" />
      <span className="absolute top-0 bottom-0 left-[50%] hidden w-px bg-ink/10 md:block" />

      <header className="mb-20 grid grid-cols-8 items-end md:mb-28">
        <p className="t-label col-span-8 mb-6 text-stone md:col-span-1 md:col-start-2 md:mb-0 md:self-start">
          ({String(all.length).padStart(2, "0")})
        </p>
        <h2 className="col-span-8 md:col-span-6 md:col-start-2">
          <SplitText
            text={site.works.label}
            tag="span"
            className="t-mega block"
            textAlign="left"
            splitType="chars"
            effect="rise"
            mask
            delay={22}
            duration={1.1}
          />
        </h2>
      </header>

      <div className="md:pr-[var(--gutter)] md:pl-[var(--gutter)]">
        <FocusCards items={items} className="grid-cols-8 gap-x-[var(--gutter)] gap-y-16 md:gap-y-24" />
      </div>

      <AnimatePresence>
        {count < all.length && (
          <motion.div
            className="mt-24 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCount((c) => Math.min(all.length, c + 2))}
              className="group h-auto gap-3 rounded-none border-ink/25 bg-transparent px-6 py-4 text-sm font-normal hover:bg-ink hover:text-paper"
            >
              {site.works.loadMore}
              <Plus className="size-4 transition-transform duration-500 group-hover:rotate-90" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ProjectCard({ project, index, focused, aspect }: { project: Project; index: number; focused: boolean; aspect: string }) {
  const meta = [project.category, project.location, project.year, project.area].filter(Boolean)
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
      className="group"
    >
      <a
        href={site.instagram.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`${project.title} — ver no Instagram`}
        className="block"
      >
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden bg-[color-mix(in_oklab,var(--ink)_4%,var(--paper))] [--drawing-bg:color-mix(in_oklab,var(--ink)_4%,var(--paper))]",
            aspect,
          )}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover grayscale transition-[filter,transform] duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
            />
          ) : (
            <div className="absolute inset-[7%] transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]">
              <Drawing kind={project.drawing} mode="view" duration={2.4} />
            </div>
          )}

          {/* marcas de corte nos cantos */}
          {["top-2 left-2", "top-2 right-2 rotate-90", "bottom-2 right-2 rotate-180", "bottom-2 left-2 -rotate-90"].map((pos) => (
            <svg key={pos} className={cn("absolute size-3 text-ink/40", pos)} viewBox="0 0 12 12" aria-hidden="true">
              <path d="M0 6V0h6" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          ))}

          <span
            className={cn(
              "absolute right-3 bottom-3 grid size-10 place-items-center bg-ink text-paper transition-all duration-500",
              focused ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-6">
          <div>
            <h3 className="t-statement">{project.title}</h3>
            <p className="t-label mt-2 text-stone">{meta.join(" · ")}</p>
          </div>
          <span className="t-label tabular-nums text-stone">{String(index + 1).padStart(2, "0")}</span>
        </div>
      </a>
    </motion.article>
  )
}
