import { cn } from "@/lib/utils"

/**
 * Marca: um bloco com três aberturas em arco — "Arco 3".
 * Desenhada em uma grade de 30×20; os vãos usam evenodd.
 */
export const ARCO_MARK_PATH = (() => {
  const outer = "M0 0H30V20H0Z"
  const arch = (x: number) => `M${x} 20V9.5A3 3 0 0 1 ${x + 6} 9.5V20Z`
  return [outer, arch(2.5), arch(12), arch(21.5)].join("")
})()

export function ArcoMark({ className, title = "Arco 3" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={cn("block", className)} role="img" aria-label={title}>
      <path d={ARCO_MARK_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}

/** Silhueta de um único arco (para a transição em tela cheia). */
export const SINGLE_ARCH_PATH = "M0 100V40A40 40 0 0 1 80 40V100Z"
