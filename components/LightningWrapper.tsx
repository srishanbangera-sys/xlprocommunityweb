// components/LightningWrapper.tsx
"use client"

import dynamic from "next/dynamic";

const Lightning = dynamic(() => import("./lightning"), { ssr: false });

export default function LightningWrapper() {
  return (
    <div className="hidden lg:block pointer-events-none absolute inset-0 -z-10">
      <Lightning hue={120} /> 
    </div>
  );
}
