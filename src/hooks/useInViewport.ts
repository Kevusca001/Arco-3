import { useEffect, useState, type RefObject } from "react"

/** true enquanto o elemento (com margem) estiver na viewport — liga/desliga o WebGL. */
export function useInViewport(ref: RefObject<Element | null>, margin = "0px") {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return inView
}
