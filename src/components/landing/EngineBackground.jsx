import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

const ENGINE_IMAGE = "https://media.base44.com/images/public/6a531807448ccafb5fbc5248/727d347c5_generated_image.png";

/**
 * 3D engine that rotates on its Y axis (planetary rotation) as the user scrolls.
 * The engine image is mapped onto a large-radius cylinder so the curvature is
 * gentle — no tornado distortion. The camera looks at the cylinder from the
 * front; as scroll drives rotation.y from 0→360°, all sides come into view.
 */
export default function EngineBackground({ opacity = 0.5, overlay = 0.3 }) {
  const mountRef = useRef(null);
  const reduce = useReducedMotion();

  // Track scroll progress (0–1) for the rotation
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // --- Scene ---
    const scene = new THREE.Scene();
    scene.background = null; // transparent canvas over CSS bg

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- Engine texture ---
    const loader = new THREE.TextureLoader();
    let mesh = null;
    let group = null;

    loader.load(ENGINE_IMAGE, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      // Large radius → gentle curvature so the image isn't distorted
      const radius = 8;
      const heightCyl = 12;
      const segments = 128;

      const geo = new THREE.CylinderGeometry(radius, radius, heightCyl, segments, 1, true);

      // Flip the texture horizontally so the front face reads correctly
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = -1;
      texture.offset.x = 1;

      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      mesh = new THREE.Mesh(geo, mat);
      // Lay the cylinder horizontally so its circular axis is horizontal
      // (engine on a turntable, spinning to show all sides)
      mesh.rotation.z = Math.PI / 2;

      group = new THREE.Group();
      group.add(mesh);
      scene.add(group);
    });

    // --- Scroll → rotation ---
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- Animation loop ---
    let rafId;
    const animate = () => {
      // Smoothly interpolate toward the scroll-driven target rotation
      if (group) {
        const targetY = scrollProgress.current * Math.PI * 2; // 0 → 360°
        group.rotation.y += (targetY - group.rotation.y) * 0.05;
      }
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
      if (mesh) {
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
    };
  }, [opacity]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Solid dark base */}
      <div className="absolute inset-0 bg-background" />
      {/* 3D canvas */}
      <div ref={mountRef} className="absolute inset-0" style={{ opacity: reduce ? 0.1 : 1 }} />
      {/* Dark overlay for readability of foreground UI */}
      <div className="absolute inset-0 bg-background" style={{ opacity: overlay }} />
    </div>
  );
}