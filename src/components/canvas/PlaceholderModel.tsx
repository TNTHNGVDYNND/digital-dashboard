"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";

export default function PlaceholderModel() {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current as { rotation: { x: number; y: number } }).rotation.x =
        state.clock.elapsedTime * 0.5;
      (meshRef.current as { rotation: { x: number; y: number } }).rotation.y =
        state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Box ref={meshRef} args={[1, 1, 1]}>
      <meshStandardMaterial color="#6366f1" />
    </Box>
  );
}
