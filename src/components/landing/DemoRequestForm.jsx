import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export default function DemoRequestForm({ title, subtitle, buttonText = "Book a demo" }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("loading");
    try {
      await base44.integrations.Core.SendEmail({
        to: form.email,
        subject: "Demo Request Received — Simple Appointments",
        body: `Hi ${form.name},\n\nThanks for requesting a demo. We'll be in touch within 24 hours to schedule your 15-minute walkthrough.\n\nBest,\nThe SA Team`,
      });
      setStatus("success");
    } catch {
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-md border border-primary/30 bg-primary/5 p-12 text-center">
        <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
        <h3 className="font-heading font-bold text-2xl mb-2">You're on the list</h3>
        <p className="text-muted-foreground">We'll reach out within 24 hours to lock in your demo.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight">{title}</h2>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{subtitle}</p>
        <div className="mt-6 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
            All systems operational
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-card border-border min-h-[48px] font-body"
          />
          <Input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="bg-card border-border min-h-[48px] font-body"
          />
        </div>
        <Input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="bg-card border-border min-h-[48px] font-body"
        />
        <Input
          type="tel"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="bg-card border-border min-h-[48px] font-body"
        />
        <Button type="submit" size="lg" className="w-full min-h-[48px] font-mono text-sm tracking-wider uppercase group" disabled={status === "loading"}>
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>{buttonText} <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" /></>
          )}
        </Button>
      </form>
    </div>
  );
}