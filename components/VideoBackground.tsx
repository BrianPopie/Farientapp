"use client";
import * as React from "react";

export default function VideoBackground({
  src = "/animation.mp4",
  poster = "/login-poster.jpg",
  overlay = 0.45,
  forceMotion = false
}: {
  src?: string;
  poster?: string;
  overlay?: number;
  forceMotion?: boolean;
}) {
  const [motionOK, setMotionOK] = React.useState(true);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (forceMotion) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionOK(!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [forceMotion]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
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
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onCanPlay={() => setReady(true)}
          onError={(e) => console.error("Video load error →", (e.target as HTMLVideoElement).src)}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 h-full w-full bg-center bg-cover"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-black" style={{ opacity: overlay }} />
      {!ready && motionOK && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white">
          Loading background...
        </div>
      )}
    </div>
  );
}
