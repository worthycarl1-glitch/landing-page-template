import React from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SignatureSection from "@/components/landing/SignatureSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import DemoSection from "@/components/landing/DemoSection";
import Footer from "@/components/landing/Footer";
import EngineBackground from "@/components/landing/EngineBackground";

export default function LandingPage() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const railScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen flex flex-col text-foreground antialiased overflow-x-hidden">
      {/* True 3D engine background */}
      <EngineBackground opacity={0.5} overlay={0.3} />

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