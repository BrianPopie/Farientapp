import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import VideoBackground from "@/components/VideoBackground";

export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-background">
      <VideoBackground />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border/70 bg-card px-6 py-8 text-black dark:text-card-foreground shadow-elev-3 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/brand.svg" alt="Farient logo" width={48} height={48} className="rounded-xl" priority />
          <div className="text-xs uppercase tracking-[0.35em] text-black dark:text-muted-foreground">Farient Deal Intelligence</div>
          <h1 className="text-xl font-semibold text-black dark:text-foreground">Login</h1>
        </div>
        <LoginForm />
        <div className="mt-4 text-center text-sm text-black dark:text-muted-foreground">
          <Link
            href="/dashboard"
            prefetch={false}
            className="focus-ring underline-offset-4 hover:underline"
          >
            Continue
          </Link>
        </div>
      </div>
    </main>
  );
}
