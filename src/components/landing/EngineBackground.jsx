import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const ENGINE_IMAGE = "https://media.base44.com/images/public/6a531807448ccafb5fbc5248/44e96843d_generated_image.png";

/**
 * Uses a high-fidelity rendered image of a mechanical engine
 * with scroll-driven 3D parallax (rotateY + rotateX + scale + translateZ).
 * Limited rotation range avoids the "flat sheet flipping" problem
 * while still giving a volumetric, dimensional feel.
 */
export default function EngineBackground({ opacity = 0.45, overlay = 0.3 }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const rotateY = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, -3, 8]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.3, 1.15]);
  const translateZ = useTransform(scrollYProgress, [0, 0.5, 1], [0, 50, -30]);

  if (reduce) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <img src={ENGINE_IMAGE} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-10" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ perspective: "1400px" }}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          rotateY,
          rotateX,
          scale,
          translateZ,
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={ENGINE_IMAGE}
          alt=""
          aria-hidden="true"
          className="w-[170%] h-[170%] object-cover"
          style={{ opacity, filter: "contrast(1.1) saturate(1.15)" }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-background" style={{ opacity: overlay }} />
    </div>
  );
}