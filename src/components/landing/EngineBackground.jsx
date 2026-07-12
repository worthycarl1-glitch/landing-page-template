import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ENGINE_IMAGE = "https://media.base44.com/images/public/6a531807448ccafb5fbc5248/727d347c5_generated_image.png";

/**
 * True 3D engine background: the engine image is wrapped around a cylinder
 * surface, giving it real volume at every angle. The cylinder rotates a full
 * 360° on its Y-axis as you scroll, like a turntable.
 */
export default function EngineBackground({ opacity = 0.5, overlay = 0.3 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- Group ---
    const engine = new THREE.Group();
    scene.add(engine);

    // --- Main cylinder with engine texture ---
    const cylinderRadius = 2.5;
    const cylinderHeight = 4;
    const cylinderGeo = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 64, 1, true);

    const textureLoader = new THREE.TextureLoader();
    const engineTexture = textureLoader.load(ENGINE_IMAGE);
    engineTexture.wrapS = THREE.RepeatWrapping;
    engineTexture.wrapT = THREE.ClampToEdgeWrapping;

    const cylinderMat = new THREE.MeshStandardMaterial({
      map: engineTexture,
      side: THREE.DoubleSide,
      metalness: 0.4,
      roughness: 0.6,
      transparent: true,
      opacity: opacity,
    });
    const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
    cylinder.rotation.z = Math.PI / 2; // lay it horizontal so Y-spin reads as axial
    engine.add(cylinder);

    // --- End caps (dark metallic discs) ---
    const capGeo = new THREE.CircleGeometry(cylinderRadius, 64);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1e,
      metalness: 0.9,
      roughness: 0.3,
      transparent: true,
      opacity: opacity * 0.8,
    });
    const cap1 = new THREE.Mesh(capGeo, capMat);
    cap1.rotation.y = Math.PI / 2;
    cap1.position.x = cylinderHeight / 2;
    engine.add(cap1);

    const cap2 = new THREE.Mesh(capGeo, capMat);
    cap2.rotation.y = -Math.PI / 2;
    cap2.position.x = -cylinderHeight / 2;
    engine.add(cap2);

    // --- Protruding coils (tube geometry on helix curves) ---
    const greenTubeMat = new THREE.MeshStandardMaterial({
      color: 0x1a3a28,
      emissive: 0x4ade80,
      emissiveIntensity: 2.5,
      metalness: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: opacity * 0.9,
    });

    const createHelix = (radius, height, turns, segments, offset) => {
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2 * turns + offset;
        points.push(new THREE.Vector3(
          (t - 0.5) * height,
          Math.cos(angle) * radius,
          Math.sin(angle) * radius
        ));
      }
      return new THREE.CatmullRomCurve3(points);
    };

    const coilConfigs = [
      { radius: cylinderRadius + 0.15, height: cylinderHeight * 0.85, turns: 4, segments: 200, tube: 0.08, offset: 0 },
      { radius: cylinderRadius + 0.25, height: cylinderHeight * 0.75, turns: 3, segments: 180, tube: 0.06, offset: Math.PI },
      { radius: cylinderRadius + 0.1, height: cylinderHeight * 0.9, turns: 5, segments: 220, tube: 0.05, offset: Math.PI / 2 },
    ];

    coilConfigs.forEach((cfg) => {
      const curve = createHelix(cfg.radius, cfg.height, cfg.turns, cfg.segments, cfg.offset);
      const geo = new THREE.TubeGeometry(curve, cfg.segments, cfg.tube, 8, false);
      engine.add(new THREE.Mesh(geo, greenTubeMat));
    });

    // --- Protruding tubes (cylinders sticking out radially) ---
    const protMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      emissive: 0x4ade80,
      emissiveIntensity: 3,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: opacity,
    });

    const protConfigs = [
      { angle: 0, length: 1.2, radius: 0.12 },
      { angle: Math.PI / 3, length: 1.5, radius: 0.1 },
      { angle: (2 * Math.PI) / 3, length: 1.0, radius: 0.14 },
      { angle: Math.PI, length: 1.3, radius: 0.11 },
      { angle: (4 * Math.PI) / 3, length: 1.6, radius: 0.09 },
      { angle: (5 * Math.PI) / 3, length: 1.1, radius: 0.13 },
    ];

    protConfigs.forEach((cfg) => {
      const x = (Math.random() - 0.5) * cylinderHeight * 0.7;
      const geo = new THREE.CylinderGeometry(cfg.radius, cfg.radius, cfg.length, 12);
      const mesh = new THREE.Mesh(geo, protMat);
      mesh.position.set(
        x,
        Math.cos(cfg.angle) * (cylinderRadius + cfg.length / 2),
        Math.sin(cfg.angle) * (cylinderRadius + cfg.length / 2)
      );
      mesh.rotation.x = cfg.angle;
      engine.add(mesh);

      // Glow cap at the tip
      const capGeo2 = new THREE.SphereGeometry(cfg.radius * 1.5, 12, 12);
      const cap = new THREE.Mesh(capGeo2, protMat);
      cap.position.set(
        x,
        Math.cos(cfg.angle) * (cylinderRadius + cfg.length),
        Math.sin(cfg.angle) * (cylinderRadius + cfg.length)
      );
      engine.add(cap);
    });

    // --- Lights ---
    scene.add(new THREE.AmbientLight(0x333340, 0.8));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
    keyLight.position.set(5, 3, 5);
    scene.add(keyLight);
    const greenLight = new THREE.PointLight(0x4ade80, 4, 12);
    greenLight.position.set(0, 0, 4);
    scene.add(greenLight);
    const rimLight = new THREE.PointLight(0x22c55e, 2, 10);
    rimLight.position.set(-4, 2, -2);
    scene.add(rimLight);

    // --- Scroll-driven full 360° rotation ---
    let targetRotation = 0;
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetRotation = (window.scrollY / Math.max(maxScroll, 1)) * Math.PI * 2;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- Animation loop ---
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      engine.rotation.x += (targetRotation - engine.rotation.x) * 0.06;
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
      engineTexture.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [opacity]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-background" style={{ opacity: overlay }} />
    </div>
  );
}