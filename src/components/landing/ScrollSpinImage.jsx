import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const IMAGE_URL = "https://media.base44.com/images/public/6a531807448ccafb5fbc5248/9b12eeaee_generated_87d39218.png";

export default function ScrollSpinImage({ opacity = 0.25, overlay = 0.4 }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Y-axis rotation — spins like Earth on its axis
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.3, 1.5, 1.3]);

  if (reduce) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <img src={IMAGE_URL} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-10" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ perspective: "1200px" }}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotateY, scale, transformStyle: "preserve-3d" }}
      >
        <img
          src={IMAGE_URL}
          alt=""
          aria-hidden="true"
          className="w-[180%] h-[180%] object-cover"
          style={{ opacity }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-background" style={{ opacity: overlay }} />
    </div>
  );
}