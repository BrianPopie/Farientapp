import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import VideoBackground from "@/components/VideoBackground";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-background">
      <VideoBackground
        src="/animation.mp4"
        poster="/login-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
        forceVideo
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-background/80 to-background dark:from-black/40 dark:via-background/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.15),_transparent_55%)] dark:bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.35),_transparent_60%)]" />
      </div>
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border/70 bg-card px-6 py-8 text-card-foreground shadow-elev-3 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/brand.svg" alt="Farient logo" width={48} height={48} className="rounded-xl" priority />
          <div className="text-xs uppercase tracking-[0.35em] text-black dark:text-muted-foreground">Farient Deal Intelligence</div>
          <h1 className="text-xl font-semibold text-black dark:text-foreground">Login</h1>
        </div>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          <Link
            href="/dashboard"
            prefetch={false}
            className="focus-ring text-primary underline-offset-4 hover:underline"
          >
            Continue
          </Link>
        </div>
      </div>
    </main>
  );
}
