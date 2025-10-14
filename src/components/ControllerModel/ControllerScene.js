import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import ControllerInner from "./ControllerInner";

// Auto-rotate wrapper that respects user interaction
function AutoRotate({ children, orbitControlsRef }) {
  const groupRef = useRef();
  const lastInteractionRef = useRef(Date.now());
  const [autoRotate, setAutoRotate] = useState(true);

  const AUTO_ROTATE_DELAY = 3000; // 3s inactivity
  const ROTATE_SPEED = 0.0015;    // very slow rotation

  // Detect user interaction
  useEffect(() => {
    const controls = orbitControlsRef.current;
    if (!controls) return;

    const onStart = () => {
      lastInteractionRef.current = Date.now();
      setAutoRotate(false);
    };
    controls.addEventListener("start", onStart);
    return () => controls.removeEventListener("start", onStart);
  }, [orbitControlsRef]);

  useFrame(() => {
    if (!groupRef.current) return;

    if (!autoRotate && Date.now() - lastInteractionRef.current >= AUTO_ROTATE_DELAY) {
      setAutoRotate(true);
    }

    if (autoRotate) {
      groupRef.current.rotation.y += ROTATE_SPEED;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function ControllerScene({ animateIn }) {
  const [cameraPos, setCameraPos] = useState([0, 15, 55]);
  const [modelScale, setModelScale] = useState([0.35, 0.35, 0.35]);
  const [isMobile, setIsMobile] = useState(false);
  const [dpr, setDpr] = useState([1, 1.25]);
  const orbitControlsRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setCameraPos([0, 15, 55]);
        setModelScale([0.35, 0.35, 0.35]); // slightly bigger for mobile
        setDpr([1.5, 2]);                  // higher DPR for crispness
      } else {
        setCameraPos([0, 15, 45]);
        setModelScale([0.4, 0.4, 0.4]);
        setDpr([1, 1.25]);                 // normal DPR for desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Canvas
      className="w-full h-[90vh] r3f-canvas"
      dpr={dpr}
      camera={{ position: cameraPos, fov: 15 }}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: "low-power" }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        {/* Lights */}
        <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={2.8} />
        <directionalLight position={[10, 20, 10]} intensity={4.5} />
        <directionalLight position={[-10, 10, -10]} intensity={2.5} color={0xb0d0ff} />
        <ambientLight intensity={50.5} />

        {/* Environment map */}
        {typeof window !== "undefined" && (
          <Environment preset="city" blur={isMobile ? 1 : 0} resolution={isMobile ? 32 : 256} />
        )}

        <rectAreaLight width={15} height={10} intensity={6} color={0xffffff} position={[0, 10, 30]} lookAt={[0,0,0]} />

        {/* Auto-rotate wrapper */}
        <AutoRotate orbitControlsRef={orbitControlsRef}>
          <group position={[2, -5, 0]} scale={modelScale}>
            <ControllerInner animateIn={animateIn} />
          </group>
        </AutoRotate>
      </Suspense>

      <OrbitControls
        ref={orbitControlsRef}
        enableZoom={isMobile}
        enablePan={false}
        enableRotate={true}
        minDistance={20}
        maxDistance={65}
      />
    </Canvas>
  );
}
