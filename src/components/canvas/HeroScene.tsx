"use client";

import SceneCanvas from "./SceneCanvas";
import PlaceholderModel from "./PlaceholderModel";

export default function HeroScene() {
  return (
    <SceneCanvas className="h-[500px] w-full">
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <PlaceholderModel />
    </SceneCanvas>
  );
}
