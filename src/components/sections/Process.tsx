import { motion } from "framer-motion"
import { site } from "@/content/site"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SplitText from "@/components/reactbits/SplitText"

/** Processo — etapas em acordeão (shadcn/ui), numeradas como pranchas. */
export function Process() {
  const pr = site.process
  return (
    <section id="processo" aria-label={pr.label} className="relative bg-paper px-[var(--gutter)] pt-36 pb-36 text-ink md:px-0">
      <span className="absolute top-0 bottom-0 left-[12.5%] hidden w-px bg-ink/10 md:block" />
      <span className="absolute top-0 bottom-0 left-[37.5%] hidden w-px bg-ink/10 md:block" />

      <div className="grid grid-cols-8 gap-y-12">
        <div className="col-span-8 md:col-span-2 md:col-start-2">
          <p className="t-label text-stone md:sticky md:top-[calc(var(--header-h)+1.5rem)]">{pr.label}</p>
        </div>

        <div className="col-span-8 md:col-span-5 md:col-start-4 md:pr-[var(--gutter)]">
          <SplitText
            text={pr.title}
            tag="h2"
            className="t-statement block max-w-[22ch] md:text-[clamp(2rem,3.4vw,3.6rem)]"
            textAlign="left"
            splitType="words"
            effect="blur"
            delay={40}
            duration={1}
          />

          <Accordion type="single" collapsible defaultValue="step-0" className="mt-20 border-t border-ink/15">
            {pr.steps.map((step, i) => (
              <AccordionItem key={step.title} value={`step-${i}`} className="border-b border-ink/15">
                <AccordionTrigger className="group items-center gap-6 rounded-none py-6 font-normal hover:no-underline md:py-7">
                  <span className="flex flex-1 items-baseline gap-6 md:gap-10">
                    <span className="t-label w-6 shrink-0 tabular-nums text-stone">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[clamp(1.5rem,2.4vw,2.4rem)] leading-[1.05] tracking-[-0.035em] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-2">
                      {step.title}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <motion.div
                    className="grid gap-8 pb-6 pl-12 md:grid-cols-5 md:pl-16"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <p className="t-body text-ink/80 md:col-span-3">{step.text}</p>
                    <div className="md:col-span-2">
                      <p className="t-label mb-3 text-stone">{pr.scopeLabel}</p>
                      <ul className="t-small space-y-1.5">
                        {step.scope.map((s) => (
                          <li key={s} className="flex gap-2">
                            <span className="mt-[0.55em] h-px w-3 shrink-0 bg-current opacity-40" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
