import React, { useRef, useEffect } from "react";
import * as THREE from "three";

/**
 * True 3D "engine core" background built with Three.js.
 * Gears (torus), coils (tube geometry following helix curves),
 * and protruding tubes (cylinders) — rotating on Y-axis as you scroll.
 */
export default function EngineBackground({ opacity = 0.35, overlay = 0.35 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- Scene setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- Materials ---
    const darkMetal = new THREE.MeshStandardMaterial({
      color: 0x2a2a2e,
      metalness: 0.92,
      roughness: 0.35,
    });

    const chromeMetal = new THREE.MeshStandardMaterial({
      color: 0x555560,
      metalness: 0.95,
      roughness: 0.2,
    });

    const greenGlow = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      emissive: 0x4ade80,
      emissiveIntensity: 2.5,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.9,
    });

    const greenTube = new THREE.MeshStandardMaterial({
      color: 0x1a3a28,
      emissive: 0x22c55e,
      emissiveIntensity: 1.8,
      metalness: 0.6,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    });

    // --- Group to hold everything ---
    const engine = new THREE.Group();
    scene.add(engine);

    // --- Central core (cylinder) ---
    const coreGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.5, 32);
    const core = new THREE.Mesh(coreGeo, darkMetal);
    core.rotation.z = Math.PI / 2;
    engine.add(core);

    // --- Gears (torus shapes at various positions) ---
    const gears = [];
    const gearConfigs = [
      { radius: 2.8, tube: 0.3, pos: [0, 0, 0], rot: [0, 0, 0] },
      { radius: 2.2, tube: 0.22, pos: [1.5, 1.2, 0.5], rot: [Math.PI / 3, 0, Math.PI / 4] },
      { radius: 2.5, tube: 0.26, pos: [-1.4, -1, -0.3], rot: [0, Math.PI / 3, Math.PI / 6] },
      { radius: 1.8, tube: 0.2, pos: [0.8, -1.6, 0.8], rot: [Math.PI / 4, Math.PI / 6, 0] },
      { radius: 2.0, tube: 0.24, pos: [-1.2, 1.4, -0.5], rot: [Math.PI / 6, 0, Math.PI / 3] },
    ];

    gearConfigs.forEach((cfg) => {
      const geo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 80);
      const mesh = new THREE.Mesh(geo, chromeMetal);
      mesh.position.set(...cfg.pos);
      mesh.rotation.set(...cfg.rot);
      engine.add(mesh);
      gears.push(mesh);
    });

    // --- Coils (tube geometry following helix curves) ---
    const coils = [];

    const createHelix = (radius, height, turns, segments, offset = 0) => {
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2 * turns + offset;
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            (t - 0.5) * height,
            Math.sin(angle) * radius
          )
        );
      }
      return new THREE.CatmullRomCurve3(points);
    };

    // Main coils wrapping around the core
    const coilConfigs = [
      { radius: 2.6, height: 3, turns: 3, segments: 200, tubeRadius: 0.12, offset: 0 },
      { radius: 2.4, height: 2.8, turns: 3, segments: 200, tubeRadius: 0.1, offset: Math.PI },
      { radius: 2.8, height: 3.2, turns: 4, segments: 200, tubeRadius: 0.08, offset: Math.PI / 2 },
    ];

    coilConfigs.forEach((cfg) => {
      const curve = createHelix(cfg.radius, cfg.height, cfg.turns, cfg.segments, cfg.offset);
      const geo = new THREE.TubeGeometry(curve, cfg.segments, cfg.tubeRadius, 12, false);
      const mesh = new THREE.Mesh(geo, greenTube);
      engine.add(mesh);
      coils.push(mesh);
    });

    // --- Protruding tubes (cylinders sticking out) ---
    const protrusions = [];
    const protConfigs = [
      { length: 2.5, radius: 0.15, pos: [2, 0.5, 0.8], rot: [0, Math.PI / 4, Math.PI / 3] },
      { length: 2.2, radius: 0.12, pos: [-1.8, -0.6, 0.5], rot: [Math.PI / 6, -Math.PI / 4, Math.PI / 5] },
      { length: 2.8, radius: 0.14, pos: [0.3, 2.2, -0.5], rot: [Math.PI / 3, 0, Math.PI / 6] },
      { length: 2.0, radius: 0.1, pos: [-0.5, -2, 0.6], rot: [Math.PI / 4, Math.PI / 3, 0] },
      { length: 2.4, radius: 0.13, pos: [1.8, -1.2, -0.4], rot: [Math.PI / 5, Math.PI / 6, Math.PI / 4] },
      { length: 2.6, radius: 0.11, pos: [-2, 1, 0.3], rot: [0, -Math.PI / 3, Math.PI / 5] },
    ];

    protConfigs.forEach((cfg) => {
      const geo = new THREE.CylinderGeometry(cfg.radius, cfg.radius, cfg.length, 16);
      const mesh = new THREE.Mesh(geo, greenGlow);
      mesh.position.set(...cfg.pos);
      mesh.rotation.set(...cfg.rot);
      engine.add(mesh);
      protrusions.push(mesh);

      // Add a small sphere cap at the end
      const capGeo = new THREE.SphereGeometry(cfg.radius * 1.4, 16, 16);
      const cap = new THREE.Mesh(capGeo, greenGlow);
      cap.position.set(...cfg.pos);
      cap.rotation.set(...cfg.rot);
      cap.translateY(cfg.length / 2);
      engine.add(cap);
    });

    // --- Small accent spheres (energy nodes) ---
    const nodes = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 3 + Math.random() * 0.8;
      const geo = new THREE.SphereGeometry(0.15, 16, 16);
      const mesh = new THREE.Mesh(geo, greenGlow);
      mesh.position.set(
        Math.cos(angle) * r,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * r
      );
      engine.add(mesh);
      nodes.push(mesh);
    }

    // --- Lights ---
    const ambient = new THREE.AmbientLight(0x404050, 0.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const greenLight = new THREE.PointLight(0x4ade80, 3, 15);
    greenLight.position.set(0, 0, 3);
    scene.add(greenLight);

    const rimLight = new THREE.PointLight(0x22c55e, 2, 12);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // --- Scroll-driven rotation ---
    let targetRotation = 0;
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetRotation = (window.scrollY / Math.max(maxScroll, 1)) * Math.PI * 4;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- Animation loop ---
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);

      // Smooth interpolation toward scroll target
      engine.rotation.y += (targetRotation - engine.rotation.y) * 0.05;
      engine.rotation.x = Math.sin(targetRotation * 0.3) * 0.15;

      // Gears spin at their own rates
      gears.forEach((g, i) => {
        g.rotation.z += 0.005 * (i + 1) * (i % 2 === 0 ? 1 : -1);
      });

      // Nodes pulse
      nodes.forEach((n, i) => {
        const t = Date.now() * 0.001 + i;
        n.scale.setScalar(1 + Math.sin(t * 2) * 0.3);
      });

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize ---
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div ref={mountRef} className="w-full h-full" style={{ opacity }} />
      <div className="absolute inset-0 bg-background" style={{ opacity: overlay }} />
    </div>
  );
}