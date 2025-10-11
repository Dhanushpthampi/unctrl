"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import ControllerInner from "./ControllerInner";

export default function ControllerScene({ animateIn }) {
  return (
    <Canvas
      className="w-full h-[90vh] r3f-canvas"
      dpr={[1, 1.25]}
      camera={{ position: [0, 15, 45], fov: 15 }}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: "low-power", preserveDrawingBuffer: false }}
      frameloop="always"
      onCreated={({ gl }) => {
        gl.getContext().getExtension("WEBGL_lose_context");
      }}
    >
      <Suspense fallback={null}>
        {/* Lights */}
        <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={2.8} />
        <directionalLight position={[10, 20, 10]} intensity={4.5} />
        <directionalLight position={[-10, 10, -10]} intensity={2.5} color={0xb0d0ff} />
        <ambientLight intensity={50.5} />

        {/* Environment reflections */}
        {/* Skip heavy environment on small screens */}
        {typeof window !== "undefined" && window.innerWidth > 768 ? (
          <Environment preset="city" />
        ) : null}

        {/* Optional front fill light */}
        <rectAreaLight
          width={15}
          height={10}
          intensity={6}
          color={0xffffff}
          position={[0, 10, 30]}
          lookAt={[0, 0, 0]}
        />

        {/* Controller model */}
        <group position={[2, -5, 0]} scale={[0.4, 0.4, 0.4]}>
          <ControllerInner animateIn={animateIn} />
        </group>
      </Suspense>

      <OrbitControls enableZoom={false} enablePan enableRotate />
    </Canvas>
  );
}