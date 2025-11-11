import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import VideoBackground from "@/components/VideoBackground";
import { ThemeToggle } from "@/components/ThemeToggle";

export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden">
      <VideoBackground />
      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle className="text-white border-white/30 hover:bg-white/10" />
      </div>
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white/10 px-6 py-8 text-white shadow-xl ring-1 ring-white/15 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/brand.svg" alt="Farient logo" width={48} height={48} className="rounded-xl" priority />
          <div className="text-xs uppercase tracking-[0.35em] text-white/70">Farient Deal Intelligence</div>
          <h1 className="text-xl font-semibold text-white">Login</h1>
        </div>
        <LoginForm />
        <div className="mt-4 text-center text-sm text-white/80">
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
