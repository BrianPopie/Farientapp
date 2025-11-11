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
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (forceMotion) {
      setMotionOK(true);
      return;
    }
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
            "radial-gradient(1200px 800px at 60% -10%, rgba(56,189,248,.25) 0%, rgba(56,189,248,0) 55%)," +
            "radial-gradient(1200px 800px at 85% 110%, rgba(34,197,94,.18) 0%, rgba(34,197,94,0) 60%)"
        }}
      />
      {motionOK && !err ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          poster={poster}
          onError={(e) => {
            const el = e.currentTarget as HTMLVideoElement;
            console.error("Video error:", el.currentSrc);
            setErr("Video failed to decode (check codec/path)");
          }}
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
      {err && (
        <div className="pointer-events-auto absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-[11px] text-white">
          {err}
        </div>
      )}
    </div>
  );
}
