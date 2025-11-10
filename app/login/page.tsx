import Image from "next/image";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-[#030712]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.25),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(15,23,42,0.85),_transparent_60%)]" />
      </div>
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/15 bg-white/5 px-6 py-8 text-white shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/brand.svg" alt="Farient logo" width={48} height={48} className="rounded-xl" priority />
          <div className="text-xs uppercase tracking-[0.35em] text-white/60">Farient Deal Intelligence</div>
          <h1 className="text-xl font-semibold">Login</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
