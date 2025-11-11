"use client";

import * as React from "react";

type Props = {
  src?: string;
  poster?: string;
  className?: string;
  overlayOpacity?: number;
};

export default function VideoBackground({
  src = "/animation.mp4",
  poster = "/login-poster.jpg",
  className = "",
  overlayOpacity = 40
}: Props) {
  const [motionOK, setMotionOK] = React.useState(true);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setMotionOK(!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 60% -10%, rgba(56,189,248,.25) 0%, rgba(56,189,248,0) 55%), radial-gradient(1200px 800px at 85% 110%, rgba(34,197,94,.18) 0%, rgba(34,197,94,0) 60%)"
        }}
      />
      {motionOK ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 h-full w-full bg-center bg-cover"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />
    </div>
  );
}
