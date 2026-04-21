'use client';

import React, { Suspense } from 'react';
import SceneCanvas from './SceneCanvas';
import GLBModel from './GLBModel';
import { Html } from '@react-three/drei';

function Loader() {
  return (
    <Html center className="text-white text-sm whitespace-nowrap">
      Loading Asset...
    </Html>
  );
}

// Simple ErrorBoundary to catch missing .glb files
class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Html
          center
          className="text-red-400 text-sm whitespace-nowrap bg-black/50 p-4 rounded-xl border border-red-500/50 backdrop-blur-md"
        >
          Missing local model. Please place <b>model.glb</b> in <b>public/assets/</b>
        </Html>
      );
    }
    return this.props.children;
  }
}

export default function HeroScene() {
  return (
    <SceneCanvas className="h-[500px] w-full">
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <ModelErrorBoundary>
        <Suspense fallback={<Loader />}>
          <GLBModel />
        </Suspense>
      </ModelErrorBoundary>
    </SceneCanvas>
  );
}
