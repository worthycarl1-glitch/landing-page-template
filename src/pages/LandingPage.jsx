import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SignatureSection from "@/components/landing/SignatureSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import DemoSection from "@/components/landing/DemoSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const [isChecking, setIsChecking] = useState(true);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const railScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        if (user) {
          if (user.role === "admin" || user.is_assistant_admin) window.location.href = "/Dashboard";
          else if (user.user_type === "closer") window.location.href = "/CloserDashboard";
          else if (user.user_type === "setter") window.location.href = "/SetterDashboard";
          else window.location.href = "/Dashboard";
        } else setIsChecking(false);
      } catch { setIsChecking(false); }
    };
    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased overflow-x-hidden">
      {/* Scroll progress rail */}
      {!reduce && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[60]"
          style={{ scaleX: railScale }}
        />
      )}

      <LandingNav />

      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <SignatureSection />
        <FeaturesSection />
        <PricingSection />
        <DemoSection />
      </main>

      <Footer />
    </div>
  );
}