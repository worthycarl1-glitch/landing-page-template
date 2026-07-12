import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

const GREEN = 0x4ade80;

/**
 * JARVIS-style holographic brain background.
 * Wireframe sphere + orbital rings + glowing core.
 * Rotates on its Y axis as the user scrolls.
 */
export default function EngineBackground({ opacity = 0.5, overlay = 0.3 }) {
  const mountRef = useRef(null);
  const reduce = useReducedMotion();
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- Wireframe sphere ---
    const sphereGeo = new THREE.SphereGeometry(5, 48, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: GREEN,
      wireframe: true,
      transparent: true,
      opacity: opacity * 0.4,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphere);

    // Inner denser wireframe for depth
    const sphereGeo2 = new THREE.SphereGeometry(3.5, 32, 20);
    const sphereMat2 = new THREE.MeshBasicMaterial({
      color: GREEN,
      wireframe: true,
      transparent: true,
      opacity: opacity * 0.25,
    });
    const sphere2 = new THREE.Mesh(sphereGeo2, sphereMat2);
    group.add(sphere2);

    // --- Glowing core ---
    const coreGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: opacity * 0.6,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Core glow halo (larger transparent sphere)
    const haloGeo = new THREE.SphereGeometry(2.2, 24, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: opacity * 0.12,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    group.add(halo);

    // --- Orbital rings ---
    const rings = [];
    const ringConfigs = [
      { radius: 6.5, tube: 0.04, rot: [0, 0, 0] },
      { radius: 7.0, tube: 0.03, rot: [Math.PI / 3, 0, 0] },
      { radius: 7.5, tube: 0.025, rot: [0, 0, Math.PI / 2.5] },
      { radius: 6.0, tube: 0.03, rot: [Math.PI / 2.2, Math.PI / 4, 0] },
    ];

    ringConfigs.forEach((cfg) => {
      const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 8, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color: GREEN,
        transparent: true,
        opacity: opacity * 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      rings.push(ring);
      group.add(ring);
    });

    // --- Data arcs (partial torus segments) ---
    const arcRing = new THREE.TorusGeometry(6.8, 0.06, 8, 128, Math.PI * 0.4);
    const arcMat = new THREE.MeshBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: opacity * 0.7,
    });
    const arc1 = new THREE.Mesh(arcRing, arcMat);
    arc1.rotation.set(Math.PI / 4, 0, Math.PI / 6);
    group.add(arc1);

    const arc2 = new THREE.Mesh(arcRing, arcMat.clone());
    arc2.material.opacity = opacity * 0.5;
    arc2.rotation.set(-Math.PI / 3, Math.PI / 2, Math.PI / 4);
    group.add(arc2);

    // --- Scroll tracking ---
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- Animation loop ---
    let rafId;
    let frame = 0;
    const animate = () => {
      frame++;
      const t = frame * 0.01;
      const targetY = scrollProgress.current * Math.PI * 2;

      // Smooth rotation on Y axis
      group.rotation.y += (targetY - group.rotation.y) * 0.04;

      // Slow tilt wobble
      group.rotation.x = Math.sin(t * 0.3) * 0.15;

      // Inner sphere counter-rotates slightly
      sphere2.rotation.y -= 0.003;
      sphere2.rotation.x += 0.002;

      // Rings each spin at different rates
      rings.forEach((r, i) => {
        r.rotation.z += 0.002 * (i + 1) * 0.3;
      });

      // Arcs orbit
      arc1.rotation.z += 0.004;
      arc2.rotation.y += 0.003;

      // Core pulse
      const pulse = 1 + Math.sin(t * 2) * 0.08;
      core.scale.setScalar(pulse);
      halo.scale.setScalar(1 + Math.sin(t * 1.5) * 0.12);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    // --- Resize ---
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      sphereGeo2.dispose();
      sphereMat2.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        r.material.dispose();
      });
      arcRing.dispose();
      arcMat.dispose();
    };
  }, [opacity]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-background" />
      <div ref={mountRef} className="absolute inset-0" style={{ opacity: reduce ? 0.1 : 1 }} />
      <div className="absolute inset-0 bg-background" style={{ opacity: overlay }} />
    </div>
  );
}