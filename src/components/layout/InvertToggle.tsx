import { useTheme } from "@/lib/theme"
import { site } from "@/content/site"

/** "Inverter cor": troca papel e tinta em todo o site (inclusive o 3D). */
export function InvertToggle() {
  const { inverted, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={inverted}
      className="t-label fixed bottom-3 left-[var(--gutter)] z-50 flex items-center gap-1.5 text-white mix-blend-difference"
    >
      <span className="relative inline-block size-[7px] overflow-hidden rounded-full border border-white">
        <span className="absolute inset-y-0 left-0 w-1/2 bg-white" />
      </span>
      <span className="u-line">{site.footer.invert}</span>
    </button>
  )
}
