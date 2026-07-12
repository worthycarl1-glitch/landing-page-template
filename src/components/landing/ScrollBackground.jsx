import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const BG_IMAGE = "https://media.base44.com/images/public/6a531807448ccafb5fbc5248/9b12eeaee_generated_87d39218.png";

export default function ScrollBackground() {
  const reduce = useReducedMotion();

  // Global page scroll — no target ref (fixed elements don't trigger element-scroll)
  const { scrollYProgress } = useScroll();

  // Full 360° spin across the page scroll
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.3, 1.5, 1.3]);

  if (reduce) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src={BG_IMAGE}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.12]"
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          rotate,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={BG_IMAGE}
          alt=""
          aria-hidden="true"
          className="w-[180%] h-[180%] object-cover opacity-25"
        />
      </motion.div>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/40" />
    </div>
  );
}