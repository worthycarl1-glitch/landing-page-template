import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const BG_IMAGE = "https://media.base44.com/images/public/6a531807448ccafb5fbc5248/9b12eeaee_generated_87d39218.png";

export default function ScrollBackground() {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Map scroll progress → 3D rotation (full 360° spin over the page)
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.25, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.12, 0.18, 0.18, 0.08]);

  if (reduce) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src={BG_IMAGE}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.08]"
        />
        <div className="absolute inset-0 bg-background/40" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          rotateY,
          rotateX,
          scale,
          opacity,
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={BG_IMAGE}
          alt=""
          aria-hidden="true"
          className="w-[140%] h-[140%] object-cover"
        />
      </motion.div>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/55" />
    </div>
  );
}