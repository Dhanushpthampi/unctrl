"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useState, useEffect, useRef } from "react";
import useImagePlane from "./useVideoPlane"; 
import useButtonInteraction from "./useButtonInteraction";

// Lazy preload GLB
if (typeof window !== "undefined") {
  useGLTF.preload("/models/c3d.glb");
  requestIdleCallback?.(() => {
    ["/assets/usps/1.png", "/assets/usps/2.png"].forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = src;
    });
  });
}

export default function ControllerInner() {
  // Setup Draco loader
  const dracoLoader = new DRACOLoader();
  // Use Google's CDN for Draco decoders to avoid waiting for local assets
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  dracoLoader.setDecoderConfig({ type: "wasm" });

  const { scene, nodes } = useGLTF("/models/c3d.glb", true, undefined, dracoLoader);
  const { gl, camera, invalidate } = useThree();
  const [videoIndex, setVideoIndex] = useState(1);
  const videoRef = useRef(null);
  const planeRef = useRef(null);

  const changeVideo = () => setVideoIndex((prev) => (prev >= 5 ? 1 : prev + 1));

  // Setup model scale/position once
  useEffect(() => {
    if (!scene) return;
    scene.scale.setScalar(0.2);
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
  }, [scene]);

  // Plane & video logic
  useImagePlane({ nodes, scene, videoIndex, videoRef, planeRef, invalidate });

  // Button glow + click logic
  useButtonInteraction({ button: nodes.left_buttons, gl, camera, changeVideo, invalidate });

  // Force continuous rendering for smooth animations
  useFrame(() => {
    // Empty - just keeps the render loop active
  });

  return <primitive object={scene} />;
}