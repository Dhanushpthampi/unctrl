import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function useButtonInteraction({ button, gl, camera, changeVideo, invalidate }) {
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const glowMaterialRef = useRef();
  const originalColorRef = useRef();
  const isHoveringRef = useRef(false);
  const isFlashingRef = useRef(false);
  const idleAnimIdRef = useRef(null);
  const BASE_INTENSITY = 0.15;
  const HOVER_INTENSITY = 0.35;
  const FLASH_MAX_INTENSITY = 1.5;

  // glow material setup
  useEffect(() => {
    if (!button) return;
    const glowMat = button.material.clone();
    
    // Store original color and use it for subtle glow
    originalColorRef.current = glowMat.color.clone();
    glowMat.emissive = glowMat.color.clone();
    glowMat.emissiveIntensity = BASE_INTENSITY;
    
    if (typeof glowMat.toneMapped === "boolean") glowMat.toneMapped = false;
    button.material = glowMat;
    glowMaterialRef.current = glowMat;

    // Continuous subtle idle breathing animation
    const idleDuration = 2000; // Faster breathing cycle
    const animateIdle = (timestamp) => {
      if (!glowMaterialRef.current || !originalColorRef.current) {
        idleAnimIdRef.current = requestAnimationFrame(animateIdle);
        return;
      }
      
      const t = (timestamp % idleDuration) / idleDuration;
      
      // Only control the animation when not flashing
      if (!isFlashingRef.current) {
        const pulse = Math.sin(t * Math.PI * 2);
        const normalizedPulse = (pulse + 1) / 2; // 0 to 1
        
        if (isHoveringRef.current) {
          // Hover state: brighter pulsing
          const minIntensity = 0.25;
          const maxIntensity = 0.45;
          glowMaterialRef.current.emissiveIntensity = minIntensity + (normalizedPulse * (maxIntensity - minIntensity));
        } else {
          // Idle state: breathing from almost transparent to light white glow
          const minIntensity = 0.05; // Nearly transparent
          const maxIntensity = 0.25; // Visible white glow
          glowMaterialRef.current.emissiveIntensity = minIntensity + (normalizedPulse * (maxIntensity - minIntensity));
        }
        
        // Shift color from transparent to light white during breathing
        const whiteMix = normalizedPulse * 0.3; // Blend towards white
        glowMaterialRef.current.emissive.lerpColors(
          originalColorRef.current,
          new THREE.Color(0xffffff),
          whiteMix
        );
      }
      
      // Mark that we need a render
      if (invalidate) {
        invalidate();
      }
      
      idleAnimIdRef.current = requestAnimationFrame(animateIdle);
    };
    idleAnimIdRef.current = requestAnimationFrame(animateIdle);

    return () => {
      if (idleAnimIdRef.current) cancelAnimationFrame(idleAnimIdRef.current);
    };
  }, [button]);

  const flashButton = () => {
    if (!glowMaterialRef.current || !originalColorRef.current) return;
    isFlashingRef.current = true;

    const mat = glowMaterialRef.current;
    const startTime = performance.now();
    const flashUpMs = 100; // Quick flash up
    const flashDownMs = 400; // Smooth return
    const whiteColor = new THREE.Color(0xffffff);

    const animate = (now) => {
      const elapsed = now - startTime;
      
      if (elapsed <= flashUpMs) {
        // Flash to bright white
        const t = elapsed / flashUpMs;
        const intensity = BASE_INTENSITY + (FLASH_MAX_INTENSITY - BASE_INTENSITY) * t;
        mat.emissiveIntensity = intensity;
        
        // Lerp from original color to white
        mat.emissive.copy(originalColorRef.current).lerp(whiteColor, t);
        requestAnimationFrame(animate);
        return;
      }

      const returnElapsed = elapsed - flashUpMs;
      if (returnElapsed <= flashDownMs) {
        // Return to idle state smoothly
        const t = returnElapsed / flashDownMs;
        const eased = 1 - Math.pow(1 - t, 3); // Ease out cubic
        
        const targetIntensity = isHoveringRef.current ? HOVER_INTENSITY : BASE_INTENSITY;
        mat.emissiveIntensity = FLASH_MAX_INTENSITY + (targetIntensity - FLASH_MAX_INTENSITY) * eased;
        
        // Lerp from white back to original color
        mat.emissive.copy(whiteColor).lerp(originalColorRef.current, eased);
        requestAnimationFrame(animate);
        return;
      }

      // Flash complete, ensure we're back to original color and return to idle animation control
      mat.emissive.copy(originalColorRef.current);
      mat.emissiveIntensity = isHoveringRef.current ? HOVER_INTENSITY : BASE_INTENSITY;
      isFlashingRef.current = false;
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