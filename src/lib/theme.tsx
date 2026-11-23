import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

type Theme = {
  inverted: boolean
  toggle: () => void
  /** Cores resolvidas dos tokens CSS, para uso em WebGL/Canvas */
  colors: { ink: string; paper: string; stone: string }
}

const ThemeCtx = createContext<Theme | null>(null)

const read = () => {
  if (typeof window === "undefined") return { ink: "#0f0f0e", paper: "#efeee9", stone: "#8a8780" }
  const s = getComputedStyle(document.documentElement)
  return {
    ink: s.getPropertyValue("--ink").trim() || "#0f0f0e",
    paper: s.getPropertyValue("--paper").trim() || "#efeee9",
    stone: s.getPropertyValue("--stone").trim() || "#8a8780",
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [inverted, setInverted] = useState(() => {
    try {
      return localStorage.getItem("arco3:invert") === "1"
    } catch {
      return false
    }
  })
  const [colors, setColors] = useState(read)

  useEffect(() => {
    document.documentElement.dataset.invert = inverted ? "true" : "false"
    setColors(read())
    try {
      localStorage.setItem("arco3:invert", inverted ? "1" : "0")
    } catch {
      /* armazenamento indisponível: segue sem lembrar */
    }
  }, [inverted])

  const toggle = useCallback(() => setInverted((v) => !v), [])
  const value = useMemo(() => ({ inverted, toggle, colors }), [inverted, toggle, colors])
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error("useTheme fora do ThemeProvider")
  return ctx
}
