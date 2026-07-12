import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const ENGINE_IMAGE = "https://media.base44.com/images/public/6a531807448ccafb5fbc5248/727d347c5_generated_image.png";

/**
 * The engine image is a solid, full-bleed background.
 * Scroll drives a slow 360° rotation on the image itself.
 * No cylinder wrapping, no transparency on the background —
 * the overlaying text/UI components carry the translucency.
 */
export default function EngineBackground({ overlay = 0.25 }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.4, 1.2]);

  if (reduce) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <img src={ENGINE_IMAGE} alt="" aria-hidden="true" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background" style={{ opacity: overlay }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.img
        src={ENGINE_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ rotate, scale }}
      />
      <div className="absolute inset-0 bg-background" style={{ opacity: overlay }} />
    </div>
  );
}