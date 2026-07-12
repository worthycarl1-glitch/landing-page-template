import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

const ENGINE_IMAGE = "https://media.base44.com/images/public/6a531807448ccafb5fbc5248/727d347c5_generated_image.png";

/**
 * A contained 3D engine object (not a full-screen wrap).
 * The image is mapped onto a cylinder that rotates on its Y axis
 * as the user scrolls — like a turntable showing all sides.
 * Camera is positioned far enough to see it as an object.
 */
export default function EngineBackground({ opacity = 0.6, overlay = 0.3 }) {
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
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    let mesh = null;
    const loader = new THREE.TextureLoader();

    loader.load(ENGINE_IMAGE, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      // Moderate radius so it's a visible object, not a barrel around us
      const radius = 4.5;
      const heightCyl = 10;
      const segments = 128;

      const geo = new THREE.CylinderGeometry(radius, radius, heightCyl, segments, 1, true);

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
      scene.add(mesh);
    });

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let rafId;
    const animate = () => {
      if (mesh) {
        const targetY = scrollProgress.current * Math.PI * 2;
        mesh.rotation.y += (targetY - mesh.rotation.y) * 0.05;
      }
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

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
      <div className="absolute inset-0 bg-background" />
      <div ref={mountRef} className="absolute inset-0" style={{ opacity: reduce ? 0.1 : 1 }} />
      <div className="absolute inset-0 bg-background" style={{ opacity: overlay }} />
    </div>
  );
}