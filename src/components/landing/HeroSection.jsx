import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Eyebrow from "@/components/landing/Eyebrow";
import { CountUp } from "@/components/landing/AnimationPrimitives";

const PUNCHY = [0.16, 1, 0.3, 1];

const HERO_STATS = [
  { to: 247, label: "Booked today" },
  { to: 89, suffix: "%", label: "Show rate" },
  { to: 18, prefix: "$", suffix: "k", label: "Revenue" },
];

export default function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-[500px] bg-gradient-to-b from-primary/8 via-primary/4 to-transparent blur-[100px]" />

      {/* Translucent backdrop panel behind hero text — lets the engine show through */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-0">
        <div className="w-full">
          {/* Copy */}
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Eyebrow>Built for setter / closer teams</Eyebrow>
            </motion.div>

            <motion.h1
              className="mt-6 text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.05]"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: PUNCHY, delay: 0.1 }}
            >
              Your setters and closers,{" "}
              <span className="text-primary">finally running as one system</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-3xl text-lg text-muted-foreground leading-relaxed"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: PUNCHY, delay: 0.2 }}
            >
              Assign setters to closers. Control who calls which leads. Let setters
              book straight into their closer's calendar — from the contact card,
              on the call. No spreadsheets, no double-dials, no chaos.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col sm:flex-row gap-3"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: PUNCHY, delay: 0.3 }}
            >
              <a href="/register">
                <Button size="lg" className="h-12 px-7 text-base font-heading font-semibold group min-h-[48px]">
                  Get started <ArrowRight className="w-5 h-5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </a>
              <a href="#demo">
                <Button variant="outline" size="lg" className="h-12 px-7 text-base min-h-[48px]">
                  Book a demo
                </Button>
              </a>
            </motion.div>

            <motion.p
              className="mt-4 font-mono text-xs text-muted-foreground"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              From $50/mo · Cancel anytime
            </motion.p>
          </div>

        </div>
      </div>

      {/* Hero stat strip */}
      <div className="relative max-w-6xl mx-auto grid grid-cols-3 border-t border-border mt-16">
        {HERO_STATS.map((s, i) => (
          <div key={s.label} className={cn("px-6 py-7 text-center", i < 2 && "border-r border-border")}>
            <CountUp
              to={s.to}
              prefix={s.prefix}
              suffix={s.suffix}
              className={cn(
                "font-mono text-2xl md:text-3xl font-bold",
                i === 1 ? "text-primary" : "text-foreground"
              )}
            />
            <div className="font-mono text-xs text-muted-foreground mt-1.5 tracking-wider uppercase">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}