"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export default function SceneCanvas({ children, className = "" }: SceneCanvasProps) {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
