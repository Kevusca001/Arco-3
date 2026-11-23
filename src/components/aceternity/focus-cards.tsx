"use client";
/**
 * Aceternity UI — Focus Cards
 * Adaptado: o card em foco permanece nítido enquanto os demais
 * desfocam e recuam. Aceita conteúdo livre por card e um layout em
 * grade editorial (colunas variáveis), sem cantos arredondados.
 */
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export type FocusCardItem = {
  key: string;
  className?: string;
  render: (state: { focused: boolean; dimmed: boolean }) => React.ReactNode;
};

export const FocusCard = React.memo(
  ({
    item,
    index,
    hovered,
    setHovered,
  }: {
    item: FocusCardItem;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    const focused = hovered === index;
    const dimmed = hovered !== null && !focused;
    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered(index)}
        onBlur={() => setHovered(null)}
        className={cn(
          "relative transition-[filter,transform,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
          dimmed && "scale-[0.985] opacity-60 blur-[3px]",
          item.className,
        )}
      >
        {item.render({ focused, dimmed })}
      </div>
    );
  },
);
FocusCard.displayName = "FocusCard";

export function FocusCards({ items, className }: { items: FocusCardItem[]; className?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className={cn("grid w-full", className)}>
      {items.map((item, index) => (
        <FocusCard key={item.key} item={item} index={index} hovered={hovered} setHovered={setHovered} />
      ))}
    </div>
  );
}
