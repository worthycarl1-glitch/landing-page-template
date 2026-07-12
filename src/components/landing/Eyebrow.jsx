import React from "react";
import { cn } from "@/lib/utils";

export default function Eyebrow({ children, center }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-primary/90",
      center && "justify-center"
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      {children}
    </span>
  );
}