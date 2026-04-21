"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

export default function GLBModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  // Pointing to a local file instead of a remote URL to prevent CORS/AdBlocker interference.
  // Please ensure you place a valid .glb file at public/assets/model.glb
  const { scene } = useGLTF("/assets/model.glb");

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <primitive 
        ref={meshRef}
        object={scene} 
        scale={15}
        position={[0, -2, 0]}
        rotation={[0.1, 0, 0]}
      />
      <Environment preset="city" />
    </Float>
  );
}
