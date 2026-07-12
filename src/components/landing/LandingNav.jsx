import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Demo", href: "#demo" },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-background/80 backdrop-blur-xl border-b border-border"
        : "bg-transparent"
    )}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="font-mono font-bold text-sm text-primary-foreground">SA</span>
          </div>
          <span className="font-heading font-bold text-lg tracking-tight hidden sm:block">
            Simple Appointments
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/login">
            <Button variant="ghost" size="sm" className="font-mono text-xs tracking-wider uppercase">
              Log in
            </Button>
          </a>
          <a href="/register">
            <Button size="sm" className="font-mono text-xs tracking-wider uppercase group min-h-[44px] min-w-[44px]">
              Ignition <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 min-h-[48px] min-w-[48px] flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="md:hidden bg-background border-b border-border"
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground py-3 min-h-[48px] flex items-center transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-3 border-t border-border mt-2">
              <a href="/login" className="flex-1">
                <Button variant="outline" className="w-full min-h-[48px] font-mono text-xs uppercase">Log in</Button>
              </a>
              <a href="/register" className="flex-1">
                <Button className="w-full min-h-[48px] font-mono text-xs uppercase">Ignition</Button>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}