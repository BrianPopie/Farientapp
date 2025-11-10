"use client";
import * as React from "react";

type Props = {
  src?: string;
  poster?: string;
  className?: string;
};

export default function VideoBackground({ src = "/animation.mp4", poster, className = "" }: Props) {
  const [motionOK, setMotionOK] = React.useState(true);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setMotionOK(!mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      {motionOK ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          {...(poster ? { poster } : {})}
        />
      ) : (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={poster ? { backgroundImage: `url(${poster})` } : { background: "radial-gradient(circle at 30% 20%, rgba(99,102,241,0.35), transparent 55%)" }}
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_-20%,rgba(0,0,0,.35)_0%,rgba(0,0,0,.65)_40%,rgba(0,0,0,.85)_100%)]" />
    </div>
  );
}
