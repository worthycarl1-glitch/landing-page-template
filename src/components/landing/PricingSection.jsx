import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/landing/AnimationPrimitives";
import Eyebrow from "@/components/landing/Eyebrow";

const PLANS = [
  {
    name: "Standard",
    price: { month: 50, year: 500 },
    per: { month: "~$1.67/day", year: "$42/mo billed annually" },
    blurb: "Everything a solo closer needs to run their own pipeline.",
    features: [
      "Lead generator",
      "AI text & image import",
      "Dashboard with calendar availability",
      "Google Calendar + Gmail sync",
      "Folder management system",
      "Sales tracker",
      "Client results pages",
      "1 phone number, outbound (minutes sold separately)",
    ],
    featured: false,
  },
  {
    name: "Professional",
    price: { month: 100, year: 1000 },
    per: { month: "~$3.33/day", year: "$83/mo billed annually" },
    blurb: "Add setters and run a real team with enforced structure.",
    features: [
      "Everything in Standard",
      "Up to 2 setter profiles",
      "Auto folder syncing across profiles",
      "Calendar syncing for booking",
      "Team performance tracking",
      "Up to 3 phone numbers, outbound",
    ],
    featured: true,
  },
  {
    name: "Boss",
    price: { month: 150, year: 1500 },
    per: { month: "~$5.00/day", year: "$125/mo billed annually" },
    blurb: "Scale the whole operation with a full floor of setters.",
    features: [
      "Everything in Professional",
      "Up to 5 setter profiles",
      "Advanced team management",
      "Priority support",
      "Up to 6 phone numbers, outbound",
    ],
    featured: false,
  },
];

const PRICING_BG = "https://media.base44.com/images/public/6a531807448ccafb5fbc5248/3bfad13e2_generated_a12acae5.png";

export default function PricingSection() {
  const [interval, setInterval] = useState("month");
  const reduce = useReducedMotion();

  return (
    <section id="pricing" className="relative border-b border-border overflow-hidden">
      {/* Background image, very subtle */}
      <div className="absolute inset-0 opacity-[0.04]">
        <img src={PRICING_BG} alt="" className="w-full h-full object-cover" aria-hidden="true" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex justify-center">
            <Eyebrow center>Pricing</Eyebrow>
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Priced for a floor, not an enterprise
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start solo, add setters as you grow. No per-seat surprises.
          </p>

          {/* Billing toggle — the "Shift Lever" */}
          <div className="mt-8 inline-flex items-center bg-transparent border border-border/50 rounded-md p-1 relative">
            {["month", "year"].map((iv) => (
              <button
                key={iv}
                onClick={() => setInterval(iv)}
                className={cn(
                  "relative z-10 px-6 py-2.5 rounded text-sm font-mono tracking-wider uppercase transition-colors min-h-[44px]",
                  interval === iv
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {interval === iv && (
                  <motion.span
                    layoutId="billpill"
                    className="absolute inset-0 bg-primary rounded -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {iv === "month" ? "Monthly" : "Annual"}
                {iv === "year" && <span className="ml-2 text-xs opacity-80">-17%</span>}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Plan pillars */}
        <Stagger className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch" gap={0.1}>
          {PLANS.map((plan) => (
            <StaggerItem key={plan.name}>
              <div className={cn(
                "rounded-md border border-border/50 p-8 bg-transparent relative h-full flex flex-col transition-transform duration-300 hover:-translate-y-1",
                plan.featured
                  ? "border-primary shadow-[0_0_0_1px_hsl(142_69%_58%),0_0_80px_-16px_hsl(142_69%_58%/0.25)]"
                  : "border-border"
              )}>
                {plan.featured && (
                  <span className="absolute -top-3 left-8 font-mono text-[10px] uppercase tracking-[0.2em] bg-primary text-primary-foreground px-3 py-1 rounded">
                    Most popular
                  </span>
                )}

                <h3 className="font-heading font-bold text-xl">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-1 mb-6 min-h-[40px]">{plan.blurb}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-bold">$</span>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={plan.price[interval]}
                      className="font-mono text-4xl font-bold"
                      initial={reduce ? false : { y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {plan.price[interval]}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-muted-foreground font-mono text-sm">
                    /{interval === "month" ? "mo" : "yr"}
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground mt-1 mb-7">
                  {plan.per[interval]}
                </p>

                <a href="/register">
                  <Button
                    variant={plan.featured ? "default" : "outline"}
                    className="w-full mb-7 min-h-[48px] font-mono text-xs tracking-wider uppercase group"
                  >
                    Get started <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </a>

                <ul className="space-y-3 mt-auto">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}