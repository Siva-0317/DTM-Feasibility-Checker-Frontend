"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";

interface DefectMarkerProps {
  position: [number, number, number];
  ruleId: string;
  ruleName: string;
  isSelected: boolean;
  onClick: () => void;
}

export function DefectMarker({ position, ruleId, ruleName, isSelected, onClick }: DefectMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Pulse animation: 2Hz frequency
      const scale = 1.0 + 0.2 * Math.sin(clock.elapsedTime * 2 * Math.PI * 2);
      const baseScale = isSelected ? 1.3 : 1.0;
      meshRef.current.scale.set(baseScale * scale, baseScale * scale, baseScale * scale);
    }
  });

  const color = isSelected ? "#ff4466" : "#ff2244";

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      <Line points={[[0, 0, 0], [0, 50, 0]]} color={color} lineWidth={2} />
      
      {isSelected && (
        <Html position={[0, 55, 0]} center zIndexRange={[100, 0]}>
          <div
            style={{
              background: "#1a0000",
              border: `1px solid ${color}`,
              padding: "6px 10px",
              borderRadius: "6px",
              color: "#ff6677",
              fontSize: "12px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              boxShadow: `0 0 10px ${color}40`,
            }}
          >
            Rule {ruleId}: {ruleName}
          </div>
        </Html>
      )}
    </group>
  );
}
