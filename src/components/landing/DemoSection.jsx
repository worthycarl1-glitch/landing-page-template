import React from "react";
import { Reveal } from "@/components/landing/AnimationPrimitives";
import DemoRequestForm from "@/components/landing/DemoRequestForm";

export default function DemoSection() {
  return (
    <section id="demo" className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <DemoRequestForm
            title="See it run before you commit"
            subtitle="Book a 15-minute demo and we'll show you the setter/closer system on your own workflow. No pressure, no slide deck marathon."
            buttonText="Book a demo"
          />
        </Reveal>
      </div>
    </section>
  );
}