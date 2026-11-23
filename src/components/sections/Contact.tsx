import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { site } from "@/content/site"
import SplitText from "@/components/reactbits/SplitText"
import Magnet from "@/components/reactbits/Magnet"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { useInView } from "framer-motion"
import { useRef, type ReactNode } from "react"

type Row = { label: string; value: string; href?: string; icon: ReactNode }

export function Contact() {
  const c = site.contact
  const cs = site.contact_section
  const leadRef = useRef<HTMLDivElement>(null)
  const leadIn = useInView(leadRef, { once: true, amount: 0.6 })

  // apenas o que estiver preenchido em site.ts aparece
  const rows: Row[] = [
    { label: "Instagram", value: site.instagram.handle, href: site.instagram.url, icon: <ArrowUpRight className="size-3.5" /> },
    c.email ? { label: "E-mail", value: c.email, href: `mailto:${c.email}`, icon: <Mail className="size-3.5" /> } : null,
    c.phone ? { label: "Telefone", value: c.phone, href: `tel:${c.phone.replace(/\D/g, "")}`, icon: <Phone className="size-3.5" /> } : null,
    c.whatsapp
      ? { label: "WhatsApp", value: "Conversar agora", href: `https://wa.me/${c.whatsapp}`, icon: <MessageCircle className="size-3.5" /> }
      : null,
    c.address ? { label: "Endereço", value: [c.address, c.city].filter(Boolean).join(", "), icon: <MapPin className="size-3.5" /> } : null,
  ].filter(Boolean) as Row[]

  return (
    <section id="contato" aria-label="Contato" className="relative bg-paper px-[var(--gutter)] pt-28 pb-28 text-ink md:px-0 md:pt-40">
      <span className="absolute top-0 bottom-0 left-[12.5%] hidden w-px bg-ink/10 md:block" />
      <span className="absolute top-0 bottom-0 left-[62.5%] hidden w-px bg-ink/10 md:block" />

      <div className="grid grid-cols-8">
        <h2 className="col-span-8 md:col-span-7 md:col-start-2">
          {cs.title.map((line, i) => (
            <SplitText
              key={line}
              text={line}
              tag="span"
              className={`block text-[clamp(4.5rem,16vw,19rem)] leading-[0.82] tracking-[-0.065em] ${i === 1 ? "md:pl-[12.5vw]" : ""}`}
              textAlign="left"
              splitType="chars"
              effect="rise"
              mask
              delay={30}
              duration={1.2}
            />
          ))}
        </h2>
      </div>

      <div className="mt-20 grid grid-cols-8 gap-y-14 md:mt-28">
        <div ref={leadRef} className="col-span-8 md:col-span-3 md:col-start-2 md:pr-10">
          {leadIn ? (
            <TextGenerateEffect words={cs.lead} className="t-statement" step={0.04} />
          ) : (
            <p className="t-statement opacity-0">{cs.lead}</p>
          )}
          <Magnet padding={80} magnetStrength={3} wrapperClassName="mt-10 inline-block">
            <a
              href={site.instagram.dm}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-4 bg-ink py-4 pr-4 pl-6 text-paper transition-colors"
            >
              <span className="t-small">{cs.cta}</span>
              <span className="grid size-9 place-items-center bg-paper text-ink transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </a>
          </Magnet>
        </div>

        <ul className="col-span-8 md:col-span-3 md:col-start-6 md:pl-0">
          {rows.map((r) => (
            <li key={r.label} className="border-t border-ink/15 py-4 last:border-b">
              <p className="t-label mb-1.5 text-stone">{r.label}</p>
              {r.href ? (
                <a
                  href={r.href}
                  target={r.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-[clamp(1.25rem,1.8vw,1.75rem)] tracking-[-0.03em]"
                >
                  <span className="u-line u-line-in">{r.value}</span>
                  <span className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">{r.icon}</span>
                </a>
              ) : (
                <p className="text-[clamp(1.25rem,1.8vw,1.75rem)] tracking-[-0.03em]">{r.value}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
