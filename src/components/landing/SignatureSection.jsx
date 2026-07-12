import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { UserCheck, Phone, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/landing/AnimationPrimitives";
import Eyebrow from "@/components/landing/Eyebrow";

const STEPS = [
  {
    n: "01",
    icon: UserCheck,
    title: "Assign the team",
    desc: "Link each setter to a closer. Closers grant access to the exact folders they want worked — nothing more.",
  },
  {
    n: "02",
    icon: Phone,
    title: "Call from the card",
    desc: "Setters click-to-dial straight from the contact card. Set follow-ups with notifications, drop bad numbers to DNC, log it all in one place.",
  },
  {
    n: "03",
    icon: CalendarCheck,
    title: "Book into the closer",
    desc: "Setters book appointments only into their assigned closer's calendar, only from their assigned folders. Structure enforced by the software.",
  },
];

function StepCard({ step, active }) {
  const Icon = step.icon;
  return (
    <div className={cn(
      "relative rounded-md border bg-background p-8 transition-all duration-500",
      active
        ? "border-primary shadow-[0_0_0_1px_hsl(142_69%_58%),0_0_60px_-12px_hsl(142_69%_58%/0.3)]"
        : "border-border"
    )}>
      <div className="flex items-center justify-between mb-6">
        <span className={cn(
          "font-mono text-4xl font-bold transition-colors duration-500",
          active ? "text-primary" : "text-muted-foreground/20"
        )}>
          {step.n}
        </span>
        <div className={cn(
          "w-10 h-10 rounded-md flex items-center justify-center transition-all duration-500",
          active ? "bg-primary/10 border border-primary/30" : "bg-muted border border-border"
        )}>
          <Icon className={cn(
            "w-5 h-5 transition-colors duration-500",
            active ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
    </div>
  );
}

function ActiveOnView({ step }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  return (
    <div ref={ref}>
      <StepCard step={step} active={inView} />
    </div>
  );
}

export default function SignatureSection() {
  const reduce = useReducedMotion();

  return (
    <section id="how-it-works" className="relative border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-4 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            The setter/closer system, enforced by the software
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Not a CRM you have to bend into shape. The structure sales teams actually
            use is built into the flows — leads migrate automatically, access is
            controlled, and setters can only book where they're supposed to.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
            >
              <ActiveOnView step={s} />
            </motion.div>
          ))}
        </div>

        {/* Punchline */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col md:flex-row items-start md:items-center gap-4 rounded-md border border-primary/30 bg-primary/5 p-6">
            <CalendarCheck className="w-6 h-6 text-primary flex-shrink-0" />
            <p className="text-sm md:text-base">
              <span className="font-semibold">The part no spreadsheet can do:</span>{" "}
              a setter can only book into their assigned closer's calendar, only from
              folders that closer opened to them. Right lead, right rep, right calendar
              — every time.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}