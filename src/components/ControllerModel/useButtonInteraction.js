import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * useButtonInteraction — button glow + click on the 3D controller.
 *
 * The idle breathing animation now runs inside useFrame() instead of a
 * standalone requestAnimationFrame loop. This means it only runs when
 * the R3F canvas is actively rendering (i.e. when the USP section is
 * in view), saving CPU/GPU when scrolled away.
 */
export default function useButtonInteraction({ button, gl, camera, changeVideo, invalidate }) {
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const glowMaterialRef = useRef();
  const originalColorRef = useRef();
  const isHoveringRef = useRef(false);
  const isFlashingRef = useRef(false);

  const BASE_INTENSITY = 0.15;
  const HOVER_INTENSITY = 0.35;
  const FLASH_MAX_INTENSITY = 1.5;
  const IDLE_DURATION_MS = 2000;

  // glow material setup (runs once)
  useEffect(() => {
    if (!button) return;
    const glowMat = button.material.clone();

    originalColorRef.current = glowMat.color.clone();
    glowMat.emissive = glowMat.color.clone();
    glowMat.emissiveIntensity = BASE_INTENSITY;

    if (typeof glowMat.toneMapped === "boolean") glowMat.toneMapped = false;
    button.material = glowMat;
    glowMaterialRef.current = glowMat;
  }, [button]);

  // Breathing animation inside useFrame — only runs when canvas renders
  useFrame((_, __, { clock } = {}) => {
    const mat = glowMaterialRef.current;
    const orig = originalColorRef.current;
    if (!mat || !orig || isFlashingRef.current) return;

    const t = (performance.now() % IDLE_DURATION_MS) / IDLE_DURATION_MS;
    const pulse = Math.sin(t * Math.PI * 2);
    const norm = (pulse + 1) / 2;

    if (isHoveringRef.current) {
      mat.emissiveIntensity = 0.25 + norm * 0.2;
    } else {
      mat.emissiveIntensity = 0.05 + norm * 0.2;
    }

    const whiteMix = norm * 0.3;
    mat.emissive.lerpColors(orig, new THREE.Color(0xffffff), whiteMix);
  });

  const flashButton = () => {
    if (!glowMaterialRef.current || !originalColorRef.current) return;
    isFlashingRef.current = true;

    const mat = glowMaterialRef.current;
    const startTime = performance.now();
    const flashUpMs = 100;
    const flashDownMs = 400;
    const whiteColor = new THREE.Color(0xffffff);

    const animate = (now) => {
      const elapsed = now - startTime;

      if (elapsed <= flashUpMs) {
        const t = elapsed / flashUpMs;
        mat.emissiveIntensity = BASE_INTENSITY + (FLASH_MAX_INTENSITY - BASE_INTENSITY) * t;
        mat.emissive.copy(originalColorRef.current).lerp(whiteColor, t);
        invalidate?.();
        requestAnimationFrame(animate);
        return;
      }

      const returnElapsed = elapsed - flashUpMs;
      if (returnElapsed <= flashDownMs) {
        const t = returnElapsed / flashDownMs;
        const eased = 1 - Math.pow(1 - t, 3);
        const targetIntensity = isHoveringRef.current ? HOVER_INTENSITY : BASE_INTENSITY;
        mat.emissiveIntensity = FLASH_MAX_INTENSITY + (targetIntensity - FLASH_MAX_INTENSITY) * eased;
        mat.emissive.copy(whiteColor).lerp(originalColorRef.current, eased);
        invalidate?.();
        requestAnimationFrame(animate);
        return;
      }

      mat.emissive.copy(originalColorRef.current);
      mat.emissiveIntensity = isHoveringRef.current ? HOVER_INTENSITY : BASE_INTENSITY;
      isFlashingRef.current = false;
      invalidate?.();
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!button || !camera || !gl) return;

    const handleDown = (e) => {
      const bounds = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.current.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      if (raycaster.current.intersectObject(button, true).length > 0) {
        flashButton();
        changeVideo();
      }
    };

    let rafId = null;
    const handlePointerMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const bounds = gl.domElement.getBoundingClientRect();
        mouse.current.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
        mouse.current.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

        raycaster.current.setFromCamera(mouse.current, camera);
        const hovering = raycaster.current.intersectObject(button, true).length > 0;
        isHoveringRef.current = hovering;

        if (hovering) {
          gl.domElement.classList.add("fuck-button");
        } else {
          gl.domElement.classList.remove("fuck-button");
        }
      });
    };

    gl.domElement.addEventListener("pointerdown", handleDown, { passive: true });
    gl.domElement.addEventListener("pointermove", handlePointerMove);

    return () => {
      gl.domElement.removeEventListener("pointerdown", handleDown);
      gl.domElement.removeEventListener("pointermove", handlePointerMove);
      gl.domElement.classList.remove("fuck-button");
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [button, camera, gl, changeVideo]);
}