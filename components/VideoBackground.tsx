"use client";
import * as React from "react";

type NetworkInformation = {
  saveData?: boolean;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformation;
};

type Props = {
  src?: string;
  poster?: string;
  className?: string;
  forceVideo?: boolean;
};

export default function VideoBackground({ src = "/animation.mp4", poster, className = "", forceVideo = false }: Props) {
  const [shouldPlayVideo, setShouldPlayVideo] = React.useState(() => forceVideo);

  React.useEffect(() => {
    if (forceVideo) {
      setShouldPlayVideo(true);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const nav = navigator as NavigatorWithMemory;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      const prefersReducedMotion = mediaQuery.matches;
      const connection = nav.connection;
      const saveData = Boolean(connection?.saveData);
      const deviceMemory = typeof nav.deviceMemory === "number" ? nav.deviceMemory : undefined;
      const lowMemory = typeof deviceMemory === "number" && deviceMemory <= 4;
      const disableParam = new URLSearchParams(window.location.search).has("novideo");
      let embedded = false;
      try {
        embedded = typeof window.top !== "undefined" && window.top !== window.self;
      } catch {
        embedded = true;
      }
      setShouldPlayVideo(!(prefersReducedMotion || saveData || lowMemory || disableParam || embedded));
    };

    evaluate();

    const handleChange = () => evaluate();
    mediaQuery.addEventListener?.("change", handleChange);
    nav.connection?.addEventListener?.("change", handleChange);

    return () => {
      mediaQuery.removeEventListener?.("change", handleChange);
      nav.connection?.removeEventListener?.("change", handleChange);
    };
  }, [forceVideo]);

  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      {shouldPlayVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          {...(poster ? { poster } : {})}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={
            poster
              ? { backgroundImage: `url(${poster})` }
              : { background: "radial-gradient(circle at 30% 20%, rgba(99,102,241,0.35), transparent 55%)" }
          }
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_-20%,rgba(0,0,0,.25)_0%,rgba(0,0,0,.55)_40%,rgba(0,0,0,.75)_100%)]" />
    </div>
  );
}
