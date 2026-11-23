import { forwardRef } from "react"
import { site } from "@/content/site"
import { cn } from "@/lib/utils"

/**
 * Logotipo em escala de fachada: letras distribuídas de ponta a ponta,
 * levemente cortadas pela borda — como uma inscrição em pedra.
 */
export const Wordmark = forwardRef<HTMLDivElement, { className?: string; crop?: "top" | "bottom" | "none" }>(
  function Wordmark({ className, crop = "top" }, ref) {
    return (
      <div
        ref={ref}
        aria-label={site.name}
        role="img"
        className={cn(
          "t-wordmark relative flex w-full select-none justify-between overflow-hidden text-[19.2vw] uppercase",
          crop === "top" && "-mt-[0.06em] pt-[0.02em]",
          className,
        )}
      >
        {site.wordmark.map((ch, i) => (
          <span key={i} className="block overflow-hidden" aria-hidden="true">
            <span data-letter className="block">
              {ch}
            </span>
          </span>
        ))}
      </div>
    )
  },
)
