import DecryptedText from "@/components/reactbits/DecryptedText"
import { cn } from "@/lib/utils"

/** Contador de seção: "Direção  01 | 04" — o rótulo se decodifica ao trocar. */
export function Counter({ label, index, total, className }: { label: string; index: number; total: number; className?: string }) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    <div className={cn("t-label flex items-center gap-6 tabular-nums", className)}>
      <DecryptedText
        key={label}
        text={label}
        animateOn="view"
        sequential
        speed={28}
        revealDirection="start"
        characters="ARCO3/—+·"
        encryptedClassName="opacity-40"
      />
      <span className="flex items-center gap-1.5">
        <span>{pad(index)}</span>
        <span className="h-3 w-px bg-current opacity-30" />
        <span className="opacity-50">{pad(total)}</span>
      </span>
    </div>
  )
}
