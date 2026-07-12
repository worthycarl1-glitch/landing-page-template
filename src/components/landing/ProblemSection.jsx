import React from "react";
import { Users, Phone, BarChart2 } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/landing/AnimationPrimitives";
import Eyebrow from "@/components/landing/Eyebrow";

const PROBLEMS = [
  {
    icon: Users,
    title: "Leads slip through",
    desc: "A lead lands, nobody owns it, and it dies in someone's inbox between \"I'll call them tomorrow\" and never.",
  },
  {
    icon: Phone,
    title: "Three people, one lead",
    desc: "No one wrote down who's calling who, so the same prospect gets dialed three times — or zero.",
  },
  {
    icon: BarChart2,
    title: "No visibility",
    desc: "Who booked what? Which closer is actually closing? You're guessing, because nothing tracks it.",
  },
];

export default function ProblemSection() {
  return (
    <section className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <Reveal className="max-w-2xl mb-12">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="mt-4 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Most sales teams run on a spreadsheet and a prayer
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Sticky notes, a 2012 spreadsheet, and the one guy who "keeps it all in his head."
            It works right up until it doesn't — and you can't see where it broke.
          </p>
        </Reveal>

        <Stagger className="grid md:grid-cols-3 gap-4">
          {PROBLEMS.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title} className="bg-transparent p-8">
              <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}