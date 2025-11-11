"use client";

import { useEffect, useRef } from "react";

type RenderProbeProps = {
  label: string;
};

export function RenderProbe({ label }: RenderProbeProps) {
  const renders = useRef(0);
  renders.current += 1;
  console.log(`${label} renders:`, renders.current);

  useEffect(() => {
    console.log(`${label} effect fired`);
  });

  return null;
}
