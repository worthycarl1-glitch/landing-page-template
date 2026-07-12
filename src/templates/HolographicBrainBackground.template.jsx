/**
 * HolographicBrainBackground.jsx
 * ─────────────────────────────────────────────────────────────
 * Reusable JARVIS-style holographic brain background.
 * Drop this component into any React + Three.js + Framer Motion project.
 *
 * Features:
 *  - Procedurally generated brain-fold curves (white-matter tract look)
 *  - Glowing tube meshes with flowing pulse shader
 *  - Light pulses (eye/lip-shaped) traveling inside the strands at varied speeds
 *  - Tube bulges where each pulse passes (ball-through-hose effect)
 *  - Pulsate flash when a pulse completes a full lap
 *  - Constant Y-axis rotation + scroll-driven X-axis tilt
 *  - Accessible: reduced-motion fallback
 *
 * Required deps (npm install):
 *   three  framer-motion  react
 *
 * Usage:
 *   import HolographicBrainBackground from "./HolographicBrainBackground";
 *   <HolographicBrainBackground />           // defaults
 *   <HolographicBrainBackground opacity={0.6} overlay={0.35} color={0x4ade80} />
 *
 * Props:
 *   opacity  — base tube/brain brightness (0–1, default 0.6)
 *   overlay  — dark scrim behind brain for legibility (0–1, default 0.35)
 *   color    — THREE.Color hex value for the accent glow (default 0x4ade80)
 *
 * Font / theme tokens expected (optional — falls back to defaults):
 *   Tailwind classes: bg-background, border-border  (or it just renders transparent)
 *   This component renders a fixed full-viewport layer behind everything (-z-10).
 * ─────────────────────────────────────────────────────────────
 */
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

/**
 * Procedurally generate brain-shaped curves (white matter tract look).
 * Curves follow the surface of a brain-shaped ellipsoid with fold noise,
 * split into two hemispheres, plus some interior curves for depth.
 *
 * @param {number} count  Number of curves to generate (more = denser brain)
 * @returns {THREE.CatmullRomCurve3[]}
 */
function generateBrainCurves(count = 220) {
  const curves = [];
  const rx = 1.5, ry = 1.0, rz = 1.2;

  for (let i = 0; i < count; i++) {
    const points = [];
    const numPoints = 15 + Math.floor(Math.random() * 20);

    // Surface vs interior (80% surface for the brain-fold look)
    const isSurface = Math.random() < 0.8;
    const hemisphere = Math.random() > 0.5 ? 1 : -1;

    if (isSurface) {
      let u = Math.random() * Math.PI * 0.8 + Math.PI * 0.1;
      let v = Math.random() * Math.PI + Math.PI * 0.2;
      const du = (Math.random() - 0.5) * 0.3;
      const dv = (Math.random() - 0.5) * 0.2;

      for (let j = 0; j < numPoints; j++) {
        const foldNoise = 0.12 * Math.sin(u * 7 + j * 0.3) * Math.cos(v * 9 + j * 0.2);
        const r = 0.92 + foldNoise;
        const x = hemisphere * rx * r * Math.sin(u) * Math.cos(v);
        const y = ry * r * Math.cos(u);
        const z = rz * r * Math.sin(u) * Math.sin(v);
        points.push(new THREE.Vector3(x, y, z));
        u += du + (Math.random() - 0.5) * 0.1;
        v += dv + (Math.random() - 0.5) * 0.08;
      }
    } else {
      // Interior curve — random walk inside the ellipsoid
      let x = hemisphere * Math.random() * rx * 0.6;
      let y = (Math.random() - 0.5) * ry * 1.2;
      let z = (Math.random() - 0.5) * rz * 1.0;
      let dx = (Math.random() - 0.5) * 0.3;
      let dy = (Math.random() - 0.5) * 0.3;
      let dz = (Math.random() - 0.5) * 0.3;

      for (let j = 0; j < numPoints; j++) {
        points.push(new THREE.Vector3(x, y, z));
        dx += (Math.random() - 0.5) * 0.12;
        dy += (Math.random() - 0.5) * 0.12;
        dz += (Math.random() - 0.5) * 0.12;
        const speed = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const maxSpeed = 0.35;
        if (speed > maxSpeed) { dx *= maxSpeed / speed; dy *= maxSpeed / speed; dz *= maxSpeed / speed; }
        x += dx; y += dy; z += dz;
        const inside = (x / rx) ** 2 + (y / ry) ** 2 + (z / rz) ** 2;
        if (inside > 0.85) { x *= 0.92; y *= 0.92; z *= 0.92; }
      }
    }

    if (points.length >= 4) {
      curves.push(new THREE.CatmullRomCurve3(points));
    }
  }

  return curves;
}

// ═══════════════════════════════════════════════════════════════
// Shaders
// ═══════════════════════════════════════════════════════════════

// Tube shader — flowing pulse + dynamic bulge where the traveling pulse sits
const tubeVertexShader = `
  varying vec2 vUv;
  uniform float time;
  uniform float pulsePos;
  uniform float pulseStrength;
  uniform float pulseWidth;
  varying float vProgress;
  void main() {
    vUv = uv;
    vProgress = smoothstep(-1.0, 1.0, sin(vUv.x * 8.0 + time * 3.0));
    // Bulge the tube outward where the pulse is traveling
    float d = vUv.x - pulsePos;
    float bulge = exp(-d * d / (2.0 * pulseWidth * pulseWidth)) * pulseStrength;
    vec3 displaced = position + normal * bulge;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const tubeFragmentShader = `
  uniform vec3 color;
  uniform float opacity;
  varying vec2 vUv;
  varying float vProgress;
  void main() {
    float hideCorners1 = smoothstep(1.0, 0.9, vUv.x);
    float hideCorners2 = smoothstep(0.0, 0.1, vUv.x);
    vec3 finalColor = mix(color, color * 0.2, vProgress);
    gl_FragColor = vec4(finalColor, opacity * hideCorners1 * hideCorners2);
  }
`;

// Particle shaders — soft additive points traveling along the curves
const particleVertexShader = `
  attribute float randoms;
  varying float vRandom;
  void main() {
    vRandom = randoms;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = randoms * 3.0 * (1.0 / -mvPosition.z);
  }
`;

const particleFragmentShader = `
  uniform vec3 color;
  void main() {
    float disc = length(gl_PointCoord.xy - vec2(0.5));
    float opacity = 0.4 * smoothstep(0.5, 0.4, disc);
    gl_FragColor = vec4(color, opacity);
  }
`;

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export default function HolographicBrainBackground({
  opacity = 0.6,
  overlay = 0.35,
  color = 0x4ade80,
}) {
  const mountRef = useRef(null);
  const reduce = useReducedMotion();
  const scrollProgress = useRef(0);

  // ACCENT color — change this to re-theme the whole brain
  const ACCENT = new THREE.Color(color);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ── Generate brain curves ──
    const curves = generateBrainCurves(220);

    // ── Tube material (shared, then cloned per-strand for individual pulses) ──
    const tubeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: ACCENT.clone() },
        opacity: { value: opacity * 0.7 },
        pulsePos: { value: -1 },
        pulseStrength: { value: 0 },
        pulseWidth: { value: 0.06 },
      },
      vertexShader: tubeVertexShader,
      fragmentShader: tubeFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // ── Tube meshes ──
    const tubes = [];
    const tubeMaterials = [];
    curves.forEach((curve) => {
      const geo = new THREE.TubeGeometry(curve, 30, 0.006, 5, false);
      const mat = tubeMaterial.clone();
      tubeMaterials.push(mat);
      const mesh = new THREE.Mesh(geo, mat);
      tubes.push(mesh);
    });

    const brainGroup = new THREE.Group();
    tubes.forEach((t) => brainGroup.add(t));
    scene.add(brainGroup);

    // ── Traveling particles ──
    const density = 8;
    const numParticles = density * curves.length;

    const particleData = [];
    for (let i = 0; i < numParticles; i++) {
      const curveIdx = Math.floor(i / density);
      particleData.push({
        curve: curves[curveIdx],
        offset: Math.random(),
        speed: 0.002 + Math.random() * 0.008,
      });
    }

    const positions = new Float32Array(numParticles * 3);
    const randoms = new Float32Array(numParticles);
    for (let i = 0; i < numParticles; i++) {
      const p = particleData[i].curve.getPointAt(0);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      randoms[i] = 0.3 + Math.random() * 0.7;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("randoms", new THREE.BufferAttribute(randoms, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: { color: { value: ACCENT.clone() } },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMaterial);
    brainGroup.add(particles);

    // ── Scroll tracking ──
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ── Light pulses (on exactly half the strands, varied speeds) ──
    const pulseGroup = new THREE.Group();
    brainGroup.add(pulseGroup);
    const pulses = [];
    const curveIndices = curves.map((_, i) => i).sort(() => Math.random() - 0.5);
    const halfCount = Math.floor(curves.length / 2);
    for (let i = 0; i < halfCount; i++) {
      const curveIdx = curveIndices[i];
      // Eye/lip-shaped pulse: octahedron flattened vertically, long axis along the strand.
      // Cross-section (y, z) fits inside the tube radius so the pulse appears embedded.
      const geo = new THREE.OctahedronGeometry(0.012, 2);
      const mat = new THREE.MeshBasicMaterial({
        color: ACCENT.clone(),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.set(3.0, 0.35, 0.35);
      pulseGroup.add(mesh);
      pulses.push({
        mesh,
        curve: curves[curveIdx],
        tubeMat: tubeMaterials[curveIdx],
        offset: Math.random(),
        speed: 0.0005 + Math.random() * 0.005, // varied speeds
        lapPulse: 0, // decays after a full lap
      });
    }

    // ── Animation loop ──
    let rafId;
    let frame = 0;
    let smoothedScroll = 0;
    const animate = () => {
      frame++;
      const time = frame * 0.016;

      // Update pulse shader time on all tube materials
      tubeMaterials.forEach((m) => { m.uniforms.time.value = time; });

      // Smoothed scroll for stable north-south tilt
      smoothedScroll += (scrollProgress.current - smoothedScroll) * 0.05;

      // Constant east-to-west rotation (Y axis, always spinning)
      brainGroup.rotation.y += 0.005;

      // Scroll-driven north-to-south tilt (X axis)
      const targetX = smoothedScroll * Math.PI * 1.5;
      brainGroup.rotation.x += (targetX - brainGroup.rotation.x) * 0.05;

      // Update particle positions along their curves
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleData.length; i++) {
        particleData[i].offset += particleData[i].speed;
        particleData[i].offset %= 1;
        const p = particleData[i].curve.getPointAt(particleData[i].offset);
        posAttr.array[i * 3] = p.x;
        posAttr.array[i * 3 + 1] = p.y;
        posAttr.array[i * 3 + 2] = p.z;
      }
      posAttr.needsUpdate = true;

      // Light pulses traveling along the strands
      pulses.forEach((p) => {
        p.offset += p.speed;
        if (p.offset >= 1) {
          p.offset %= 1;
          p.lapPulse = 1; // trigger pulsate on full lap
        }
        p.lapPulse *= 0.94; // decay

        const pt = p.curve.getPointAt(p.offset);
        p.mesh.position.copy(pt);
        // Orient long axis (X) along the strand tangent — ball in a hose
        const tangent = p.curve.getTangentAt(p.offset).normalize();
        p.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tangent);

        // Sine envelope for travel brightness + lap pulsate boost
        const wave = Math.sin(p.offset * Math.PI);
        const pulseOpacity = wave * 0.7 + p.lapPulse * 0.8;
        p.mesh.material.opacity = Math.min(pulseOpacity, 1);
        const s = 0.6 + wave * 0.8 + p.lapPulse * 2.5;
        p.mesh.scale.set(3.0 * s, 0.35 * s, 0.35 * s);
        // Drive the tube bulge — displaced outward where the pulse sits
        p.tubeMat.uniforms.pulsePos.value = p.offset;
        p.tubeMat.uniforms.pulseStrength.value = (wave * 0.5 + p.lapPulse * 0.6) * 0.008;
      });

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    // ── Resize ──
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      tubes.forEach((t) => t.geometry.dispose());
      tubeMaterials.forEach((m) => m.dispose());
      tubeMaterial.dispose();
      particleGeo.dispose();
      particleMaterial.dispose();
      pulses.forEach((p) => { p.mesh.geometry.dispose(); p.mesh.material.dispose(); });
    };
  }, [opacity, overlay, color]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* If your new project has Tailwind with bg-background, this matches; 
          otherwise replace with style={{ background: '#09090B' }} */}
      <div className="absolute inset-0 bg-background" />
      <div ref={mountRef} className="absolute inset-0" style={{ opacity: reduce ? 0.1 : 1 }} />
      <div className="absolute inset-0 bg-background" style={{ opacity: overlay }} />
    </div>
  );
}