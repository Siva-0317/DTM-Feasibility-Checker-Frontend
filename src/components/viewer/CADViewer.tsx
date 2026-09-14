"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Center } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Loader2 } from "lucide-react";
import { DefectMarker } from "./DefectMarker";
import { ViewerControls } from "./ViewerControls";
import { motion } from "framer-motion";

interface CADViewerProps {
  glbUrl: string | null;
  defects: { position: [number, number, number]; ruleId: string; ruleName: string }[];
  onModelLoaded: () => void;
  focusTarget: [number, number, number] | null;
}

function DoorModel({ url, onLoaded, isWireframe }: { url: string; onLoaded: () => void; isWireframe: boolean }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#8899aa",
    metalness: 0.6,
    roughness: 0.4,
    wireframe: isWireframe
  }), [isWireframe]);

  useEffect(() => {
    if (!scene) return;
    
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    onLoaded();
  }, [scene, material, onLoaded]);

  return (
    <group 
      ref={meshRef}
      onPointerDown={() => setIsInteracting(true)}
    >
      <primitive object={scene} />
      <boxHelper args={[scene, 0x333344]} />
    </group>
  );
}

function CameraController({ 
  focusTarget, 
  controlsRef 
}: { 
  focusTarget: [number, number, number] | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const [activeTarget, setActiveTarget] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    if (focusTarget) setActiveTarget(focusTarget);
  }, [focusTarget]);

  useFrame(() => {
    if (activeTarget && controlsRef.current) {
      const targetVec = new THREE.Vector3(...activeTarget);
      
      // Calculate offset for camera to look at the target from a distance
      const offset = new THREE.Vector3(150, 100, 150);
      const desiredCamPos = targetVec.clone().add(offset);
      
      camera.position.lerp(desiredCamPos, 0.05);
      controlsRef.current.target.lerp(targetVec, 0.05);
      controlsRef.current.update();
      
      // Stop moving when close enough
      if (camera.position.distanceTo(desiredCamPos) < 2 && controlsRef.current.target.distanceTo(targetVec) < 2) {
        setActiveTarget(null); // done animating
      }
    }
  });
  
  return null;
}

export function CADViewer({ glbUrl, defects, onModelLoaded, focusTarget }: CADViewerProps) {
  const [isWireframe, setIsWireframe] = useState(false);
  const [selectedDefectIdx, setSelectedDefectIdx] = useState<number | null>(null);
  const [localFocusTarget, setLocalFocusTarget] = useState<[number, number, number] | null>(focusTarget);
  
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (focusTarget) setLocalFocusTarget(focusTarget);
  }, [focusTarget]);

  const handleResetCamera = () => {
    setLocalFocusTarget([0, 0, 0]);
    setSelectedDefectIdx(null);
  };

  const handleFocusDefects = () => {
    if (defects.length > 0) {
      setLocalFocusTarget(defects[0].position);
      setSelectedDefectIdx(0);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-full bg-[#0d0d14] rounded-xl overflow-hidden border border-zinc-800 shadow-xl"
    >
      <Canvas
        camera={{ position: [0, 0, 2000], far: 10000, fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#0d0d14"]} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[100, 200, 100]} intensity={1.2} castShadow />
        <directionalLight position={[-100, -100, -100]} intensity={0.4} />

        <gridHelper args={[2000, 20, "#1a1a2e", "#1a1a2e"]} />
        
        <Center>
          <Suspense fallback={
            <Html center>
              <div className="flex flex-col items-center gap-3 text-zinc-400 bg-zinc-950/80 p-5 rounded-xl border border-zinc-800 backdrop-blur-sm shadow-xl">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm font-medium tracking-wide">Loading 3D Model...</span>
              </div>
            </Html>
          }>
            {glbUrl && <DoorModel url={glbUrl} onLoaded={onModelLoaded} isWireframe={isWireframe} />}
          </Suspense>

          {defects.map((defect, idx) => (
            <DefectMarker
              key={idx}
              position={defect.position}
              ruleId={defect.ruleId}
              ruleName={defect.ruleName}
              isSelected={selectedDefectIdx === idx}
              onClick={() => {
                setSelectedDefectIdx(idx);
                setLocalFocusTarget(defect.position);
              }}
            />
          ))}
        </Center>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
        />
        
        <CameraController focusTarget={localFocusTarget} controlsRef={controlsRef} />
      </Canvas>

      <ViewerControls 
        isWireframe={isWireframe}
        onToggleWireframe={() => setIsWireframe(!isWireframe)}
        onResetCamera={handleResetCamera}
        onFocusDefects={defects.length > 0 ? handleFocusDefects : undefined}
      />
    </motion.div>
  );
}
