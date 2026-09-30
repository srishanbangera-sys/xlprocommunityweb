"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const PixelBlast = dynamic(() => import("./PixelBlast"), { ssr: false });

export default function PixelBlastWrapper() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!windowSize.width || !windowSize.height) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 w-full h-full">
      <PixelBlast
        variant="square"
        pixelSize={6}
        color="#B19EEF"
        patternScale={1.5}
        patternDensity={1}          // reduced from 2 → less dense
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.3}
        rippleThickness={0.10}
        rippleIntensityScale={0.8}  // reduced from 1.5 → less intense
        liquid={false}
        speed={0.6}
        edgeFade={0.25}
        transparent
        width={windowSize.width}
        height={windowSize.height}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

