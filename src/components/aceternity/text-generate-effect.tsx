"use client";
/**
 * Aceternity UI — Text Generate Effect
 * Adaptado à identidade da Arco 3: herda cor e tipografia do contexto
 * (sem cores fixas) e aceita atraso/escalonamento configuráveis.
 */
import { useEffect } from "react";
import { motion, stagger, useAnimate, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  delay = 0,
  step = 0.045,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  delay?: number;
  step?: number;
}) => {
  const [scope, animate] = useAnimate();
  const reduce = useReducedMotion();
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (!scope.current) return;
    animate(
      "span",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration: reduce ? 0 : duration, delay: reduce ? 0 : stagger(step, { startDelay: delay }) },
    );
  }, [scope, animate, filter, duration, delay, step, reduce, words]);

  return (
    <motion.p ref={scope} className={cn(className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="opacity-0"
          style={{ filter: filter ? "blur(8px)" : "none" }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.p>
  );
};
