import { useEffect, useState } from "react"

/** Largura da viewport, atualizada no resize (para trilhos em px). */
export function useViewportWidth() {
  const [w, setW] = useState(() => (typeof window === "undefined" ? 1440 : window.innerWidth))
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener("resize", on)
    return () => window.removeEventListener("resize", on)
  }, [])
  return w
}
